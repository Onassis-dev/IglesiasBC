import { z } from 'zod';

export const getSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostMemberSchema = z.object({
  name: z.string(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  price: z.number(),
  serie: z.string().optional().nullable(),
  amount: z.number(),
  bill: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
});

export const EditMemberSchema = z.object({
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

export const IdSchema = z.object({
  id: z.string(),
});
