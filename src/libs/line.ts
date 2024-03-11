"use server";
import axios from "axios"
import { getServerSession } from "./session"

export const push = async (msg: string, token?: string) => {
  let token_ = token || (await getServerSession())?.user.account.store.linetoken
  
  return axios.post('https://notify-api.line.me/api/notify',
    `message=${encodeURIComponent(msg)}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token_}`
      }
    }
  )
}
