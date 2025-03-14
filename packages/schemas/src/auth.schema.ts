import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const loginSchema = z.object({
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

export const signUpSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  username: z.string(),
  token: z.string(),
  refreshToken: z.string(),
});

// Contract
const c = initContract();

export const authContract = c.router({
  login: {
    method: "POST",
    path: "/login/login",
    responses: {
      200: z.string(),
    },
    body: loginSchema,
  },

  signup: {
    method: "POST",
    path: "/auth/signup",
    responses: {
      200: z.any(),
    },
    body: signUpSchema,
  },

  google: {
    method: "POST",
    path: "/auth/google",
    responses: {
      200: z.any(),
    },
    body: googleSchema,
  },

  logout: {
    method: "POST",
    path: "/auth/logout",
    responses: {
      200: z.any(),
    },
    body: null,
  },
});
