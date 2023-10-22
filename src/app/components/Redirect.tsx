"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

function RedirectComponent({ path, children }: {
  path: string,
  children: React.ReactNode
}) {
  const router = useRouter();

  React.useEffect(() => {
    router.push(path);
  }, [])

  return children
}

export default RedirectComponent