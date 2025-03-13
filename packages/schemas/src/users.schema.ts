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

export const usersContract = c.router({
  getUser: {
    method: "GET",
    path: "/users",
    responses: {
      200: z.any(),
    },
  },

  getData: {
    method: "GET",
    path: "/users/data",
    responses: {
      200: z.any(),
    },
  },

  editUser: {
    method: "PUT",
    path: "/users",
    responses: {
      200: z.any(),
    },
    body: UserSchema,
  },

  selectChurch: {
    method: "PUT",
    path: "/users/church",
    responses: {
      200: z.any(),
    },
    body: SelectChurchSchema,
  },
});
