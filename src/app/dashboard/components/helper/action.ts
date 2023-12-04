"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { filterArrayByProperty } from "@/libs/utils";

export interface BestSellerItem {
  serial: string,
  title: string,
  sold: number
}

export async function getBestSeller() {
  try {
    const today = new Date();
    today.setHours(23, 59, 0, 0);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const session = await getServerSession()
    const orders = await Prisma.order.findMany({
      where: {
        application: session?.user.application as number,
        retail: session?.user.retail as boolean,
        createdAt: {
          gte: oneMonthAgo,
          lt: today,
        },
      },
      include: {
        products: true
      }
    })

    const bestSeller: BestSellerItem[] = []

    orders.map((order) => {
      filterArrayByProperty(order.products, 'serial').map((product) => bestSeller.push({
        ...product,
        sold: order.products.filter(p => p.serial == product.serial).reduce((total, product) => total + product.count, 0)
      }))
    })

    return {
      success: true,
      data: filterArrayByProperty(bestSeller, "serial").map((product) => {
        return {
          serial: product.serial,
          title: product.title,
          sold: bestSeller.filter(p => product.serial == p.serial).reduce((total, product) => total + product.sold, 0)
        }
      })
    }
  } catch (error) {
    return {
      success: false,
      data: []
    }
  }
}

export async function getActivities() {
  try {
    const session = await getServerSession()
    const activities = await Prisma.activity.findMany({
      where: {
        application: session?.user.application as number,
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 7
    })

    return {
      success: true,
      data: activities
    }
  } catch (error) {
    return {
      success: true,
      data: []
    }
  }
}