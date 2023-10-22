"use server";

import { getServerSession } from "next-auth";

export const ChooseApplication = async () => {
  const session = await getServerSession();

}