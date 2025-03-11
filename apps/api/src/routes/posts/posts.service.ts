import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  DeleteSchema,
  EditSchema,
  GetOneSchema,
  GetSchema,
  PostSchema,
} from 'schemas/dist/posts.schema';
import { z } from 'zod';
import sql from 'src/utils/db';
import { parseTitle } from 'src/utils/commonUtils';
import { deleteImage, uploadImage } from 'src/utils/spaceStorageUtils';
import { File } from '@nest-lab/fastify-multer';

@Injectable()
export class PostsService {
  constructor(private readonly req: ContextProvider) {}

  async getOne(dto: z.infer<typeof GetOneSchema>) {
    const data =
      await sql`SELECT id, title, body, description FROM posts WHERE "churchId" = ${this.req.getChurchId()} AND id = ${dto.id}`;

    if (data.length === 0) throw new HttpException('', 404);
    return data[0];
  }

  async get(query: z.infer<typeof GetSchema>) {
    const rows = await sql`
    SELECT id, title, publication, description, COUNT(*) OVER () AS count
    FROM posts
    WHERE "churchId" = ${this.req.getChurchId()}
    AND (${query.title ? sql`LOWER(title) LIKE LOWER('%' || ${query.title} || '%')` : sql`1=1`})
    ORDER BY id DESC
    LIMIT 6 OFFSET ${6 * (parseInt(query.page) - 1)}
  `;

    const [{ title }] =
      await sql`select title from websites where "churchId" = ${this.req.getChurchId()}`;

    return { rows, count: rows[0]?.count || 0, websiteTitle: title };
  }

  async post(body: z.infer<typeof PostSchema>, file: File) {
    const [sameName] =
      await sql`select 1 from "posts" where ${parseTitle('title', true)} = ${parseTitle(body.title)} and "churchId" = ${this.req.getChurchId()}`;
    if (sameName)
      throw new HttpException('Ya existe un post con ese nombre', 400);

    const data = { ...body, churchId: this.req.getChurchId() };

    if (!file) throw new HttpException('No se pudo procesar la imagen', 400);
    const url = await uploadImage(file);

    return await sql`insert into posts ${sql({ ...data, img: url })}`;
  }

  async edit(body: z.infer<typeof EditSchema>, file: File) {
    const [isTheSame] = await sql`select 1 from "posts" where ${parseTitle(
      (await sql`(select "title" from "posts" where id = ${body.id})`)[0].title,
      false,
    )} = ${parseTitle(body.title)}`;

    if (!isTheSame) {
      const [sameName] =
        await sql`select 1 from "posts" where ${parseTitle('title', true)} = ${parseTitle(body.title)} and "churchId" = ${this.req.getChurchId()}`;
      if (sameName)
        throw new HttpException('Ya existe un post con ese nombre', 400);
    }

    let values: Record<string, any> = body;

    if (file) {
      const [{ img }] =
        await sql`select "img" from "activities" where "id" =  ${body.id}`;
      if (img) {
        await deleteImage(img);
      }

      const url = await uploadImage(file);

      values = { ...body, img: url };
    }

    return await sql`update posts set ${sql(values)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
  }

  async delete(body: z.infer<typeof DeleteSchema>) {
    const [result] =
      await sql`select "img" from "posts" where "id" = ${body.id}`;
    if (!result) throw new HttpException('No se encontro la imagen', 404);
    if (result.img) {
      const url = result.img;
      deleteImage(url);
    }

    return await sql`delete from posts where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
  }

  async getStats() {
    const posts = (
      await sql`select count(*) from posts WHERE "churchId" = ${this.req.getChurchId()} `
    )[0].count;

    const views = (
      await sql`
        SELECT COUNT(*)
        FROM "postviews"
        WHERE (select "churchId" from posts where "postId" = id) = ${this.req.getChurchId()}
        AND created_at >= NOW() - INTERVAL '30 days'
      `
    )[0].count;

    const postsMonthly = (
      await sql`
        SELECT COUNT(*)
        FROM "posts"
        WHERE "churchId" = ${this.req.getChurchId()}
        AND publication >= NOW() - INTERVAL '30 days'
      `
    )[0].count;

    return { posts, views, postsMonthly };
  }
}
