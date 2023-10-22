"use client";
import { useSession } from "next-auth/react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const {data: session, update} = useSession();
  const router = useRouter();

  const onChooseApplication = async () => {
    await update({
      ...session,
      user: {
        ...session?.user,
        application: "OK"
      }
    })
  }

  useEffect(() => {
    if (session?.user?.application){
      router.push('/dashboard');
    }
  }, [session])

  return (
    <>
      <p>
        {JSON.stringify(session)}
      </p>
      <button className="btn btn-primary" onClick={onChooseApplication}>CHOOSE APPLICATION</button>
    </>
  )
}