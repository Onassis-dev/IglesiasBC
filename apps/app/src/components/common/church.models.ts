import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ChurchSchema = z.object({
    name: z
        .string()
        .min(6, 'El nombre de tu iglesia debe contener mínimo 6 caracteres')
        .max(100, 'El nombre de tu iglesia debe contener máximo 100 caracteres'),
});

export const useChurchSchema = () =>
    useForm<z.infer<typeof ChurchSchema>>({
        resolver: zodResolver(ChurchSchema),
        defaultValues: {
            name: '',
        },
    });

export const SelectChurchSchema = z.object({
    churchId: z.string(),
});

export const useSelectChurchSchema = () =>
    useForm<z.infer<typeof SelectChurchSchema>>({
        resolver: zodResolver(SelectChurchSchema),
        defaultValues: {
            churchId: '',
        },
    });
