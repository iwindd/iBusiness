"use server";

import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { data } from "./page";

export const fetchingStock = async (payload: Record<string, number>) => {
  try {
    const serials = Object.entries(payload).map(item => item[0]);
    const session = await getServerSession();
    const data = await Prisma.product.findMany({
      where: {
        application: session?.user.application,
        retail: session?.user.retail,
        serial: { in: serials }
      },
      select: {
        id: true,
        serial: true,
        title: true,
        stock: true,
      }
    })

    return {
      success: true,
      data: data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const commitStock = async (payload: data[]) => {
  try {
    const session = await getServerSession();
    const data = await Prisma.$transaction(payload.map((data) => {
      return Prisma.product.update({
        where: {
          application: session?.user.application,
          retail: session?.user.retail,
          id: data.id
        },
        data: {
          stock: Number(data.all)
        }
      })
    }))

    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}