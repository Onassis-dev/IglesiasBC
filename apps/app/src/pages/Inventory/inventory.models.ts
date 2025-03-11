import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const ItemSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string({ required_error: "Requerido" }),
    brand: z.string().optional().nullable(),
    model: z.string().optional().nullable(),
    price: z
        .string({ required_error: "Requerido" })
        .refine((value) => !isNaN(parseFloat(value)), {
            message: "Numero invalido",
        })
        .transform((value) => parseFloat(value))
        .or(z.number()),
    amount: z
        .string({ required_error: "Requerido" })
        .refine((value) => !isNaN(parseFloat(value)), {
            message: "Numero invalido",
        })
        .transform((value) => parseFloat(value))
        .or(z.number()),
    serie: z.string().optional().nullable(),
    bill: z.string().optional().nullable(),
    observations: z.string().optional().nullable(),
});

export const useItemSchema = () =>
    useForm<z.infer<typeof ItemSchema>>({
        resolver: zodResolver(ItemSchema),
    });
