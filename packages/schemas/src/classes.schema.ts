import { z } from "zod";

//classes
export const PostClassSchema = z.object({
  title: z.string(),
});

export const EditClassSchema = z.object({
  id: z.number(),
  title: z.string(),
});

//subjects
export const PostSubjectSchema = z.object({
  title: z.string(),
  classId: z.number(),
});

//students
export const PostStudentSchema = z.object({
  memberId: z.string(),
  classId: z.number(),
});

//general

export const getClassesSchema = z.object({
  name: z.string().nullable(),
  page: z.string(),
});
