import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const LoginSchema = z.object({
    email: z.string().email('El correo electrónico proporcionado es inválido.'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .max(50, 'La contraseña no puede exceder los 50 caracteres.'),
});

export const RegisterSchema = z.object({
    username: z
        .string()
        .min(6, 'El usuario debe tener mínimo 6 caracteres')
        .max(30, 'El usuario no puede exceder los 30 caracteres.'),
    email: z.string().email('El correo electrónico proporcionado no es válido.'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .max(50, 'La contraseña no puede exceder los 50 caracteres.'),
});

export const DataSchema = z.object({
    username: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
        .max(30, 'El nombre de usuario no puede exceder los 30 caracteres.'),
    churchName: z
        .string()
        .min(6, 'El nombre de la iglesia debe tener al menos 6 caracteres.')
        .max(40, 'El nombre de la iglesia no puede exceder los 40 caracteres.'),
});

export const resetPasswordSchema = z.object({
    email: z.string().email('El correo electrónico proporcionado es inválido.'),
});

export const useResetPasswordSchema = () =>
    useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

export const useLoginSchema = () =>
    useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

export const useRegisterSchema = () =>
    useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

export const useDataSchema = () =>
    useForm<z.infer<typeof DataSchema>>({
        resolver: zodResolver(DataSchema),
        defaultValues: {
            username: '',
            churchName: '',
        },
    });
