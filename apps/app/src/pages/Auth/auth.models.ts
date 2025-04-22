import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
});

export const RegisterSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(50),
});

export const DataSchema = z.object({
    username: z.string().min(3).max(30),
    churchName: z.string().min(4).max(40),
});

export const resetPasswordSchema = z.object({
    email: z.string().email(),
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
