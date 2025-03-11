import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const MemberSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string({ required_error: 'Requerido' }),
    cellphone: z.string().optional().nullable(),
    baptized: z.string({ required_error: 'Requerido' }),
    email: z
        .string()
        .transform((v) => (v === '' ? null : v))
        .nullable()
        .optional()
        .refine((v) => v === null || v === undefined || z.string().email().safeParse(v).success, {
            message: 'El correo electrónico es invalido',
        }),
    birthday: z.string({ required_error: 'Requerido', invalid_type_error: 'Requerido' }).min(4, { message: 'Requerido' }).or(z.date()),
    joinDate: z.string({ required_error: 'Requerido', invalid_type_error: 'Requerido' }).min(4, { message: 'Requerido' }).or(z.date()),
    genre: z.string().length(1),
    civilStatus: z.string({ required_error: 'Requerido' }),
    positionId: z.string({ required_error: 'Requerido' }),
});

export const useMemberSchema = () =>
    useForm<z.infer<typeof MemberSchema>>({
        resolver: zodResolver(MemberSchema),
    });
