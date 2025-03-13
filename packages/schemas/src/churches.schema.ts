import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const ChurchSchema = z.object({
  name: z.string().min(6).max(100),
});

const c = initContract();

export const churchesContract = c.router(
  {
    get: {
      method: "GET",
      path: "",
      responses: {
        200: z.any(),
      },
    },

    create: {
      method: "POST",
      path: "",
      responses: {
        201: z.any(),
        400: z.object({
          message: z.string(),
        }),
      },
      body: ChurchSchema,
    },

    edit: {
      method: "PUT",
      path: "",
      responses: {
        200: z.null(),
      },
      body: ChurchSchema,
    },
  },
  { pathPrefix: "/churches" }
);
