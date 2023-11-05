"use server";
import Prisma from "@/libs/prisma";
import { Inputs } from "./components/schema";
import { getServerSession } from "@/libs/session";

export async function getProducts(
  page: number,
  size: number,
  search: string,
  sort: [string | null, "asc" | "desc"],
  category: null | number
) {
  try {
    
    const orderBy: any = [{
      id: 'desc'
    }];
    if (sort[0] != null) {
      orderBy.unshift({
        [(sort[0] as string)]: sort[1]
      })
    }

    const session = await getServerSession();
    const products = await Prisma.$transaction([
      Prisma.product.count({
        where: {
          application: session?.user.application
        }
      }),
      Prisma.product.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: orderBy,
        where: {
          application: session?.user.application,
          ...(
            category != 0 ? {
              categoryId: category as number,
            }:{}
          ),
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
        },
        include: {
          category: {
            select: {
              title: true
            }
          }
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

export async function getProduct(serial: string) {
  try {
    const session = await getServerSession();
    const product = await Prisma.product.findFirst({
      where: {
        serial: serial,
        application: session?.user.application
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
        application: session?.user.application as number,
        serial: payload.serial,
        title: payload.title,
        price: payload.price,
        cost: payload.cost,
        stock: payload.stock,
        categoryId: Number(payload.categoryId)
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

export async function saveProduct(payload: Inputs, id: number) {
  try {
    const session = await getServerSession()
    const product = await Prisma.product.update({
      where: {
        id: id,
        application: session?.user.application
      },
      data: {
        title: payload.title,
        price: payload.price,
        cost: payload.cost,
        stock: payload.stock,
        categoryId: Number(payload.categoryId)
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

export async function deleteProduct(id: number) {
  try {
    const session = await getServerSession();
    const result = Prisma.product.delete({
      where: {
        id: id,
        application: session?.user.application
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