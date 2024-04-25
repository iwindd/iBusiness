"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";

export async function getAllCategories() {
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