"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { Inputs } from "./components/schema";

export async function getCategories(
  page: number,
  size: number,
  search: string,
  sort: [string | null, "asc" | "desc"]
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
    const categories = await Prisma.$transaction([
      Prisma.category.count({
        where: {
          application: Number(session?.user.application)
        }
      }),
      Prisma.category.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: orderBy,
        where: {
          application: Number(session?.user.application),
          OR: [
            {
              title: {
                contains: search
              },
            }
          ]
        }
      })
    ])

    return {
      success: true,
      data: categories[1],
      total: categories[0]
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

export async function addCategory(payload: Inputs) {
  try {
    const session = await getServerSession();
    const category = await Prisma.category.create({
      data: {
        application: Number(session?.user.application),
        title: payload.title
      }
    })

    return {
      success: true,
      data: category
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export async function updateCategory(id: number, payload: Inputs) {
  try {
    const session = await getServerSession();
    const category = await Prisma.category.update({
      where: {
        id: id,
        application: Number(session?.user.application)
      },
      data: payload
    })

    return {
      success: true,
      data: category
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export async function deleteCategory(id: number) {
  try {
    const session = await getServerSession();
    const category = await Prisma.category.delete({
      where: {
        id: id,
        application: Number(session?.user.application)
      }
    })

    return {
      success: true,
      data: category
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}