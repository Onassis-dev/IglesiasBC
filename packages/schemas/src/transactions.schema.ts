import { z } from "zod";

export const getTransactionsSchema = z.object({
  name: z.string().nullable(),
  id: z.string().nullable(),
  page: z.string(),
});

export const PostTransactionSchema = z.object({
  date: z.string(),
  notes: z.string().optional().nullable(),
  concept: z.string(),
  categoryId: z.number(),
  treasuryId: z.number(),
  amount: z.number(),
});

export const EditTransactionSchema = z.object({
  date: z.string(),
  notes: z.string().optional().nullable(),
  concept: z.string(),
  categoryId: z.number(),
  amount: z.number(),
  id: z.number(),
});

export const StatsSchema = z.object({
  id: z.string(),
});
