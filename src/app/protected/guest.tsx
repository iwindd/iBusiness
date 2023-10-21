"use client";
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function GuestProtected({ children }: {
  children: React.ReactNode
}) {
  const { status: sessionStatus } = useSession()
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus == "authenticated") {
      router.push('/');
    }
  }, [sessionStatus])

  return (
    <>
      {children}
    </>
  )
}

export default GuestProtected