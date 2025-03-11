import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const UserConfigSchema = z.object({
    username: z.string().min(4, 'El usuario debe contener mínimo 4 caracteres.'),
    email: z.string({ required_error: 'Requerido' }).email('El correo electrónico proporcionado es inválido.'),
    churchId: z.string({ required_error: 'Requerido' }),
});

export const useUserConfigSchema = () =>
    useForm<z.infer<typeof UserConfigSchema>>({
        resolver: zodResolver(UserConfigSchema),
        defaultValues: {
            username: '',
            email: '',
            churchId: '',
        },
    });
