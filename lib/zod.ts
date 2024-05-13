import { z } from "zod";

export const promtptProps = z.object({
  user_Id: z.string().min(1),
  title: z.string().min(1),
  promptData: z.string().min(1),
  tag: z.enum(["General", "Science", "Business", "Education", "Programming", "Technology"]),
});

export type promptType = z.infer<typeof promtptProps>;

export const updatepromtptProps = z.object({
  title: z.string().min(1),
  promptData: z.string().min(1),
  tag: z.enum(["General", "Science", "Business", "Education", "Programming", "Technology"]),
});

export type updatepromptType = z.infer<typeof updatepromtptProps>;
