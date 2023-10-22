import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Prisma from '@/libs/prisma'

export const authOptions = {
  pages: {
    signIn: '/'
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days (in seconds)
    updateAge: 24 * 60 * 60, // 24 hours (in seconds)
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === 'update') {
        return { ...token, ...session.user }
      }

      return { ...token, ...user }
    },

    async session({ session, token }: any) {
      session.user = token as any
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
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
              id: String(user?.id),
              email: user?.email,
              application: ""
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
