"use server";
import Prisma from "@/libs/prisma";
import { TableFetch } from "@/typings/service";
import { order } from "@/libs/formatter";
import { getServerSession } from "@/libs/session";
import { ProductSchemaInputs } from "@/schema/ProductSchema";

export const getProducts = async (table: TableFetch) => {
  try {
    const session = await getServerSession();
    const data = await Prisma.$transaction([
      Prisma.product.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          application: session?.user.application
        }
      }),
      Prisma.product.count({
        where: {
          application: session?.user.application
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

export const getProduct = async (identifier: string) => {
  try {
    const session = await getServerSession();
    const product = await Prisma.product.findFirst({
      where: {
        application: session?.user.application,
        serial: identifier
      }
    })

    return {
      state: true,
      data: product
    }
  } catch (error) {
    return {
      state: false
    }
  }
}

export const setProductFavorite = async (id: number, state: boolean) => {
  try {
    const session = await getServerSession();
    await Prisma.product.update({
      where: {
        application: session?.user.application,
        id: id
      },
      data: {
        favorite: state
      }
    })

    return { state: true }
  } catch (error) {
    return { state: false }
  }
}

export const upsertProduct = async (payload: ProductSchemaInputs, id?: number) => {
  try {
    const session = await getServerSession();

    const data = {
      application: session?.user.application as number,
      serial: payload.serial,
      title: payload.title,
      price: payload.price,
      keywords: payload.keywords || "",
      cost: payload.cost,
      stock: payload.stock,
      categoryId: Number(payload.categoryId),
    }

    await Prisma.product.upsert({
      where: { id: id || 0, },
      create: data,
      update: {
        title: data.title,
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        keywords: data.keywords || "",
        categoryId: data.categoryId
      }
    })
    return { state: true, }
  } catch (error) {
    console.log(error);
    
    return { state: false, }
  }
}