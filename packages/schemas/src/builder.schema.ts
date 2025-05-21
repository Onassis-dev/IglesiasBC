import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { parsedString } from "./general.schema";

export const WebsiteSchema = z.object({
  title: z.string().min(6).max(40),
  color: z.string().max(7),
  style: z.string().max(20),
  structure: z.string().max(20),
  pastors: z.string().max(70).optional().nullable(),
  servicesDates: z.string().max(100).optional().nullable(),
  mission: z.string().max(200).optional().nullable(),
  facebookLink: z.string().max(255).optional().nullable(),
  instagramLink: z.string().max(255).optional().nullable(),
  whatsappLink: z.string().max(255).optional().nullable(),
  mapsLink: z.string().max(255).optional().nullable(),
  youtubeLink: z.string().max(255).optional().nullable(),
  preachLink: z.string().max(255).optional().nullable(),
  donationLink: z.string().max(255).optional().nullable(),
  animations: z.string().max(1).optional(),
  ubication: z.string().optional().nullable(),
  description: z.string().max(250).optional().nullable(),
  about: z.string().max(300).optional().nullable(),
  language: z.string().max(2),
});

export const StartSchema = z.object({
  preachLink: z.string().max(255).nullish(),
});

export const UploadEventSchema = z.object({
  title: z.string().min(6).max(40),
  description: z.string().min(5).max(300).nullish(),
  date: z.string().date().or(z.date()),
  image: z.any(),
});

const SerializedUploadEventSchema = UploadEventSchema.extend({
  title: parsedString,
  date: parsedString,
  description: parsedString,
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
  title: z.string().min(6).max(40),
  text: z.string().min(10).max(300),
  date: z.string().max(30).nullish(),
  image: z.any(),
});

export const EditActivitySchema = PostActivitySchema.extend({
  id: z.string(),
});

const SerializedPostActivitySchema = PostActivitySchema.extend({
  text: parsedString,
  title: parsedString,
  date: parsedString,
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
    deleteLogo: {
      path: "/logo",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
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
    deletePastorsImg: {
      path: "/pastorsimg",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
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
    deleteCoverImg: {
      path: "/coverimg",
      method: "DELETE",
      responses: {
        200: z.any(),
      },
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
