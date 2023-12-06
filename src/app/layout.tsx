import './globals.css';
import { getServerSession } from '@/libs/session';

/* LAYOUYS */
import Authentication from './authentication';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

// PROVIDERS
import { InterfaceProvider } from './providers/InterfaceProvider';
import SessionProvider from './providers/SessionProvider';
import QueryProvider from './providers/QueryProvider';

/* COMPONENTS */
import Navbar from './components/navbar';

export const metadata = {
  title: 'iStore',
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
        <InterfaceProvider>
          <ThemeRegistry>
            <SessionProvider session={session}>
              <QueryProvider>
                {session ? (
                  <Navbar>
                    {children}
                  </Navbar>
                ) : (
                  <Authentication />
                )}
              </QueryProvider>
            </SessionProvider>
          </ThemeRegistry>
        </InterfaceProvider>
      </body>
    </html>
  );
}
