import { z } from 'zod';

export type BusinessInputs = z.infer<typeof BusinessSchema>
export const BusinessSchema = z.object({
  title: z.string().min(6).max(60),
  short: z.string().min(3).max(10),
  tel: z.string().min(10).max(10),
  time: z.string(),
  line: z.string(),
  latlng: z.string()
})