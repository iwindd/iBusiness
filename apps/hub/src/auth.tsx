import CredentialsProvider from "next-auth/providers/credentials";
import Prisma from "@/libs/prisma";
const cookiePrefix = "hub";

export const authOptions = {
  pages: {
    signIn: "/",
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `${cookiePrefix}-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    csrfToken: {
      name: `${cookiePrefix}-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        maxAge: 900
      }
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 900
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
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
          id: token.id,
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
            uid: user.id,
            application: NaN,
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
