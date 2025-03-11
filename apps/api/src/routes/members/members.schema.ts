import { z } from 'zod';

export const getSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostMemberSchema = z.object({
  name: z.string(),
  cellphone: z.string().optional().nullable(),
  baptized: z.string().transform((value) => value === 'true'),
  email: z.string().email().optional().nullable(),
  birthday: z.string(),
  joinDate: z.string(),
  genre: z.string(),
  civilStatus: z.string(),
  positionId: z.string(),
});

export const PutMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  cellphone: z.string().optional().nullable(),
  baptized: z.string().transform((value) => value === 'true'),
  email: z.string().optional().nullable(),
  birthday: z.string(),
  joinDate: z.string(),
  genre: z.string(),
  civilStatus: z.string(),
  positionId: z.string(),
});

export const idSchema = z.object({
  id: z.string(),
});
