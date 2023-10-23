"use server";
import { getServerSession } from '@/libs/session';
import { Session } from 'next-auth';

export const getSessionAction = async () => {
  const session = await getServerSession();
  
  return session
}