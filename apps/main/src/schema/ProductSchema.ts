import { isValidEAN } from '@/libs/utils';
import { z } from 'zod';

type Inputs = z.infer<typeof ProductSchema>
export interface ProductSchemaInputs extends Inputs {id?: number}
export interface ProductSearchSchemaInputs extends Inputs { }

export const ProductSchema = z.object({
  serial: z.string(),
  title: z.string(),
  price: z.number(),
  cost: z.number(),
  stock: z.number(),
  categoryId: z.number(),
  keywords: z.string()
})

export const ProductSearchSchema = z.object({
  serial: z.string()
}).refine((data) => isValidEAN(data.serial), { message: "Invalid EAN", path: ['serial'] });