"use client";
import { useSession } from "next-auth/react"
import { signOut } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {JSON.stringify(session?.user)}</p>
        <button className="btn btn-primary" onClick={()=>signOut()}>LOGOUT</button>
      </>
    )
  }

  return <a href="/api/auth/signin">Sign in</a>
}