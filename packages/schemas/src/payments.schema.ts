import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const CheckoutSchema = z.object({
  product: z.string(),
});

const c = initContract();

export const paymentsContract = c.router(
  {
    checkout: {
      method: "POST",
      path: "/checkout",
      responses: {
        200: z.any(),
      },
      headers: z.object({
        origin: z.string(),
      }),
      body: CheckoutSchema,
    },

    portal: {
      method: "POST",
      path: "/portal",
      responses: {
        200: z.any(),
      },
      headers: z.object({
        origin: z.string(),
      }),
      body: null,
    },
  },
  { pathPrefix: "/payments" }
);
