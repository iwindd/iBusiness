"use server";
import { getServerSession } from "@/libs/session";
import { BusinessInputs } from "@/schema/BusinessSchema";
import Prisma from "@/libs/prisma";
import { order } from "@/libs/formatter";
import { TableFetch } from "@/typings/service";
import { cookies } from "next/headers";
import { v4 } from "uuid";
import { redirect } from "next/navigation";

export const upsertBusiness = async (payload: BusinessInputs, id?: number) => {
  try {
    const session = await getServerSession();
    const data = {
      ...payload,
      ownerId: Number(session?.user.id),
    };

    await Prisma.business.upsert({
      where: { id: id || 0 },
      create: data,
      update: {
        ...payload,
      },
    });
    return { state: true };
  } catch (error) {
    return { state: false };
  }
};

export const getBusiness = async (table: TableFetch) => {
  try {
    const session = await getServerSession();
    const data = await Prisma.$transaction([
      Prisma.business.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          ownerId: session?.user.uid,
        },
      }),
      Prisma.business.count({
        where: {
          ownerId: session?.user.uid,
        },
      }),
    ]);

    return {
      state: true,
      data: data[0],
      total: data[1],
    };
  } catch (error) {
    return {
      state: false,
      data: [],
      total: 0,
    };
  }
};

export const loginBusiness = async (application: number) => {
  try {
    const session = await getServerSession();
    const business = await Prisma.business.findFirst({
      where: { id: application, ownerId: session?.user.uid },
    });

    if (!business) throw Error("not found business");

    const token = v4();
    await Prisma.business.update({
      where: {
        id: application
      },
      data: {
        token: token
      }
    })

    cookies().delete('store-next-auth.session-token')

    return {
      state: true,
      redirect: `${process.env.APPLICATION_STORE}/auth/signin?token=${token}`
    }
  } catch (error) {
    return { state: false };
  }
};
