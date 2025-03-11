import { z } from "zod";

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
