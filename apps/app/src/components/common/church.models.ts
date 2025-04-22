import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ChurchSchema = z.object({
    name: z.string().min(4).max(100),
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
