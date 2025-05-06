import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { PostMemberSchema } from "./members.schema";

export const ResultsSchema = z.array(z.number());
export const submitFormSchema = PostMemberSchema.extend({
  id: z.string().uuid(),
});

const c = initContract();

export const formsContract = c.router(
  {
    get: {
      method: "GET",
      path: "/:form",
      responses: {
        200: z.any(),
      },
      pathParams: z.object({
        form: z.string().uuid(),
      }),
    },

    submit: {
      method: "POST",
      path: "/submit",
      responses: {
        200: z.any(),
      },
      body: submitFormSchema,
    },

    getResults: {
      method: "GET",
      path: "/results",
      responses: {
        200: z.any(),
      },
    },

    updateUrl: {
      method: "PUT",
      path: "/url",
      responses: {
        200: z.any(),
      },
      body: z.undefined(),
    },

    getUrl: {
      method: "GET",
      path: "/url",
      responses: {
        200: z.string(),
      },
    },

    acceptResults: {
      method: "POST",
      path: "/accept",
      responses: {
        200: z.any(),
      },
      body: ResultsSchema,
    },

    rejectResults: {
      method: "POST",
      path: "/reject",
      responses: {
        200: z.any(),
      },
      body: ResultsSchema,
    },
  },
  { pathPrefix: "/forms" }
);
