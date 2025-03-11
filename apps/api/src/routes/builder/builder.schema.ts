import { z } from 'zod';

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
