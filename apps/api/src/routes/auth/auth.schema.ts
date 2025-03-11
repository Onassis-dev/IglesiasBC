import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  token: z.string(),
  refreshToken: z.string(),
});

export const googleSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  token: z.string(),
  refreshToken: z.string(),
  username: z.string(),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  username: z.string(),
  token: z.string(),
  refreshToken: z.string(),
});
