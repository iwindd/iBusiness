import { z } from 'zod';

export type Inputs = z.infer<typeof Schema>
export const Schema = z.object({
  email: z.string().email(),
  password: z.string(),
})