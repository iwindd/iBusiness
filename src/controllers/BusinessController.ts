"use server";
import { getServerSession } from "@/libs/session";
import { BusinessInputs } from "@/schema/BusinessSchema";
import Prisma from "@/libs/prisma";
import { order } from "@/libs/formatter";
import { TableFetch } from "@/typings/service";

export const upsertBusiness = async (payload: BusinessInputs, id?: number) => {
  try {
    const session = await getServerSession();
    const data = {
      title: payload.title,
      tel: payload.tel,
      ownerId: Number(session?.user.id )
    }

    await Prisma.business.upsert({
      where: { id: id || 0, },
      create: data,
      update: {
        title: data.title,
        tel: data.tel
      }
    })
    return { state: true, }
  } catch (error) {
    return { state: false, }
  }
}

export const getBusiness = async (table: TableFetch) => {
  try {
    const session = await getServerSession();
    const data = await Prisma.$transaction([
      Prisma.business.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          ownerId: session?.user.uid
        },
      }),
      Prisma.business.count({
        where: {
          ownerId: session?.user.uid
        }
      })
    ])

    return {
      state: true,
      data: data[0],
      total: data[1]
    }
  } catch (error) {
    return {
      state: false,
      data: [],
      total: 0
    }
  }
}
