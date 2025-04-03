import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { IdSchema, parsedString } from "./general.schema";

export const GetOnePostSchema = z.object({
  id: z.string(),
});

export const getPostSchema = z.object({
  title: z.string().nullable(),
  page: z.string(),
});

export const PostPostSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  description: z.string().min(10),
  file: z.any(),
});

export const EditPostSchema = PostPostSchema.extend({
  id: z.coerce.number(),
});

const SerializedPostSchema = PostPostSchema.extend({
  title: parsedString,
  body: parsedString,
  description: parsedString,
});

const serializedEditSchema = SerializedPostSchema.extend({
  id: z.coerce.number(),
});

// Contract
const c = initContract();

export const postsContract = c.router(
  {
    get: {
      path: "",
      method: "GET",
      responses: {
        200: z.object({
          rows: z.array(z.any()),
          count: z.number(),
          websiteTitle: z.string(),
        }),
      },
      query: getPostSchema,
    },
    getOne: {
      path: "/:id",
      method: "GET",
      responses: {
        200: z.any(),
      },
      pathParams: IdSchema,
    },
    getStats: {
      path: "/stats",
      method: "GET",
      responses: {
        200: z.object({
          posts: z.number(),
          views: z.number(),
          postsMonthly: z.number(),
        }),
      },
    },
    post: {
      path: "",
      method: "POST",
      responses: {
        200: z.any(),
      },
      body: SerializedPostSchema,
      contentType: "multipart/form-data",
    },
    put: {
      path: "",
      method: "PUT",
      responses: {
        200: z.any(),
      },
      body: serializedEditSchema,
      contentType: "multipart/form-data",
    },
    delete: {
      path: "/:id",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
      pathParams: IdSchema,
    },
  },
  {
    pathPrefix: "/posts",
  }
);
