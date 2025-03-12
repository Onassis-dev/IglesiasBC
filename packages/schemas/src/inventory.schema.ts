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
  price: z.number(),
  serie: z.string().optional().nullable(),
  amount: z.number(),
  bill: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
});

export const EditInventorySchema = z.object({
  id: z.number(),
  name: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  serie: z.string().optional().nullable(),
  amount: z.number().optional().nullable(),
  bill: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
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
      body: EditInventorySchema,
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
