import { z } from 'zod';

export const getSchema = z.object({
  name: z.string().nullable(),
  id: z.string().nullable(),
  page: z.string(),
});

export const PostSchema = z.object({
  date: z.string(),
  notes: z.string().optional().nullable(),
  concept: z.string(),
  categoryId: z.number(),
  treasuryId: z.number(),
  amount: z.number(),
});

export const EditSchema = z.object({
  date: z.string(),
  notes: z.string().optional().nullable(),
  concept: z.string(),
  categoryId: z.number(),
  amount: z.number(),
  id: z.number(),
});

export const DeleteSchema = z.object({
  id: z.string(),
});

export const StatsSchema = z.object({
  id: z.string(),
});
