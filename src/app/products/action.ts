"use server";
import Prisma from "@/libs/prisma";
import { Inputs } from "./[serial]/schema";
import { getServerSession } from "@/libs/session";
import { Session } from "next-auth";

export async function getProducts() {
  try {
    const session = await getServerSession();
    const products = await Prisma.product.findMany({
      where: {
        userId: Number(session?.user.application)
      }
    })

    return {
      success: true,
      data: products
    }
  } catch (error) {
    return {
      success: false,
      data: []
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