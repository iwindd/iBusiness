"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { Inputs } from "./components/schema";
import { Activity } from "@/libs/activity";
import { GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";

export async function getCategories(
  sort: GridSortModel,
  pagination: GridPaginationModel,
  filter: GridFilterModel
) {
  try {

    const orderBy: any = [{
      id: 'desc'
    }];

    sort.map((sort) => {
      orderBy.unshift({
        [sort.field]: sort.sort
      })
    })

    const session = await getServerSession();
    const query = {
      application: session?.user.application as number,
      ...(
        filter?.quickFilterValues?.[0] != undefined ?
          ({
            OR: [{
              title: {
                contains: filter?.quickFilterValues?.[0]
              }
            }]
          }) : ({})
      )
    }

    const categories = await Prisma.$transaction([
      Prisma.category.count({
        where: query
      }),
      Prisma.category.findMany({
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: orderBy,
        where: query,
        include: {
          products: {
            select: {
              id: true
            }
          }
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
        application: session?.user.application as number,
        title: payload.title
      }
    })

    Activity({
      category: "Category",
      type: "ADD",
      data: {
        id: category.id,
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

export async function saveCategory(payload: Inputs, id: number) {
  try {
    const session = await getServerSession();
    const category = await Prisma.category.update({
      where: {
        id: id,
        application: session?.user.application as number
      },
      data: {
        title: payload.title
      }
    })

    Activity({
      category: "Category",
      type: "EDIT",
      data: {
        id: id,
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

export async function deleteCategory(id: number, title: string) {
  try {
    const session = await getServerSession();
    const category = await Prisma.category.delete({
      where: {
        id: id,
        application: session?.user.application as number
      }
    })

    Activity({
      category: "Category",
      type: "DELETE",
      data: {
        id: id,
        title: title
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