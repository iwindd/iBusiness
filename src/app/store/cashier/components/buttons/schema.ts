import { z } from 'zod';

export type Inputs = z.infer<typeof Schema>
export const Schema = z.object({
  note: z.string(),
  method: z.string(),
})