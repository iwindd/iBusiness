"use client";
import { useRouter } from "next/navigation";
import Loading from "./loading";

export default function Products() {
  const router = useRouter();

  router.push("/dashboard")
  return <Loading/>
}