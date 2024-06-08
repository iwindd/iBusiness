"use server";

import { push } from "@/libs/line";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";
import { Day } from "./components/Time";
import dayjs from "dayjs";

export const lineConnect = async (token: string) => {
  const session = await getServerSession();
  if (!session) return false;
  if (session.user.account.store.linetoken == token) return true

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

export const saveTime = async (data: Day[], dayMode: string, timeMode: string, check : boolean) => {
  try {
    const session = await getServerSession();
    const infomation = JSON.stringify({
      days: data.map((day) => {
        const open = dayjs(day.time[0]);
        const close = dayjs(day.time[1]);

        return {
          name: day.name,
          state: day.state,
          time: [open.toDate(), close.toDate()]
        }
      }),
      check: check,
      mode: [dayMode, timeMode]
    })

    await Prisma.user.update({
      data: { time: infomation },
      where: {
        id: session?.user.application
      }
    })

    return {
      success: true,
      infomation
    }
  } catch (error) {
    return {
      success: false
    }
  }
}

