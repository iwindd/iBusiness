"use server";
import Prisma from "@/libs/prisma";
import { Inputs } from "./components/schema";
import { getServerSession } from "@/libs/session";
import { Activity } from "@/libs/activity";
import { SmartTableFetch } from "../components/SmartTable";

export async function getProducts(
  { sort, pagination, filter }: SmartTableFetch,
  filterCategory: number | null = 0
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
      })
    ])

    return {
      success: true,
      data: resp[0],
      total: resp[1]
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0
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
      data: [],
      total: 0
    }
  }
}

export async function addProduct(payload: Inputs) {
  try {
    const session = await getServerSession();
    const checkAlready = await Prisma.product.findFirst({
      where: {
        application: session?.user.application as number,
        serial: payload.serial
      }
    })

    if (checkAlready) throw new Error("already_serial")
    const product = await Prisma.product.create({
      data: {
        application: session?.user.application as number,
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

export async function upsertProduct(payload: Inputs, id?: number) {
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
      categoryId: Number(payload.categoryId)
    }

    const product = await Prisma.product.upsert({
      where: {
        id: id || 0,
      },
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
    
    return {
      state: true,
      data: product,
    }

  } catch (error) {
    console.error(error);
    
    return {
      state: false,
      data: ""
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

export async function findProduct(serial: string) {
  try {
    const session = await getServerSession();
    const product = await Prisma.product.findFirst({
      where: {
        application: session?.user.application,
        serial: serial
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