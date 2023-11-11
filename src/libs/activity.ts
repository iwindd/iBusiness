"use server";
import Prisma from "./prisma";
import { getServerSession } from "./session";

export type ActivityPayload = Product | Cashier | Category
interface Product {
  category: "Product"
  type: "ADD" | "EDIT" | "DELETE",
  data: {
    id: number,
    title: string
  }
}

interface Cashier {
  category: "Cashier"
  type: "PAYMENT"
  data: {
    id: number
  }
}

interface Category {
  category: "Category"
  type: "ADD" | "EDIT" | "DELETE"
  data: {
    id: number,
    title: string
  }
}

export const Activity = async (
  payload: ActivityPayload
) => {
  const session = await getServerSession();
  if (!session?.user.application) return

  return await Prisma.activity.create({
    data: {
      application: session.user.application as number,
      category: payload.category,
      type: payload.type,
      payload: JSON.stringify(payload.data),
    }
  })
}

