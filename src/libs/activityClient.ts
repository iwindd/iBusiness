"use client";
import { ActivityPayload } from "./activity"

export const ParseActivity = async (payload: ActivityPayload) => {
  return `${payload.category}-${payload.type}`
}