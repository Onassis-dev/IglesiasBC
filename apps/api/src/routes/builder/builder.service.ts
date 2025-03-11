import { HttpException, Injectable } from '@nestjs/common';
import sql from 'src/utils/db';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { parseTitle } from 'src/utils/commonUtils';
import { deleteImage, uploadImage } from 'src/utils/spaceStorageUtils';
import { z } from 'zod';
import {
  DeleteActivitySchema,
  DeleteChurchImageSchema,
  DeleteEventSchema,
  EditActivitySchema,
  StartSchema,
  UploadActivitySchema,
  UploadEventSchema,
  WebsiteSchema,
} from 'schemas/dist/builder.schema';
import { File } from '@nest-lab/fastify-multer';

const eventsLimit = 20;
const imagesLimit = 12;
const activityLimit = 8;

@Injectable()
export class BuilderService {
  constructor(private readonly req: ContextProvider) {}

  async getWebsiteInfo() {
    const result =
      await sql`select "title", "id" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async getWebsite() {
    const result =
      await sql`select "title", "structure", "style","language","pastors","servicesDates","facebookLink","instagramLink","whatsappLink","mission","mapsLink","youtubeLink","donationLink","preachLink","animations","about","color","description","ubication" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async getStart() {
    const result =
      await sql`select "preachLink" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async editStart(body: z.infer<typeof StartSchema>) {
    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    await sql`
        UPDATE "websites" SET ${sql(body)} WHERE "churchId" = ${this.req.getChurchId()}`;

    return;
  }

  async createWebsite(body: z.infer<typeof WebsiteSchema>) {
    const [churchExist] =
      await sql`select 1 from "churches" where "id" = ${this.req.getChurchId()}`;
    if (!churchExist)
      throw new HttpException('Aun no has registrado tu iglesia', 400);

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (webExists) throw new HttpException('Ya registraste tu pagina web', 400);

    const [sameName] =
      await sql`select 1 from "websites" where ${parseTitle('title', true)} = ${parseTitle(body.title)}`;
    if (sameName)
      throw new HttpException('Ya existe una pagina con ese nombre', 400);
    if (!isNaN(parseInt(body.title)))
      throw new HttpException('No puedes usar un numero como title', 400);

    const data = { ...body, churchId: this.req.getChurchId() };

    await sql`
        INSERT INTO "websites" ${sql(data)}`;
    return;
  }

  async editWebsite(body: z.infer<typeof WebsiteSchema>) {
    const [isTheSame] =
      await sql`select 1 from "websites" where ${parseTitle((await sql`(select "title" from "websites" where "churchId" = ${this.req.getChurchId()})`)[0].title, false)} = ${parseTitle(body.title)}`;
    if (!isTheSame) {
      const [sameName] =
        await sql`select 1 from "websites" where ${parseTitle('title', true)} = ${parseTitle(body.title)} `;
      if (sameName)
        throw new HttpException('Ya existe una pagina con ese nombre', 400);
      if (!isNaN(parseInt(body.title)))
        throw new HttpException('No puedes usar un numero como title', 400);
    }

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    await sql`UPDATE "websites" SET ${sql(body)} WHERE "churchId" = ${this.req.getChurchId()}`;

    return;
  }

  async getLogo() {
    const result =
      await sql`select "logo" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async uploadLogo(file: File) {
    if (!file) throw new HttpException('Falta la imagen', 400);

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    const [{ logo }] =
      await sql`select "logo" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (logo) {
      const url = logo;
      deleteImage(url);
    }

    const url = await uploadImage(file);

    await sql`update "websites" set "logo" = ${url} where "churchId" = ${this.req.getChurchId()}`;
    return;
  }

  async getPastorsImg() {
    const result =
      await sql`select "pastorsImg" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async uploadPastorsImg(file: File) {
    if (!file) throw new HttpException('Falta la imagen', 400);

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    const [{ pastorsImg }] =
      await sql`select "pastorsImg" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (pastorsImg) {
      const url = pastorsImg;
      deleteImage(url);
    }

    const url = await uploadImage(file);

    await sql`update "websites" set "pastorsImg" = ${url} where "churchId" = ${this.req.getChurchId()}`;
    return;
  }

  async getCoverImg() {
    const result =
      await sql`select "coverImg" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async uploadCoverImg(file: File) {
    if (!file) throw new HttpException('Falta la imagen', 400);

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    const [{ coverImg }] =
      await sql`select "coverImg" from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (coverImg) {
      const url = coverImg;
      deleteImage(url);
    }

    const url = await uploadImage(file);

    await sql`update "websites" set "coverImg" = ${url} where "churchId" = ${this.req.getChurchId()}`;
    return;
  }

  async getEvents() {
    const result =
      await sql`select * from "events" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async uploadEvent(query: z.infer<typeof UploadEventSchema>, file: File) {
    const date = new Date(query.date);
    if (date.toString() === 'Invalid Date')
      throw new HttpException('Fecha invalida', 400);

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    const events =
      await sql`select "title" from "events" where "churchId" = ${this.req.getChurchId()}`;
    if (events.length >= eventsLimit)
      throw new HttpException(
        `Puedes registrar un maximo de ${eventsLimit} eventos a la vez`,
        400,
      );
    if (events.some((event) => event.title === query.title))
      throw new HttpException('Ya existe un evento con ese title', 400);

    let url = null;
    if (file) url = await uploadImage(file);

    await sql`insert into "events" ("title", "img", "date", "churchId" ) values (${query.title}, ${url}, ${date}, ${this.req.getChurchId()})`;
    return;
  }

  async deleteEvent(body: z.infer<typeof DeleteEventSchema>) {
    const [result] =
      await sql`select "img" from "events" where "id" = ${body.eventId}`;
    if (!result) throw new HttpException('No se encontro la imagen', 404);
    if (result.img) {
      const url = result.img;
      deleteImage(url);
    }

    await sql`delete from "events" where "id" = ${body.eventId}`;
    return;
  }

  async getChurchImages() {
    const result =
      await sql`select "img" from "churchimages" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async uploadChurchImage(file: File) {
    if (!file) throw new HttpException('Falta la imagen', 400);

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    const [result] =
      await sql`select count(*) from "churchimages" where "churchId" = ${this.req.getChurchId()}`;
    if (result.count >= imagesLimit)
      throw new HttpException(
        `Puedes registrar un maximo de ${imagesLimit} imagenes`,
        400,
      );

    const url = await uploadImage(file);

    await sql`insert into "churchimages" ("img", "churchId") values (${url}, ${this.req.getChurchId()})`;
    return;
  }

  async deleteChurchImage(body: z.infer<typeof DeleteChurchImageSchema>) {
    const [result] =
      await sql`select "img" from "churchimages" where "img" = ${body.imageUrl}`;
    if (!result) throw new HttpException('No se encontro la imagen', 404);

    const url = result.img;
    deleteImage(url);

    await sql`delete from "churchimages" where "img" = ${body.imageUrl}`;
    return;
  }

  async uploadActivity(
    query: z.infer<typeof UploadActivitySchema>,
    file: File,
  ) {
    if (!file) throw new HttpException('Falta la imagen', 400);

    const [webExists] =
      await sql`select 1 from "websites" where "churchId" = ${this.req.getChurchId()}`;
    if (!webExists)
      throw new HttpException('Aun no registraste una pagina web', 400);

    const [{ result }] =
      await sql`select count(*) from "activities" where "churchId" = ${this.req.getChurchId()}`;
    if (result) {
      if (result.count >= activityLimit)
        throw new HttpException(
          `Puedes registrar un maximo de ${activityLimit} actividades a la vez`,
          400,
        );
    }

    const url = await uploadImage(file);

    await sql`insert into "activities" ("title", "img", "text", "churchId" ) values (${query.title}, ${url}, ${query.text}, ${this.req.getChurchId()})`;
    return;
  }

  async getActivities() {
    const result =
      await sql`select * from "activities" where "churchId" = ${this.req.getChurchId()}`;
    return result;
  }

  async deleteActivity(body: z.infer<typeof DeleteActivitySchema>) {
    const [result] =
      await sql`select "img" from "activities" where "id" = ${body.id}`;
    if (!result) throw new HttpException('No se encontro la imagen', 404);
    const url = result.img;
    deleteImage(url);

    await sql`delete from "activities" where "id" = ${body.id}`;
    return;
  }

  async editActivity(query: z.infer<typeof EditActivitySchema>, file: File) {
    const [activityExists] =
      await sql`select 1 from "activities" where "id" = ${query.id}`;
    if (!activityExists)
      throw new HttpException('No se encontro la actividad a editar', 400);

    await sql`
        UPDATE "activities" SET ${sql(query)} where id = ${query.id}`;

    if (!file) return;

    const [{ img }] =
      await sql`select "img" from "activities" where "id" =  ${query.id}`;
    if (img) {
      const url = img;
      deleteImage(url);
    }

    const url = await uploadImage(file);
    await sql`
        update "activities"
        set "img" = ${url}
        WHERE "id" = ${query.id}`;
    return;
  }
}
