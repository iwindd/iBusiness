import { z } from 'zod';

export type SchemaInputs = z.infer<typeof Schema>
export interface Inputs extends SchemaInputs {
  id?: number
}

export const Schema = z.object({
  serial: z.string(),
  title: z.string(),
  price: z.number(),
  cost: z.number(),
  stock: z.number(),
  categoryId: z.number(),
  keywords: z.string()
})