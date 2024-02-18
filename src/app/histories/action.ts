"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";

export async function getHistories(
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
      retail: session?.user.retail as boolean,
      ...(
        filter?.quickFilterValues?.[0] != undefined ?
          ({
            OR: [
              {
                note: {
                  contains: filter?.quickFilterValues?.[0]
                },
              }, {
                productsText: {
                  contains: filter?.quickFilterValues?.[0]
                }
              }
            ]
          }) : ({})
      )
    }

    const orders = await Prisma.$transaction([
      Prisma.order.count({
        where: query
      }),
      Prisma.order.findMany({
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: orderBy,
        where: query
      })
    ])

    return {
      success: true,
      data: orders[1],
      total: orders[0]
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export async function getHistory(id: number) {
  try {
    const session = await getServerSession();
    const product = await Prisma.order.findFirst({
      where: {
        application: session?.user.application,
        id: Number(id)
      },
      include: {
        products: true
      }
    })

    return {
      success: true,
      data: product
    }
  } catch (error) {
    console.error(error);
    
    return {
      success: false,
      error: "error"
    }
  }
}
