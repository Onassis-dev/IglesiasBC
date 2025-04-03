// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// export const WebsiteSchema = z.object({
//     title: z
//         .string({ required_error: 'Requerido.' })
//         .min(6, 'El título debe tener al menos 6 caracteres.')
//         .max(40, 'El título no puede exceder los 40 caracteres.'),
//     style: z.string({ required_error: 'Elige un estilo.' }).max(20, 'El estilo debe tener máximo 20 caracteres.'),
//     structure: z.string({ required_error: 'Elige una estructura.' }).max(20, 'La estructura debe tener máximo 20 caracteres.'),
//     pastors: z.string().max(70, 'El campo de pastores debe tener máximo 70 caracteres.').nullish(),
//     servicesDates: z.string().max(100, 'El campo de servicios debe tener máximo 100 caracteres.').nullish(),
//     mission: z
//         .string()
//         .min(6, 'La misión debe tener al menos 6 caracteres.')
//         .max(200, 'La misión no puede exceder los 200 caracteres.')
//         .optional()
//         .nullable(),
//     facebookLink: z.string().max(255, 'El enlace de Facebook no puede exceder los 255 caracteres.').nullish(),
//     instagramLink: z.string().max(255, 'El enlace de Instagram no puede exceder los 255 caracteres.').nullish(),
//     whatsappLink: z.string().max(255, 'El enlace de WhatsApp no puede exceder los 255 caracteres.').nullish(),
//     mapsLink: z.string().max(255, 'El enlace a la ubicación en el mapa no puede exceder los 255 caracteres.').nullish(),
//     youtubeLink: z.string().max(255, 'El enlace de YouTube no puede exceder los 255 caracteres.').nullish(),
//     preachLink: z.string().max(255, 'El enlace de la prédica no puede exceder los 255 caracteres.').nullish(),
//     donationLink: z.string().max(255, 'El enlace de la donación no puede exceder los 255 caracteres.').nullish(),
//     animations: z.string().max(1).optional(),
//     ubication: z.string().max(100, 'La ubicación debe tener máximo 100 caracteres.').nullish(),
//     description: z.string().max(250, 'La descripción no puede exceder los 250 caracteres.').nullish(),
//     about: z.string().max(300, "El campo 'Sobre Nosotros' no puede exceder los 300 caracteres.").nullish(),
//     language: z.string().max(2, 'El idioma debe tener máximo 2 caracteres.'),
// });

// export const StartSchema = z.object({
//     preachLink: z.string().max(255, 'El enlace de la prédica no puede exceder los 255 caracteres.'),
// });

// export const UploadEventSchema = z.object({
//     title: z
//         .string()
//         .min(6, 'El título del evento debe tener al menos 6 caracteres.')
//         .max(40, 'El título del evento no puede exceder los 40 caracteres.'),
//     date: z.date(),
// });

// export const DeleteEventSchema = z.object({
//     eventId: z.number(),
// });

// export const ActivitySchema = z.object({
//     title: z
//         .string()
//         .min(6, 'El título de la actividad debe tener al menos 6 caracteres.')
//         .max(40, 'El título de la actividad no puede exceder los 40 caracteres.'),
//     text: z
//         .string()
//         .min(10, 'El texto de la actividad debe tener al menos 10 caracteres.')
//         .max(300, 'El texto de la actividad no puede exceder los 300 caracteres.'),
//     id: z.string().max(6, 'El ID de la actividad no puede exceder los 6 caracteres.').optional(),
// });

// export const useStartSchema = () =>
//     useForm<z.infer<typeof StartSchema>>({
//         resolver: zodResolver(StartSchema),
//     });

// export const useWebsiteSchema = () =>
//     useForm<z.infer<typeof WebsiteSchema>>({
//         resolver: zodResolver(WebsiteSchema),
//         defaultValues: {
//             language: 'es',
//         },
//     });

// export const useUploadEventSchema = () =>
//     useForm<z.infer<typeof UploadEventSchema>>({
//         resolver: zodResolver(UploadEventSchema),
//         defaultValues: {
//             title: '',
//             date: new Date(),
//         },
//     });

// export const useActivitySchema = () =>
//     useForm<z.infer<typeof ActivitySchema>>({
//         resolver: zodResolver(ActivitySchema),
//         defaultValues: {
//             title: '',
//             text: '',
//         },
//     });
