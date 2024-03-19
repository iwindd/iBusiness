"use server";

import { DateRange } from "@mui/x-date-pickers-pro";
import { getServerSession } from "./session";
import { Dayjs } from "dayjs";

type dayName = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"

interface Day {
  name: dayName,
  state: boolean,
  time: DateRange<Dayjs>
}

export const getData = async () => {
  const session = await getServerSession();
  const data = JSON.parse(session?.user.time as string)

  const checked: boolean = data.check;
  const isAllDay: boolean = data.mode[0] == "1";
  const isAllTime: boolean = data.mode[1] == "1";
  const days: Day[] = data.days;

  return { checked, isAllDay, isAllTime, days }
}

export const getDayWorkings = async () => {
  try {
    const data = await getData();
    return data.days.map((d) => d.state)
  } catch (error) {
    return [true, true, true, true, true, true, true]
  }
}