import { z } from 'zod';

export const getSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const getMembersSchema = z.object({
  name: z.string().nullable(),
});

export const PostCertificateSchema = z.object({
  member: z.string(),
  member2: z.string().optional().nullable(),
  pastor: z.string(),
  pastor2: z.string().optional().nullable(),
  expeditionDate: z.string(),
  certificateTypeId: z.string(),
});

export const DeleteSchema = z.object({
  id: z.string(),
});

export const DownloadSchema = z.object({
  id: z.string(),
});
