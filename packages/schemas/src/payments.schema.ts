import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const CheckoutSchema = z.object({
  product: z.string(),
  email: z.string().email(),
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
        origin: z.string().optional(),
      }),
      body: CheckoutSchema,
    },

    portal: {
      method: "POST",
      path: "/portal",
      responses: {
        200: z.object({
          url: z.string(),
        }),
      },
      headers: z.object({
        origin: z.string().optional(),
      }),
      body: null,
    },
  },
  { pathPrefix: "/payments" }
);
