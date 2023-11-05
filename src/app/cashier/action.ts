"use server";

import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { Inputs } from "./schema";
import { CartItem } from "../../../next-auth";

interface Product extends CartItem {
  price: number,
  cost: number,
  count: number
}

export const AddToCashier = async (payload: Inputs) => {
  try {
    const session = await getServerSession();
    const product = await Prisma.product.findFirst({
      where: {
        serial: payload.serial,
        application: session?.user.application
      },
      include: {
        category: true
      }
    })

    if (!product) {
      return {
        success: false,
        error: "no_found_product"
      }
    }

    return {
      success: true,
      data: product
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error
    }
  }
}

export const PaymentAction = async (paymentPayload: {
  note: string,
  type: 0 | 1
}) => {
  try {
    const session = await getServerSession();
    const cart = session?.user.cart || [];

    if (cart.length <= 0) return;

    const payload: Product[] = cart.map((p) => {
      return {
        ...p,
        price: 0,
        cost: 0
      }
    })

    const data = await Prisma.product.findMany({
      where: {
        serial: { in: payload.map(p => p.serial) }
      },
      include: {
        category: true
      }
    })

    const products: Product[] = data.map((product) => {
      return {
        serial: product.serial,
        title: product.title,
        price: product.price,
        cost: product.cost,
        count: (payload.find(p => p.serial == product.serial) as Product).count,
        category: product.category.title
      }
    })

    const Order = await Prisma.order.create({
      data: {
        ...paymentPayload,
        price: products.reduce((total, p) => total + p.price*p.count, 0),
        cost: products.reduce((total, p) => total + p.cost*p.count, 0),
        profit: products.reduce((total, p) => total + p.price*p.count, 0)-products.reduce((total, p) => total + p.cost*p.count, 0),
        application: Number(session?.user.application),
        productsText: products.map(p => p.title).join(", "),
        products: {
          create: products
        }
      }
    }) 

    return {
      success: true,
      data: Order
    }
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: error
    }
  }
}