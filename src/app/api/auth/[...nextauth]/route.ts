import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Prisma from '@/libs/prisma'

export const authOptions = {
  pages: {
    signIn: '/'
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ trigger, token, user, session }: any) {
      if (trigger === 'update') {
        return { ...token, ...session.user }
      }

      return {
        ...{
          email: token.email,
          application: token.application,
          cart: token.cart,
          retail: token.retail,
          title: token.title,
          displaytitle: token.displaytitle,
        }, ...user
      }
    },
    async session({ session, token }: any) {
      session.user = token as any

      return session
    }
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await Prisma.user.findFirst({
            where: {
              email: credentials.email,
              password: credentials.password,
            }
          });

          return user
            ? {
              ...user,
              id: String(user.id),
              application: user.id,
              retail: true,
              title: user.title,
              displaytitle: user.displaytitle
            }
            : null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
