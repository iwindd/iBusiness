"use server";
import { getServerSession } from '@/libs/session';

export const getSessionAction = async () => {
  const session = await getServerSession();
  
  return session
}