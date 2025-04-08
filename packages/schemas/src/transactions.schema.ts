import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { IdSchema } from "./general.schema";
import { decimalRegex } from "./regex";

export const getTransactionsSchema = z.object({
  name: z.string().nullable(),
  id: z.string().nullable(),
  page: z.string(),
});

export const PostTransactionSchema = z.object({
  date: z.string().date().or(z.date()),
  concept: z.string().min(1),
  categoryId: z.string().min(1),
  treasuryId: z.number().optional(),
  amount: z.coerce.string().regex(decimalRegex),
  notes: z.string().nullish(),
});

export const EditTransactionSchema = PostTransactionSchema.extend({
  id: z.number(),
});

export const StatsSchema = z.object({
  id: z.string(),
});

// Contract
const c = initContract();

export const transactionsContract = c.router(
  {
    get: {
      path: "",
      method: "GET",
      responses: {
        200: z.object({
          rows: z.array(z.any()),
          count: z.number(),
          name: z.string(),
        }),
      },
      query: getTransactionsSchema,
    },
    post: {
      path: "",
      method: "POST",
      responses: {
        200: z.any(),
      },
      body: PostTransactionSchema,
    },
    put: {
      path: "",
      method: "PUT",
      responses: {
        200: z.any(),
      },
      body: EditTransactionSchema,
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
      path: "/stats/:id",
      method: "GET",
      responses: {
        200: z.object({
          income: z.string(),
          expense: z.string(),
          balance: z.string(),
        }),
      },
      pathParams: StatsSchema,
    },
  },
  {
    pathPrefix: "/transactions",
  }
);
