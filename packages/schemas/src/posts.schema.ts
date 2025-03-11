import { z } from "zod";

export const GetOnePostSchema = z.object({
  id: z.string(),
});

export const getPostSchema = z.object({
  title: z.string().nullable(),
  page: z.string(),
});

export const PostPostSchema = z.object({
  title: z.string(),
  body: z.string(),
  description: z.string(),
});

export const EditPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  description: z.string(),
});

export const DeleteSchema = z.object({
  id: z.string(),
});
