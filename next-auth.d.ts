import NextAuth from "next-auth"


declare module "next-auth" {
  interface Session {
    user: {
      id: string
      uid: number
      application: number | null,
      fullname: string,
      email: string
    }
  }
}