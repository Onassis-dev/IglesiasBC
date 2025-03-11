import { z } from 'zod';

export const ChurchSchema = z.object({
  name: z.string().min(6).max(100),
});
