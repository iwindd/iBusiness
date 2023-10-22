import './globals.css'
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import Authentication from './authentication';
import Navbar from './components/navbar';
import Application from './components/Application';

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
      <body >
        <SessionProvider session={session}>
          {
            session ? (
              <Navbar>
                {
                  session?.user.application ? (
                    children
                  ) : (
                    <Application />
                  )
                }
              </Navbar>
            ) : (
              <Authentication />
            )
          }
        </SessionProvider>
      </body>
    </html>
  )
}
