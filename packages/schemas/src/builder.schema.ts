import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const WebsiteSchema = z.object({
  title: z.string().min(6).max(40),
  style: z.string().max(20),
  structure: z.string().max(20),
  pastors: z.string().max(70).optional().nullable(),
  servicesDates: z.string().max(100).optional().nullable(),
  mission: z.string().min(6).max(200).optional().nullable(),
  facebookLink: z.string().max(255).optional().nullable(),
  instagramLink: z.string().max(255).optional().nullable(),
  whatsappLink: z.string().max(255).optional().nullable(),
  mapsLink: z.string().max(255).optional().nullable(),
  youtubeLink: z.string().max(255).optional().nullable(),
  preachLink: z.string().max(255).optional().nullable(),
  donationLink: z.string().max(255).optional().nullable(),
  animations: z.string().max(1).optional().nullable(),
  ubication: z.string().max(100).optional().nullable(),
  description: z.string().max(250).optional().nullable(),
  about: z.string().max(300).optional().nullable(),
  color: z.string().max(7),
  language: z.string().max(2),
});

export const StartSchema = z.object({
  preachLink: z.string().max(255).optional().nullable(),
});

export const UploadEventSchema = z.object({
  title: z.string().min(6).max(40),
  date: z.string().min(5).max(30),
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

export const UploadActivitySchema = z.object({
  title: z.string().min(6).max(40),
  text: z.string().min(10).max(300),
});

export const EditActivitySchema = z.object({
  title: z.string().min(6).max(40),
  text: z.string().min(10).max(300),
  id: z.string().max(6),
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
    getPastorsImg: {
      path: "/pastorsimg",
      method: "GET",
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
    getEvents: {
      path: "/events",
      method: "GET",
      responses: {
        200: z.any(),
      },
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
