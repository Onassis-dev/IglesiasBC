import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { IdSchema } from "./general.schema";

export const getMembersSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostMemberSchema = z.object({
  name: z.string().min(1),
  cellphone: z.string().nullish(),
  baptized: z.string().min(1),
  email: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine(
      (v) =>
        v === null ||
        v === undefined ||
        z.string().email().safeParse(v).success,
      {
        message: "El correo electrónico es invalido",
      }
    ),
  birthday: z.string().date().or(z.date()),
  joinDate: z.string().date().or(z.date()),
  genre: z.string().min(1),
  civilStatus: z.string().min(1),
  positionId: z.string().min(1),
});

export const PutMemberSchema = PostMemberSchema.extend({
  id: z.number(),
});

// For file upload
export const ImportMembersSchema = z.object({
  file: z.any(),
});

// Contract
const c = initContract();

export const membersContract = c.router(
  {
    get: {
      path: "",
      method: "GET",
      responses: {
        200: z.object({
          rows: z.array(z.any()),
          count: z.number(),
        }),
      },
      query: getMembersSchema,
    },
    getOne: {
      path: "/:id",
      method: "GET",
      responses: {
        200: z.record(z.string(), z.any()),
      },
      pathParams: IdSchema,
    },
    getBirthdays: {
      path: "/birthdays",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    getStats: {
      path: "/stats",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    post: {
      path: "",
      method: "POST",
      responses: {
        200: z.any(),
      },
      body: PostMemberSchema,
    },
    put: {
      path: "",
      method: "PUT",
      responses: {
        200: null,
      },
      body: PutMemberSchema,
    },
    delete: {
      path: "/:id",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
      pathParams: IdSchema,
    },
    import: {
      path: "/import",
      method: "POST",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: ImportMembersSchema,
    },
  },
  {
    pathPrefix: "/members",
  }
);
