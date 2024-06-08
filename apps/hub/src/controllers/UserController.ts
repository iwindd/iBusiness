"use server";
import Prisma from "@/libs/prisma";
import {
  SignUpInputs as Inputs,
  SignUpSchema as Schema
} from '../schema/UserSchema'

export const Signup = async (payload: Inputs) => {
  const result = Schema.safeParse(payload);

  if (!result.success) {
    return { state: false, data: result.error.format() }
  }

  try {
    await Prisma.user.create({
      data: {
        email: payload.email,
        password: payload.password,
        firstname: payload.firstname,
        lastname: payload.lastname,
      }
    })

    return { state: true };
  } catch (error) {
    return { state: false };
  }
}