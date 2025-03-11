import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const CertificateSchema = z.object({
    id: z.number().optional().nullable(),
    member: z.string({ required_error: 'Seleccione al menos un miembro' }),
    member2: z.string().optional().nullable(),
    pastor: z.string({ required_error: 'Seleccione al menos un pastor' }),
    pastor2: z.string().optional().nullable(),
    expeditionDate: z.date({ required_error: 'No se seleccionó una fecha' }),
    certificateTypeId: z.string({ required_error: 'No se seleccionó un certificado' }),
});

export const useCertificateSchema = () =>
    useForm<z.infer<typeof CertificateSchema>>({
        resolver: zodResolver(CertificateSchema),
    });
