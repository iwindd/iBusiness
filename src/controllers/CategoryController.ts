"use server";
import Prisma from "@/libs/prisma";
import { TableFetch } from "@/typings/service";
import { order } from "@/libs/formatter";
import { CategorySchemaInputs } from "@/schema/CategorySchema";
import { getServerSession } from "@/libs/session";

export const getCategories = async (table: TableFetch) => {
  try {
    const session = await getServerSession();
    const categories = await Prisma.$transaction([
      Prisma.category.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          application: session?.user.application as number
        },
        include: {
          products: {
            select: {
              id: true
            }
          }
        }
      }),
      Prisma.category.count({
        where: {
          application: session?.user.application as number
        }
      }),
    ])

    return {
      state: true,
      data: categories[0],
      total: categories[1]
    }
  } catch (error) {
    return {
      state: false,
      total: 0,
      data: []
    }
  }
}

export const getAllCategories = async () => {
  try {
    const session = await getServerSession();
    const categories = await Prisma.category.findMany({
      where: { application: session?.user.application as number, },
      select: {
        id: true,
        title: true
      }
    })

    return {
      state: true,
      data: categories,
    }
  } catch (error) {
    return {
      state: false,
      data: []
    }
  }
}

export const upsertCategory = async (payload: CategorySchemaInputs, id?: number) => {
  try {
    const session = await getServerSession();
    const data = {
      application: session?.user.application as number,
      title: payload.title
    }

    await Prisma.category.upsert({
      where: { id: id|| -1, },
      create: data,
      update: { title: data.title, }
    })
    return { state: true, }
  } catch (error) {
    console.log(error);
    
    return { state: false, }
  }
}

export const deleteCategory = async (id: number) => {
  try {
    const session = await getServerSession();
    await Prisma.category.delete({
      where: {
        id: id,
        application: session?.user.application
      }
    })

    return { state: true, }
  } catch (error) {
    return { state: false, }
  }
}