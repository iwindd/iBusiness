'use server';
import Prisma from '@/libs/prisma';
import {
  SignUpInputs as Inputs,
  SignUpSchema as Schema
} from './schema';

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

  if (emailCheck != null) return useResponse(false, { type: "email", message: "Email already exists" })
  if (result.success) {
    try {
      const user = await Prisma.user.create({
        data: {
          email: payload.email,
          password: payload.password,
          title: payload.title,
          displaytitle: payload.displaytitle,
          address: payload.address,
          area: payload.area,
          district: payload.district,
          firstname: payload.firstname,
          lastname: payload.lastname,
          postalcode: payload.postalcode,
          provice: payload.province,
          tel: payload.tel
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