import CredentialsProvider from "next-auth/providers/credentials";
import Prisma from "@/libs/prisma";

export const authOptions = {
  pages: {
    signIn: "/",
  },
  session: {
    jwt: true,
    maxAge: 100 * 12 * 30 * 24 * 60 * 60, // 100 year
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ trigger, token, user, session }: any) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return {
        ...{
          application: token.application,
          fullname: token.fullname,
          email: token.email
        },
        ...user,
      };
    },
    async session({ session, token }: any) {
      session.user = token as any;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await Prisma.user.findFirst({
            where: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (!user) return null;
          return {
            id: String(user.id),
            application: null,
            fullname: `${user.firstname} ${user.lastname}`,
            email: user.email
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
};
