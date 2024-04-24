import { isValidEAN } from '@/libs/utils';
import { z } from 'zod';

export type SchemaInputs = z.infer<typeof Schema>
export interface Inputs extends SchemaInputs {
  id?: number
}

export interface InputSearch extends SchemaInputs { }

export const Schema = z.object({
  serial: z.string(),
  title: z.string(),
  price: z.number(),
  cost: z.number(),
  stock: z.number(),
  categoryId: z.number(),
  keywords: z.string()
})

export const SchemaSearch = z.object({
  serial: z.string()
}).refine((data) => isValidEAN(data.serial), { message: "Invalid EAN", path: ['serial'] });