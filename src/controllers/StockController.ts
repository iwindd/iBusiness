"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { StockItem } from "@/typings/stock";

export const FetchingStock = async (payload: Record<string, number>) => {
  try {
    const serials = Object.entries(payload).map(item => item[0]);
    const session = await getServerSession();
    const data = await Prisma.product.findMany({
      where: {
        application: session?.user.application,
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
      state: true,
      data: data
    }
  } catch (error) {
    return {
      state: false,
    }
  }
}

export const CommitStock = async (payload: StockItem[]) => {
  try {
    const session = await getServerSession();
    await Prisma.$transaction(
      payload.map((data) => {
        return Prisma.product.update({
          where: {
            application: session?.user.application,
            id: data.id
          },
          data: {
            stock: Number(data.all)
          }
        })
      })
    )

    return {
      state: true,
    }
  } catch (error) {
    return {
      state: false,
    }
  }
}