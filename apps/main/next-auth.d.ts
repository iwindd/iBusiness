import NextAuth from "next-auth"


declare module "next-auth" {
  interface Session {
    user: {
      id: string
      uid: number
      application: number,
      fullname: string,
      email: string
    }
  }
}