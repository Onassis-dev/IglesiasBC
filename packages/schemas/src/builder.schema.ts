import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { parsedString } from "./general.schema";

export const WebsiteSchema = z.object({
  title: z
    .string({ required_error: "Requerido." })
    .min(6, "El título debe tener al menos 6 caracteres.")
    .max(40, "El título no puede exceder los 40 caracteres."),
  style: z
    .string({ required_error: "Elige un estilo." })
    .max(20, "El estilo debe tener máximo 20 caracteres."),
  structure: z
    .string({ required_error: "Elige una estructura." })
    .max(20, "La estructura debe tener máximo 20 caracteres."),
  pastors: z
    .string()
    .max(70, "El campo de pastores debe tener máximo 70 caracteres.")
    .optional()
    .nullable(),
  servicesDates: z
    .string()
    .max(100, "El campo de servicios debe tener máximo 100 caracteres.")
    .optional()
    .nullable(),
  mission: z
    .string()
    .min(6, "La misión debe tener al menos 6 caracteres.")
    .max(200, "La misión no puede exceder los 200 caracteres.")
    .optional()
    .nullable(),
  facebookLink: z
    .string()
    .max(255, "El enlace de Facebook no puede exceder los 255 caracteres.")
    .optional()
    .nullable(),
  instagramLink: z
    .string()
    .max(255, "El enlace de Instagram no puede exceder los 255 caracteres.")
    .optional()
    .nullable(),
  whatsappLink: z
    .string()
    .max(255, "El enlace de WhatsApp no puede exceder los 255 caracteres.")
    .optional()
    .nullable(),
  mapsLink: z
    .string()
    .max(
      255,
      "El enlace a la ubicación en el mapa no puede exceder los 255 caracteres."
    )
    .optional()
    .nullable(),
  youtubeLink: z
    .string()
    .max(255, "El enlace de YouTube no puede exceder los 255 caracteres.")
    .optional()
    .nullable(),
  preachLink: z
    .string()
    .max(255, "El enlace de la prédica no puede exceder los 255 caracteres.")
    .optional()
    .nullable(),
  donationLink: z
    .string()
    .max(255, "El enlace de la donación no puede exceder los 255 caracteres.")
    .optional()
    .nullable(),
  animations: z.string().max(1).optional(),
  ubication: z
    .string()
    .max(100, "La ubicación debe tener máximo 100 caracteres.")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(250, "La descripción no puede exceder los 250 caracteres.")
    .optional()
    .nullable(),
  about: z
    .string()
    .max(300, "El campo 'Sobre Nosotros' no puede exceder los 300 caracteres.")
    .optional()
    .nullable(),
  language: z.string().max(2, "El idioma debe tener máximo 2 caracteres."),
});

export const StartSchema = z.object({
  preachLink: z.string().max(255).optional().nullable(),
});

export const UploadEventSchema = z.object({
  title: z.string().min(6).max(40),
  date: z.string().date().or(z.date()),
  image: z.any(),
});

const SerializedUploadEventSchema = UploadEventSchema.extend({
  title: parsedString,
  date: parsedString,
});

export const DeleteEventSchema = z.object({
  eventId: z.number(),
});

export const DeleteChurchImageSchema = z.object({
  imageUrl: z.string().url(),
});

export const DeleteActivitySchema = z.object({
  id: z.number(),
});

export const PostActivitySchema = z.object({
  title: z
    .string()
    .min(6, "El título de la actividad debe tener al menos 6 caracteres.")
    .max(40, "El título de la actividad no puede exceder los 40 caracteres."),
  text: z
    .string()
    .min(10, "El texto de la actividad debe tener al menos 10 caracteres.")
    .max(300, "El texto de la actividad no puede exceder los 300 caracteres."),
  image: z.any(),
});

export const EditActivitySchema = PostActivitySchema.extend({
  id: z.string(),
});

const SerializedPostActivitySchema = PostActivitySchema.extend({
  text: parsedString,
  title: parsedString,
});

const SerializedEditActivitySchema = SerializedPostActivitySchema.extend({
  id: parsedString,
});

// For file uploads
export const FileUploadSchema = z.object({
  image: z.any(),
});

// Contract
const c = initContract();

export const builderContract = c.router(
  {
    getWebsiteInfo: {
      path: "/website/info",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    getStart: {
      path: "/start",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    editStart: {
      path: "/start",
      method: "PUT",
      responses: {
        200: z.any(),
      },
      body: StartSchema,
    },
    getWebsite: {
      path: "/website",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    createWebsite: {
      path: "/website",
      method: "POST",
      responses: {
        200: z.any(),
      },
      body: WebsiteSchema,
    },
    editWebsite: {
      path: "/website",
      method: "PUT",
      responses: {
        200: z.any(),
      },
      body: WebsiteSchema,
    },
    getLogo: {
      path: "/logo",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    uploadLogo: {
      path: "/logo",
      method: "POST",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: FileUploadSchema,
    },
    getPastorsImg: {
      path: "/pastorsimg",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    uploadPastorsImg: {
      path: "/pastorsimg",
      method: "POST",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: FileUploadSchema,
    },
    getCoverImg: {
      path: "/coverimg",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    uploadCoverImg: {
      path: "/coverimg",
      method: "POST",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: FileUploadSchema,
    },
    getEvents: {
      path: "/events",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    uploadEvent: {
      path: "/event",
      method: "POST",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: SerializedUploadEventSchema,
    },
    deleteEvent: {
      path: "/event",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
      body: DeleteEventSchema,
    },
    getChurchImages: {
      path: "/images",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    uploadChurchImage: {
      path: "/image",
      method: "POST",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: FileUploadSchema,
    },
    deleteChurchImage: {
      path: "/image",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
      body: DeleteChurchImageSchema,
    },
    getActivities: {
      path: "/activities",
      method: "GET",
      responses: {
        200: z.any(),
      },
    },
    uploadActivity: {
      path: "/activity",
      method: "POST",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: SerializedPostActivitySchema,
    },
    editActivity: {
      path: "/activity",
      method: "PUT",
      responses: {
        200: z.any(),
      },
      contentType: "multipart/form-data",
      body: SerializedEditActivitySchema,
    },
    deleteActivity: {
      path: "/activity",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
      body: DeleteActivitySchema,
    },
  },
  {
    pathPrefix: "/builder",
  }
);
