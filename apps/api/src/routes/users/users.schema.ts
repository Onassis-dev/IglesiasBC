import { z } from 'zod';

export const UserSchema = z.object({
  username: z.string(),
  churchId: z.string(),
});

export const SelectChurchSchema = z.object({
  churchId: z.string(),
});
