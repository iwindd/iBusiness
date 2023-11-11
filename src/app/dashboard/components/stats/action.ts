"use server"
import Prisma from '@/libs/prisma';
import { getServerSession } from '@/libs/session';

export const getDashboardStats = async () => {
  try {
    const session = await getServerSession();
    const queryWhere = { application: session?.user.application as number, retail: session?.user.retail as boolean }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const data = await Prisma.$transaction([
      Prisma.order.findMany({
        where: {
          ...queryWhere,
          createdAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),

      Prisma.order.findMany({
        where: {
          ...queryWhere,
          createdAt: {
            gte: oneWeekAgo,
            lt: today,
          },
        },
      }),

      Prisma.order.findMany({
        where: {
          ...queryWhere,
          createdAt: {
            gte: oneMonthAgo,
            lt: today,
          },
        },
      }),

      Prisma.product.count({
        where: {
          ...queryWhere,
          stock: { lte: 0 }
        }
      }),
      
      Prisma.product.count({
        where: {
          ...queryWhere,
          stock: { gte: 0 }
        }
      })
    ]);

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