import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { IdSchema } from "./general.schema";

export const PostPermissionSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
});

export const EditPermissionSchema = z.object({
  id: z.number(),
  perm_members: z.boolean().optional(),
  perm_finances: z.boolean().optional(),
  perm_inventory: z.boolean().optional(),
  perm_certificates: z.boolean().optional(),
  perm_classes: z.boolean().optional(),
  perm_website: z.boolean().optional(),
  perm_blog: z.boolean().optional(),
});

const c = initContract();

export const permissionsContract = c.router(
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
        200: z.any(),
      },
      body: PostPermissionSchema,
    },

    edit: {
      method: "PUT",
      path: "",
      responses: {
        200: z.any(),
      },
      body: EditPermissionSchema,
    },

    delete: {
      method: "DELETE",
      path: "/:id",
      responses: {
        200: z.any(),
      },
      pathParams: IdSchema,
      body: null,
    },
  },
  { pathPrefix: "/permissions" }
);
