import { HttpException, Injectable } from '@nestjs/common';
import {
  getCertificateDataSchema,
  getWebsitePostSchema,
  getWebsiteSchema,
} from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { parseTitle } from 'src/utils/commonUtils';
import { res } from 'src/utils/response';

const getWebsite = async (title: string) => {
  const [website] =
    await sql`select *, (select plan from churches where id = "churchId"),
     (select count(*) from posts where "churchId" = websites."churchId") as blog,
     (select count(*) from events where "churchId" = websites."churchId") as "eventPage" from "websites" where ${parseTitle('title', true)} = ${parseTitle(title)}`;
  if (!website || website?.plan === 0)
    throw new HttpException('No se encontro la pagina', 404);
  return website;
};

@Injectable()
export class WebsitesService {
  async getWebsiteStart(query: z.infer<typeof getWebsiteSchema>) {
    try {
      const website = await getWebsite(query.title);

      const images =
        await sql`select * from "churchimages" where "churchId" = ${website.churchId}`;

      const activities =
        await sql`select "title","text","img","date" from "activities" where "churchId" = ${website.churchId}`;

      await sql`insert into websiteviews ("websiteId") values (${website.id})`;

      return res(200, { ...website, images, activities });
    } catch (err) {
      throw new HttpException('No se encontro la pagina', 404);
    }
  }

  async getWebsiteEvents(query: z.infer<typeof getWebsiteSchema>) {
    try {
      const website = await getWebsite(query.title);

      const events =
        await sql`select "title","date","img","description" from "events" where "churchId" = ${website.churchId} order by date desc`;

      return res(200, { ...website, events });
    } catch (err) {
      throw new HttpException('No se encontro la pagina', 404);
    }
  }

  async getWebsitePosts(query: z.infer<typeof getWebsiteSchema>) {
    try {
      const website = await getWebsite(query.title);

      const posts =
        await sql`select title, img, description from posts where "churchId" = ${website.churchId} order by publication desc, id desc`;

      return res(200, { ...website, posts });
    } catch (err) {
      throw new HttpException('No se encontro la pagina', 404);
    }
  }

  async getPost(query: z.infer<typeof getWebsitePostSchema>) {
    try {
      const website = await getWebsite(query.title);

      const [post] =
        await sql`select id, title, body, description, publication, img from posts where "churchId" = ${parseInt(website.churchId)} and ${parseTitle('title', true)} = ${parseTitle(query.post)}`;
      if (!post) throw new HttpException('No se encontro el post', 404);

      await sql`insert into postviews ("postId") values (${post.id})`;

      return res(200, { website, post });
    } catch (err) {
      throw new HttpException('No se encontro la pagina', 404);
    }
  }

  async getCertificate(query: z.infer<typeof getCertificateDataSchema>) {
    try {
      const [certificate] =
        await sql`select * from certificates where code = ${query.code}`;
      if (!certificate)
        throw new HttpException('No se encontro el certificado', 400);

      let [website] =
        await sql`select (select plan from churches where id = "churchId"), "title" from "websites" where "churchId" = ${certificate.churchId}`;
      if (website?.plan === 0) website = null;

      return res(200, { website, certificate });
    } catch (err) {
      throw new HttpException('No se encontro el certificado', 400);
    }
  }
}
