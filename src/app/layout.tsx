import './globals.css'
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import Authentication from './components/Authentication';

export const metadata = {
  title: 'iMall',
  description: '',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {
            session ? (
              children
            ) : (
              <Authentication />
            )
          }
        </SessionProvider>
      </body>
    </html>
  )
}
