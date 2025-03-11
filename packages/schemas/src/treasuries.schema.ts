import { z } from 'zod';

export const getSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostSchema = z.object({
  name: z.string(),
});

export const EditSchema = z.object({
  name: z.string(),
  id: z.number(),
});

export const DeleteSchema = z.object({
  id: z.string(),
});
