"use server";

import { push } from "@/libs/line";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";

export const lineConnect = async (token: string) => {
  const session = await getServerSession();
  if (!session) return false;

  try {

    const pushResp = await push("เชื่อมต่อกับ iStore สำเร็จ!", token);
    if (pushResp) {
      await Prisma.user.update({
        data: {
          lineNotify: token
        },
        where: {
          id: session.user.application
        }
      })
    }

    return true
  } catch (error) {
    return false
  }
}