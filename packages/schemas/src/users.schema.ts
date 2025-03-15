import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const UserSchema = z.object({
  username: z.string(),
  churchId: z.string(),
});

export const SelectChurchSchema = z.object({
  churchId: z.string(),
});

const c = initContract();

export const usersContract = c.router(
  {
    get: {
      method: "GET",
      path: "",
      responses: {
        200: z.any(),
      },
    },

    getData: {
      method: "GET",
      path: "/data",
      responses: {
        200: z.any(),
      },
    },

    editUser: {
      method: "PUT",
      path: "",
      responses: {
        200: z.any(),
      },
      body: UserSchema,
    },

    selectChurch: {
      method: "PUT",
      path: "/church",
      responses: {
        200: z.any(),
      },
      body: SelectChurchSchema,
    },
  },
  { pathPrefix: "/users" }
);
