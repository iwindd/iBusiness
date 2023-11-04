"use server";
import Prisma from "@/libs/prisma";
import { Inputs } from "./components/schema";
import { getServerSession } from "@/libs/session";

export async function getProducts(
  page: number, 
  size: number, 
  search: string, 
  sort: [string | null, "asc" | "desc"]
) {
  try {

    const orderBy : any = {};
    if (sort[0] != null){
      orderBy[(sort[0] as string).toLowerCase()] = sort[1]
    }

    const session = await getServerSession();
    const products = await Prisma.$transaction([
      Prisma.product.count({
        where: {
          userId: Number(session?.user.application)
        }
      }),
      Prisma.product.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: orderBy,
        where: {
          userId: Number(session?.user.application),
          OR: [
            {
              serial: {
                contains: search
              },
            },
            {
              title: {
                contains: search
              }
            }
          ]
        }
      })
    ])

    return {
      success: true,
      data: products[1],
      total: products[0]
    }
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }
}

export async function getProduct(serial : string) {
  try {
    const session = await getServerSession();
    const product = await Prisma.product.findFirst({
      where: {
        serial: serial,
        userId: Number(session?.user.application)
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

export async function addProduct(payload: Inputs) {
  try {
    const session = await getServerSession()
    const product = await Prisma.product.create({
      data: {
        userId: Number(session?.user.application),
        serial: payload.serial,
        title: payload.title,
        price: payload.price,
        cost: payload.cost,
        stock: payload.stock
      }
    })

    return {
      success: true,
      data: product
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

export async function saveProduct(payload: Inputs) {
  try {
    const session = await getServerSession()
    const product = await Prisma.product.update({
      where: {
        userId: Number(session?.user.application),
        serial: payload.serial
      },
      data: {
        ...payload,
      }
    })

    return {
      success: true,
      data: product
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

export async function deleteProduct(payload: String) {
  try {
    const session = await getServerSession();
    const result = Prisma.product.delete({
      where: {
        serial: String(payload),
        userId: Number(session?.user.application)
      }
    })

    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}