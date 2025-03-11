import { z } from 'zod';

export const GetOneSchema = z.object({
  id: z.string(),
});

export const GetSchema = z.object({
  title: z.string().nullable(),
  page: z.string(),
});

export const PostSchema = z.object({
  title: z.string(),
  body: z.string(),
  description: z.string(),
});

export const EditSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  description: z.string(),
});

export const DeleteSchema = z.object({
  id: z.string(),
});
