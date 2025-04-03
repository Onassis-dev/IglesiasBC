import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { IdSchema } from "./general.schema";
import { colorRegex } from "./regex";

export const getPresentationSchema = z.object({
  title: z.string().nullable(),
  page: z.string(),
});

export const PostPresentationSchema = z.object({
  title: z.string().min(1),
  background: z.string().regex(colorRegex, {
    message: "Color invalido",
  }),
  text: z.string().regex(colorRegex, {
    message: "Color invalido",
  }),
  slides: z.array(z.string()).optional(),
});

export const EditPresentationSchema = PostPresentationSchema.extend({
  id: z.number(),
});

// Contract
const c = initContract();

export const presentationsContract = c.router(
  {
    get: {
      path: "",
      method: "GET",
      responses: {
        200: z.object({
          rows: z.array(z.any()),
          count: z.number(),
        }),
      },
      query: getPresentationSchema,
    },
    getOne: {
      path: "/:id",
      method: "GET",
      responses: {
        200: z.any(),
      },
      pathParams: IdSchema,
    },
    post: {
      path: "",
      method: "POST",
      responses: {
        200: z.any(),
      },
      body: PostPresentationSchema,
    },
    put: {
      path: "",
      method: "PUT",
      responses: {
        200: null,
      },
      body: EditPresentationSchema,
    },
    delete: {
      path: "/:id",
      method: "DELETE",
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
          income: z.string(),
          expense: z.string(),
          balance: z.string(),
        }),
      },
    },
  },
  {
    pathPrefix: "/presentations",
  }
);
