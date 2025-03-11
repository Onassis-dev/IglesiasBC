import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const TreasurySchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string({ required_error: "Requerido" }),
});

export const useTreasurySchema = () =>
    useForm<z.infer<typeof TreasurySchema>>({
        resolver: zodResolver(TreasurySchema),
    });

export const TransactionSchema = z.object({
    id: z.number().optional().nullable(),
    date: z.string({ required_error: "Requerido", invalid_type_error: "Requerido" }).or(z.date()),
    notes: z.string({ required_error: "Requerido" }).optional().nullable(),
    concept: z.string({ required_error: "Requerido" }),
    categoryId: z.string({ required_error: "Requerido" }).refine((value) => value !== "", {
        message: "Requerido",
    }),
    amount: z
        .string({ required_error: "Requerido" })
        .refine((value) => !isNaN(parseFloat(value)), {
            message: "Numero invalido",
        })
        .transform((value) => parseFloat(value))
        .or(z.number()),
});

export const useTransactionSchema = () =>
    useForm<z.infer<typeof TransactionSchema>>({
        resolver: zodResolver(TransactionSchema),
    });
