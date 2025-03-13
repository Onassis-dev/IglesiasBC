import { z } from "zod";
import { initContract } from "@ts-rest/core";

// Contract
const c = initContract();

export const optionsContract = c.router(
  {
    getPositions: {
      path: "/positions",
      method: "GET",
      responses: {
        200: z.array(z.any()),
      },
    },
    getCategories: {
      path: "/categories",
      method: "GET",
      responses: {
        200: z.array(z.any()),
      },
    },
    getCertificateTypes: {
      path: "/certificates",
      method: "GET",
      responses: {
        200: z.array(z.any()),
      },
    },
  },
  {
    pathPrefix: "/options",
  }
);
