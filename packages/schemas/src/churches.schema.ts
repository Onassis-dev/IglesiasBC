import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const ChurchSchema = z.object({
  name: z.string().min(6).max(100),
});

const c = initContract();

export const churchesContract = c.router({
  getChurch: {
    method: "GET",
    path: "/churches",
    responses: {
      200: z.any(),
    },
  },

  createChurch: {
    method: "POST",
    path: "/churches",
    responses: {
      201: z.any(),
      400: z.object({
        message: z.string(),
      }),
    },
    body: ChurchSchema,
  },

  editChurch: {
    method: "PUT",
    path: "/churches",
    responses: {
      200: z.null(),
    },
    body: ChurchSchema,
  },
});
