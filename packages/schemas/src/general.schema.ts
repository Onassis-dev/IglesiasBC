import { z } from "zod";

export const IdSchema = z.object({
  id: z.coerce.string(),
});

export const parsedString = z.string().transform((val) => {
  return val.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
});
