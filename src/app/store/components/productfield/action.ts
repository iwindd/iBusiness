"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { getFavoriteItems } from "../../cashier/action";

export const SelectizeProductFilter = async (filter: string) => {

  try {
    const session = await getServerSession()
    const data = await Prisma.product.findMany({
      take: 5,
      where: {
        application: session?.user.application,
        OR: [
          { serial: { contains: filter }, },
          { title: { contains: filter } },
          { keywords: { contains: filter } }
        ]
      },
      select: {
        serial: true,
        title: true,
        keywords: true
      }
    })

    return {
      favorites: (await getFavoriteItems()).data,
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

export const SelectizeGetProductData = async (serial: string) => {
  try {
    const session = await getServerSession();

    return {
      success: true,
      data: await Prisma.product.findFirst({
        where: {
          application: session?.user.application,
          serial: serial
        }
      })
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}