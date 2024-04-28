import { z } from 'zod';

export interface CategorySchemaInputs extends z.infer<typeof CategorySchema> { id?: number }

export const CategorySchema = z.object({
  title: z.string(),
})
