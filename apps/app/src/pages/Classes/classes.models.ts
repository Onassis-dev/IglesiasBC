import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ClassSchema = z.object({
    id: z.number().nullish(),
    title: z.string({ required_error: 'Requerido' }),
});

export const useClassSchema = () =>
    useForm<z.infer<typeof ClassSchema>>({
        resolver: zodResolver(ClassSchema),
    });

export const SubjectSchema = z.object({
    id: z.number().nullish(),
    title: z.string({ required_error: 'Requerido' }),
});

export const useSubjectSchema = () =>
    useForm<z.infer<typeof SubjectSchema>>({
        resolver: zodResolver(SubjectSchema),
    });

export const StudentSchema = z.object({
    id: z.number().nullish(),
    memberId: z.string({ required_error: 'Requerido' }),
});

export const useStudentSchema = () =>
    useForm<z.infer<typeof StudentSchema>>({
        resolver: zodResolver(StudentSchema),
    });
