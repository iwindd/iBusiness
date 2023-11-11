"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { Order } from "@prisma/client";

export async function getHistories(
  page: number,
  size: number,
  search: string,
  sort: [string | null, "asc" | "desc"],
  scope: "today" | "week" | "month" | null
) {
  try {
    const session = await getServerSession();
    const orderBy: any = [{
      id: 'desc'
    }];

    if (sort[0] != null) {
      orderBy.unshift({
        [(sort[0] as string)]: sort[1]
      })
    }
    const queryWhere = {
      retail: session?.user.retail as boolean,
      application: session?.user.application as number,
      createdAt: {}
    }

    if (scope != null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scope == "today") {
        queryWhere.createdAt = {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        }
      } else if (scope == "week") {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        queryWhere.createdAt = {
          gte: oneWeekAgo,
          lt: today,
        }
      } else if (scope == "month") {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);

        queryWhere.createdAt = {
          gte: oneMonthAgo,
          lt: today,
        }
      }
    }

    const histories = await Prisma.$transaction([
      Prisma.order.count({
        where: queryWhere
      }),
      Prisma.order.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: orderBy,
        where: {
          ...queryWhere,
          OR: [
            {
              note: {
                contains: search
              },
            }
          ]
        }
      })
    ])

    return {
      success: true,
      data: histories[1],
      total: histories[0]
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

export async function getHistory(id: number) {
  try {
    const session = await getServerSession();
    const product = await Prisma.order.findFirst({
      where: {
        id: id,
        retail: session?.user.retail as boolean,
        application: session?.user.application as number
      }
    })

    return {
      success: true,
      data: product
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}
