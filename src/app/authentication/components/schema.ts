import { z } from 'zod';

export type SignInInputs = z.infer<typeof SignInSchema>
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignUpInputs = z.infer<typeof SignUpSchema>
export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string()
}).refine((data) => data.password == data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})