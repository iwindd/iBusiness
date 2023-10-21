import Prisma from "@/libs/prisma";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: "/"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await Prisma.user.findFirst({
            where: {
              email: credentials.email,
              password: credentials.password
            }
          });

          return user ? {
            id: String(user?.id),
            email: user?.email
          }: null
        } catch (error) {
          return null
        }
      }
    })
  ],
}

export const handler = NextAuth(authOptions);
export {
  handler as GET,
  handler as POST
}