import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const PostSchema = z.object({
    id: z.number().optional(),
    title: z.string({ required_error: 'Requerido' }).min(6, 'El título debe contener al menos 6 caracteres.'),
    body: z.string({ required_error: 'Requerido' }).min(2, 'El cuerpo debe contener al menos 2 caracteres.'),
    description: z.string({ required_error: 'Requerido' }).min(6, 'La descripción debe contener al menos 6 caracteres.'),
});

export const usePostSchema = () =>
    useForm<z.infer<typeof PostSchema>>({
        resolver: zodResolver(PostSchema),
    });
