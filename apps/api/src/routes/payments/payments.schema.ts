import { z } from 'zod';

export const CheckoutSchema = z.object({
  product: z.string(),
});
