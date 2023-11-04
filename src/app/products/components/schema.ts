import { z } from 'zod';

export type Inputs = z.infer<typeof Schema>
export const Schema = z.object({
  serial: z.string(),
  title: z.string(),
  price: z.number(),
  cost: z.number(),
  stock: z.number()
})