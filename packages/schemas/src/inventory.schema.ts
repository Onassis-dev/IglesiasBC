import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { IdSchema } from "./general.schema";

export const getInventorySchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostInventorySchema = z.object({
  name: z.string(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d+)?$/),
  serie: z.string().optional().nullable(),
  amount: z.string().regex(/^[1-9]\d*$/),
  bill: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
});

export const PutInventorySchema = PostInventorySchema.extend({
  id: z.number(),
});

// Contract
const c = initContract();

export const inventoryContract = c.router(
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
      query: getInventorySchema,
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
        200: z.any(),
      },
    },
    export: {
      path: "/export",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    post: {
      path: "",
      method: "POST",
      responses: {
        200: z.any(),
      },
      body: PostInventorySchema,
    },
    put: {
      path: "",
      method: "PUT",
      responses: {
        200: z.any(),
      },
      body: PutInventorySchema,
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
    pathPrefix: "/inventory",
  }
);
