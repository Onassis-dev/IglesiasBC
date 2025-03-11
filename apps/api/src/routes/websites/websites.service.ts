import { HttpException, Injectable } from '@nestjs/common';
import { getPostSchema, getWebsiteSchema } from './websites.schema';
import { z } from 'zod';
import sql from 'src/utils/db';
import { parseTitle } from 'src/utils/commonUtils';

@Injectable()
export class WebsitesService {
  async getWebsiteStart(query: z.infer<typeof getWebsiteSchema>) {
    try {
      const [website] =
        await sql`select *, (select plan from users where id = (select "ownerId" from churches where id = "churchId")), (select count(*) from posts where "churchId" = websites."churchId") as blog from "websites" where ${parseTitle('title', true)} = ${parseTitle(query.title)}`;
      if (!website || website?.plan === 0)
        throw new HttpException('No se encontro la pagina', 404);

      const images =
        await sql`select * from "churchimages" where "churchId" = ${website.churchId}`;

      await sql`insert into websiteviews ("websiteId") values (${website.id})`;

      return { ...website, images };
    } catch (err) {
      throw new HttpException('', 404);
    }
  }

  async getWebsiteEvents(query: z.infer<typeof getWebsiteSchema>) {
    try {
      const [website] =
        await sql`select (select plan from users where id = (select "ownerId" from churches where id = "churchId")), (select count(*) from posts where "churchId" = websites."churchId") as blog, "churchId","color","title","structure","style","logo", "language","facebookLink","youtubeLink","donationLink","preachLink","whatsappLink","mapsLink","instagramLink", "animations" from "websites" where ${parseTitle('title', true)} = ${parseTitle(query.title)}`;
      if (!website || website?.plan === 0)
        throw new HttpException('No se encontro la pagina', 404);

      const events =
        await sql`select "title","date","img" from "events" where "churchId" = ${website.churchId} order by date desc`;

      return { ...website, events };
    } catch (err) {
      throw new HttpException('', 404);
    }
  }

  async getWebsitePosts(query: z.infer<typeof getWebsiteSchema>) {
    try {
      const [website] =
        await sql`select (select plan from users where id = (select "ownerId" from churches where id = "churchId")), (select count(*) from posts where "churchId" = websites."churchId") as blog, "churchId","color","title","structure","style","logo", "language","facebookLink","youtubeLink","donationLink","preachLink","whatsappLink","mapsLink","instagramLink", "animations" from "websites" where ${parseTitle('title', true)} = ${parseTitle(query.title)}`;
      if (!website || website?.plan === 0)
        throw new HttpException('No se encontro la pagina', 404);

      const posts =
        await sql`select title, img, description from posts where "churchId" = ${website.churchId} order by publication desc, id desc`;

      return { ...website, posts };
    } catch (err) {
      throw new HttpException('', 404);
    }
  }

  async getWebsiteServices(query: z.infer<typeof getWebsiteSchema>) {
    try {
      const [website] =
        await sql`select (select plan from users where id = (select "ownerId" from churches where id = "churchId")), (select count(*) from posts where "churchId" = websites."churchId") as blog, "churchId","title","color","structure","style","logo", "language","facebookLink","youtubeLink","donationLink","preachLink","whatsappLink","mapsLink","instagramLink","animations", "servicesDates" from "websites" where ${parseTitle('title', true)} = ${parseTitle(query.title)}`;
      if (!website || website?.plan === 0)
        throw new HttpException('No se encontro la pagina', 404);

      const activities =
        await sql`select "title","text","img" from "activities" where "churchId" = ${website.churchId}`;

      return { ...website, activities };
    } catch (err) {
      throw new HttpException('', 404);
    }
  }

  async getPost(query: z.infer<typeof getPostSchema>) {
    try {
      const [website] =
        await sql`select (select plan from users where id = (select "ownerId" from churches where id = "churchId")), (select count(*) from posts where "churchId" = websites."churchId") as blog, "churchId","title", structure,"color","style","logo","language","facebookLink","youtubeLink","donationLink","preachLink","whatsappLink","mapsLink","instagramLink", "animations" from "websites" where ${parseTitle('title', true)} = ${parseTitle(query.title)}`;
      if (!website || website?.plan === 0)
        throw new HttpException('No se encontro la pagina', 404);

      const [post] =
        await sql`select id, title, body, description, publication, img from posts where "churchId" = ${parseInt(website.churchId)} and ${parseTitle('title', true)} = ${parseTitle(query.post)}`;
      if (!post) throw new HttpException('No se encontro el post', 404);

      await sql`insert into postviews ("postId") values (${post.id})`;

      return { website, post };
    } catch (err) {
      throw new HttpException('', 404);
    }
  }
}
