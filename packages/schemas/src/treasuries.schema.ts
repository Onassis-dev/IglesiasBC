import { z } from "zod";

export const getTreasurySchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostTreasurySchema = z.object({
  name: z.string(),
});

export const EditTreasurySchema = z.object({
  name: z.string(),
  id: z.number(),
});
