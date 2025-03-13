import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { IdSchema } from "./general.schema";

export const getTreasurySchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostTreasurySchema = z.object({
  name: z.string(),
});

export const EditTreasurySchema = PostTreasurySchema.extend({
  id: z.number(),
});

// Contract
const c = initContract();

export const treasuriesContract = c.router(
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
      query: getTreasurySchema,
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
      body: PostTreasurySchema,
    },
    put: {
      path: "",
      method: "PUT",
      responses: {
        200: z.any(),
      },
      body: EditTreasurySchema,
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
    pathPrefix: "/treasuries",
  }
);
