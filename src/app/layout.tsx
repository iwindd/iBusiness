import './globals.css';
import { getServerSession } from '@/libs/session';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* LAYOUYS */
import Authentication from './authentication';

// PROVIDERS
import { InterfaceProvider } from './providers/InterfaceProvider';
import SessionProvider from './providers/SessionProvider';
import QueryProvider from './providers/QueryProvider';
import { StorageProvider } from '@/storage';

/* COMPONENTS */
import LocalizationProvider from './providers/LocalizationProvider';
import ThemeRegistry from '../styles/ThemeRegistry';
import MainLayout from './providers/LayoutProvider';
import { RecoilRoot } from 'recoil';

export const metadata = {
  title: 'iStore',
  description: '',
  icons: {
    icon: [
      '/favicon.ico?v=1'
    ],
    apple: [
      '/apple-touch-icon.png?v=1',
    ],
    shortcut: [
      '/apple-touch-icon.png',
    ]
  },
  manifest: "/site.webmanifest"
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
        <RecoilRoot>
          <StorageProvider>
            <LocalizationProvider >
              <InterfaceProvider>
                <ThemeRegistry>
                  <SessionProvider session={session}>
                    <QueryProvider>
                      {session ? (
                        <MainLayout>
                          {children}
                        </MainLayout>
                      ) : (
                        <Authentication />
                      )}
                    </QueryProvider>
                  </SessionProvider>
                </ThemeRegistry>
              </InterfaceProvider>
            </LocalizationProvider>
          </StorageProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
