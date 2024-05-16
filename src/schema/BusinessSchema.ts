import { z } from 'zod';

export type BusinessInputs = z.infer<typeof BusinessSchema>
export const BusinessSchema = z.object({
  title: z.string().min(6).max(60),
  tel: z.string().min(10).max(10),
})