"use server";
import Prisma from "@/libs/prisma";
import { TableFetch } from "@/typings/service";
import { order } from "@/libs/formatter";
import { getServerSession } from "@/libs/session";

export const getHistories = async (table: TableFetch) => {
  try {
    const session = await getServerSession();
    const data = await Prisma.$transaction([
      Prisma.order.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: { application: session?.user.application as number, }
      }),
      Prisma.order.count({
        where: { application: session?.user.application as number, }
      }),
    ])

    return {
      state: true,
      data: data[0],
      total: data[1]
    }
  } catch (error) {
    return {
      state: false,
      total: 0,
      data: []
    }
  }
}

export const getHistory = async (id: number) => {
  try {
    const session = await getServerSession();
    const product = await Prisma.order.findFirst({
      where: { application: session?.user.application, id: id },
      include: {
        products: true
      }
    })

    return {
      state: true,
      data: product
    }
  } catch (error) {
    return {
      state: false,
    }
  }
}
