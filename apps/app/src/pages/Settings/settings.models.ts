import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const SettingsSchema = z.object({
    name: z
        .string()
        .min(6, 'El nombre de tu iglesia debe tener al menos 6 caracteres')
        .max(100, 'El nombre de tu iglesia debe tener como máximo 100 caracteres'),
});

export const useSettingsSchema = () =>
    useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {},
    });

export const UserSchema = z.object({
    id: z.number(),
    username: z.string().optional(),
    perm_members: z.boolean().optional(),
    perm_finances: z.boolean().optional(),
    perm_inventory: z.boolean().optional(),
    perm_certificates: z.boolean().optional(),
    perm_classes: z.boolean().optional(),
    perm_website: z.boolean().optional(),
    perm_blog: z.boolean().optional(),
});

export const useUserSchema = () =>
    useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {},
    });

export const InviteSchema = z.object({
    email: z.string().email(),
});

export const useInviteSchema = () =>
    useForm<z.infer<typeof InviteSchema>>({
        resolver: zodResolver(InviteSchema),
        defaultValues: {},
    });
