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

    return { state: true };
  } catch (error) {
    return { state: false };
  }
}