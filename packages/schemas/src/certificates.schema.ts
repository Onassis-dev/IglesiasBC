import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { IdSchema } from "./general.schema";

export const getCertificateSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostCertificateSchema = z.object({
  member: z.string().min(1),
  design: z.string().min(1, { message: "Elige una opción" }),
  member2: z.string().nullish(),
  pastor: z.string().min(1),
  pastor2: z.string().nullish(),
  expeditionDate: z.string().date().or(z.date()),
  certificateTypeId: z.string().min(1),
  validate: z.boolean(),
});

export const UploadLogoSchema = z.object({
  image: z.any(),
});

// Contract
const c = initContract();

export const certificatesContract = c.router(
  {
    get: {
      method: "GET",
      path: "",
      responses: {
        200: z.any(),
      },
      query: getCertificateSchema,
    },

    download: {
      method: "GET",
      path: "/:id",
      responses: {
        200: z.any(),
      },
      pathParams: IdSchema,
    },

    create: {
      method: "POST",
      path: "",
      responses: {
        200: z.any(),
      },
      body: PostCertificateSchema,
    },

    delete: {
      method: "DELETE",
      path: "/:id",
      responses: {
        200: z.any(),
      },
      pathParams: IdSchema,
    },

    getMembers: {
      method: "GET",
      path: "/members",
      responses: {
        200: z.any(),
      },
    },

    getPastors: {
      method: "GET",
      path: "/pastors",
      responses: {
        200: z.any(),
      },
    },

    getStats: {
      method: "GET",
      path: "/stats",
      responses: {
        200: z.any(),
      },
    },

    uploadLogo: {
      method: "POST",
      path: "/logo",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",

      body: UploadLogoSchema,
    },
  },
  {
    pathPrefix: "/certificates",
  }
);
