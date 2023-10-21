'use server';
import { Schema, Inputs } from './schema';
import Prisma from '@/libs/prisma';

const useResponse = (state: boolean, data: any) => {
  return {
    success: state,
    data: data
  }
}

export async function useRegister(payload: Inputs) {
  const result = Schema.safeParse(payload);
  const emailCheck = await Prisma.user.findFirst({
    where: {
      email: payload.email
    }
  })

  if (emailCheck != null) return useResponse(false, {type: "email", message: "Email already exists"})
  if (result.success) {
    try {
      const user = await Prisma.user.create({
        data: {
          email: payload.email,
          password: payload.password
        }
      })

      return useResponse(true, user);
    } catch (error) {
      return useResponse(false, "");
    }
  } else {
    return useResponse(false, result.error.format());
  }
}