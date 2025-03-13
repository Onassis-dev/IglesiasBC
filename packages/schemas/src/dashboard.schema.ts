import { z } from "zod";
import { initContract } from "@ts-rest/core";

const c = initContract();

export const dashboardContract = c.router(
  {
    getOwner: {
      method: "GET",
      path: "/owner",
      responses: {
        200: z
          .object({
            stats: z.record(z.string(), z.any()),
            userData: z.any(),
            lastMovements: z.array(z.any()),
            lastMembers: z.array(z.any()),
            lastMaterials: z.array(z.any()),
            lastCertificates: z.array(z.any()),
            lastSubjects: z.array(z.any()),
            members: z.array(z.any()),
            movements: z.array(z.any()),
          })
          .required(),
      },
    },

    getUser: {
      method: "GET",
      path: "/user",
      responses: {
        200: z.any(),
      },
    },
  },
  { pathPrefix: "/dashboard" }
);
