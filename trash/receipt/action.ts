"use server";

import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { Design } from "./components/Dialog";

interface Payload {
  target?: number,
  title: string,
  design: Design
}

export const getDesigns = async () => {
  try {
    const session = await getServerSession();
    const designs = await Prisma.orderReceiptDesign.findMany({
      where: {
        application: session?.user.application
      }
    })

    return {
      success: true,
      data: designs
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const addDesign = async (payload: Payload) => {
  try {
    const session = await getServerSession();
    const design = await Prisma.orderReceiptDesign.create({
      data: {
        application: session?.user.application as number,
        logo: "",
        title: payload.title,
        design: JSON.stringify(payload.design)
      }
    })

    return {
      success: true,
      data: design
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const saveDesign = async (payload: Payload) => {
  try {
    const session = await getServerSession();
    const design = await Prisma.orderReceiptDesign.update({
      where: {
        id: payload.target as number,
        application: session?.user.application
      },
      data: {
        logo: "",
        title: payload.title,
        design: JSON.stringify(payload.design)
      }
    })

    return {
      success: true,
      data: design
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const deleteDesign = async (target: number) => {
  try {
    const session = await getServerSession();
    const design = Prisma.orderReceiptDesign.delete({
      where: {
        id: target,
        application: session?.user.application as number
      }
    })

    return {
      success: true,
      data: design
    }
  } catch (error) {
    return {
      success: false, error
    }
  }
}