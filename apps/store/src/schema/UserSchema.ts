import { z } from 'zod';

export type SignInInputs = z.infer<typeof SignInSchema>
export const SignInSchema = z.object({
  email: z.string().email().min(6),
  password: z.string().min(6),
})

export type SignUpInputs = z.infer<typeof SignUpSchema>
export const SignUpSchema = z.object({
  firstname: z.string().min(6).max(60),
  lastname: z.string().min(6).max(60),
  email: z.string().email().min(6),
  password: z.string().min(6),
  password_confirmation: z.string().min(6)
}).refine((data) => data.password == data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})