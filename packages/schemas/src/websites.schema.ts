import { z } from "zod";

export const getWebsiteSchema = z.object({
  title: z.string(),
});

export const getWebsitePostSchema = z.object({
  title: z.string(),
  post: z.string(),
});
