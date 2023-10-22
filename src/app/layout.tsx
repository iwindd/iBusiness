import './globals.css';
import SessionProvider from './components/SessionProvider';
import QueryProvider from './components/QueryProvider';
import Authentication from './authentication';
import Navbar from './components/navbar';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'iMall',
  description: '',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <QueryProvider>
            {session ? (
              <Navbar>{children}</Navbar>
            ) : (
              <Authentication />
            )}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
