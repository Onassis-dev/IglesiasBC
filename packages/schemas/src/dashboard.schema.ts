import { z } from "zod";
import { initContract } from "@ts-rest/core";

const statsSchema = z.object({
  income: z.number().nullable(),
  expense: z.number().nullable(),
  balance: z.string().optional(),
  members: z.number().nullable(),
  certificates: z.number().nullable(),
  students: z.number().nullable(),
  inventory: z.number().nullable(),
  blog: z.number().nullable(),
  website: z.number().nullable(),
});

const lastMemberSchema = z.object({
  name: z.string(),
  position: z.string(),
});

const lastCertificateSchema = z.object({
  name: z.string(),
  type: z.string(),
});

const lastMovementSchema = z.object({
  concept: z.string(),
  date: z.string(),
  amount: z.number(),
  isIncome: z.boolean(),
});

const lastMaterialSchema = z.object({
  name: z.string(),
  amount: z.number(),
  price: z.number(),
});

const chartDataSchema = z.array(
  z.object({
    month: z.string(),
    value: z.number(),
  })
);

const movementsChartSchema = z.array(
  z.object({
    month: z.string(),
    Ingresos: z.number(),
    Egresos: z.number(),
  })
);

const userDataSchema = z.object({
  userId: z.number(),
  username: z.string(),
  email: z.string(),
  owner: z.boolean(),
  selected: z.boolean(),
  perm_website: z.boolean(),
  perm_inventory: z.boolean(),
  perm_finances: z.boolean(),
  perm_members: z.boolean(),
  perm_classes: z.boolean(),
  perm_blog: z.boolean(),
  perm_certificates: z.boolean(),
});

const c = initContract();

export const dashboardContract = c.router({
  getOwner: {
    method: "GET",
    path: "/dashboard/owner",
    responses: {
      200: z.any(),
    },
  },

  getUser: {
    method: "GET",
    path: "/dashboard/user",
    responses: {
      200: z.any(),
    },
  },
});
