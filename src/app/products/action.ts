"use server";
import Prisma from "@/libs/prisma";
import { Inputs } from "./components/schema";
import { getServerSession } from "@/libs/session";
import { Activity } from "@/libs/activity";
import { GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";

export async function getProducts(
  sort: GridSortModel,
  pagination: GridPaginationModel,
  filter: GridFilterModel,
  filterCategory: number | null
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
      retail: session?.user.retail as boolean,
      ...(
        filterCategory != 0 ? {
          categoryId: filterCategory as number,
        } : {}
      ),
      ...(
        filter?.quickFilterValues?.[0] != undefined ?
          ({
            OR: [{
              serial: {
                contains: filter?.quickFilterValues?.[0]
              },
            }, {
              title: {
                contains: filter?.quickFilterValues?.[0]
              }
            }]
          }) : ({})
      )
    }

    const resp = await Prisma.$transaction([
      Prisma.product.findMany({
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: orderBy,
        where: query
      }),
      Prisma.product.count({
        where: query
      }),
      Prisma.category.findMany({
        where: {
          application: session?.user.application,
        },
        select: {
          id: true,
          title: true
        }
      })
    ])

    return {
      success: true,
      data: resp[0],
      total: resp[1],
      categories: resp[2]
    }
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }
}

export async function setFavorite(id: number, state: boolean) {
  try {
    const session = await getServerSession();

    return {
      success: true,
      data: await Prisma.product.update({
        where: {
          application: session?.user.application,
          retail: session?.user.retail,
          id: id
        },
        data: {
          favorite: state
        }
      })
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
    const session = await getServerSession();
    const checkAlready = await Prisma.product.findFirst({
      where: {
        application: session?.user.application as number,
        retail: session?.user.retail,
        serial: payload.serial
      }
    })

    if (checkAlready) throw new Error("already_serial")

    const product = await Prisma.product.create({
      data: {
        application: session?.user.application as number,
        retail: session?.user.retail,
        serial: payload.serial,
        title: payload.title,
        price: payload.price,
        keywords: payload.keywords || "",
        cost: payload.cost,
        stock: payload.stock,
        categoryId: Number(payload.categoryId)
      }
    })

    Activity({
      category: "Product",
      type: "ADD",
      data: {
        id: product.id,
        title: product.title
      }
    });

    return {
      success: true,
      data: product
    }
  } catch (error) {
    console.error(error);
    
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
        keywords: payload.keywords,
        categoryId: Number(payload.categoryId)
      }
    })

    Activity({
      category: "Product",
      type: "EDIT",
      data: {
        id: product.id,
        title: product.title
      }
    });

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

export async function deleteProduct(id: number, title: string) {
  try {
    const session = await getServerSession();
    const result = Prisma.product.delete({
      where: {
        id: id,
        application: session?.user.application
      }
    })

    Activity({
      category: "Product",
      type: "DELETE",
      data: {
        id: id,
        title: title
      }
    });

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