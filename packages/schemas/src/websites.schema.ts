import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const getWebsiteSchema = z.object({
  title: z.string(),
});

export const getWebsitePostSchema = z.object({
  title: z.string(),
  post: z.string(),
});

export const getCertificateDataSchema = z.object({
  code: z.string(),
});

// Contract
const c = initContract();

export const websitesContract = c.router(
  {
    getWebsiteStart: {
      path: "/start",
      method: "GET",
      responses: {
        200: z.any(),
        404: z.object({ message: z.string() }),
      },
      query: getWebsiteSchema,
    },
    getWebsiteServices: {
      path: "/services",
      method: "GET",
      responses: {
        200: z.any(),
        404: z.object({ message: z.string() }),
      },
      query: getWebsiteSchema,
    },
    getWebsiteEvents: {
      path: "/events",
      method: "GET",
      responses: {
        200: z.any(),
        404: z.object({ message: z.string() }),
      },
      query: getWebsiteSchema,
    },
    getWebsitePosts: {
      path: "/posts",
      method: "GET",
      responses: {
        200: z.any(),
        404: z.object({ message: z.string() }),
      },
      query: getWebsiteSchema,
    },
    getPost: {
      path: "/post",
      method: "GET",
      responses: {
        200: z.any(),
        404: z.object({ message: z.string() }),
      },
      query: getWebsitePostSchema,
    },
    getCertificate: {
      path: "/certificate",
      method: "GET",
      responses: {
        200: z.any(),
        404: z.object({ message: z.string() }),
      },
      query: getCertificateDataSchema,
    },
  },
  {
    pathPrefix: "/websites",
  }
);
