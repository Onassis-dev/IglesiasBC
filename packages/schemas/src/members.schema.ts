import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { IdSchema } from "./general.schema";

export const getMembersSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});

export const PostMemberSchema = z.object({
  name: z.string(),
  cellphone: z.string().optional().nullable(),
  baptized: z.string().transform((value) => value === "true"),
  email: z.string().email().optional().nullable(),
  birthday: z.string(),
  joinDate: z.string(),
  genre: z.string(),
  civilStatus: z.string(),
  positionId: z.string(),
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
        200: z.any(),
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
      path: "/:id",
      method: "PUT",
      responses: {
        200: z.any(),
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
