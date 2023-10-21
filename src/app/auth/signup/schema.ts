import { z } from 'zod';

export type Inputs = z.infer<typeof Schema>
export const Schema = z.object({
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string()
}).refine((data) => data.password == data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})