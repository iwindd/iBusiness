"use client";

import { useSession } from "next-auth/react";
import { getSessionAction } from "./action";

export default function Products() {
  const { data: session } = useSession();

  const onGetServerSession = async () => {
    const resp = await getSessionAction();
  }

  return (
    <p>
      {JSON.stringify(session)}

      <br />
      <button className="btn btn-primary" onClick={onGetServerSession}>get server session</button>
    </p>
  )
}