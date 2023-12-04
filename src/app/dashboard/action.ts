"use server";
import { getServerSession } from "@/libs/session"
import Prisma from "@/libs/prisma";
import { getActivities, getBestSeller } from "./components/helper/action";

const getDate12MonthsAgo = (point: Date): Date[] => {
  const currentMonth = point.getMonth();
  const result: Date[] = [];
  const getLastDayOfMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  }

  for (let i = 0; i < 12; i++) {
    const date = new Date(point);

    if ((currentMonth - (i)) < 0) {
      date.setFullYear(date.getFullYear() - 1);
      date.setMonth(i);
    } else {
      date.setMonth(i)
    }

    date.setDate(getLastDayOfMonth(date.getFullYear(), date.getMonth()))
    result.push(date);
  }

  return result
}

export const getStoreStats = async () => {
  try {
    const session = await getServerSession();
    return {
      success: true,
      data: session
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const getAnalysisData = async () => {
  const session = await getServerSession();
  const point = new Date();
  point.setHours(0, 0, 0, 0);

  try {
    const months = getDate12MonthsAgo(point);

    const data = await Prisma.$transaction(months.map((end) => {
      const start = new Date(end);
      start.setDate(1);
      start.setHours(0, 0);
      end.setHours(23, 59);

      return Prisma.order.findMany({
        where: {
          application: session?.user.application,
          createdAt: {
            gte: start,
            lt: end
          }
        },
        select: {
          profit: true,
          cost: true,
          createdAt: true
        }
      })
    }))

    /* TIMES */
    const times: number[] = [];
    const week: number[] = [];
    for (let i = 0; i < 24; i++)  times.push(0)
    for (let i = 0; i < 7; i++)  week.push(0)
    data[new Date().getMonth() ].map((order) => times[order.createdAt.getHours()]++)
    data[new Date().getMonth() ].map((order) => {week[order.createdAt.getDay()]++})

    return {
      success: true,
      data: {
        bestSeller: await getBestSeller(),
        activities: await getActivities(),
        months: months,
        sold: data.map(info => info.length),
        profit: data.map((info) => info.reduce((total, order) => total + order.profit, 0), 0),
        cost: data.map((info) => info.reduce((total, order) => total + order.cost, 0), 0),
        times: times,
        week: week
      }
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}