import { Breadcrumbs, Link, Typography } from '@mui/material';
/* import Link from 'next/link' */

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <Breadcrumbs>
        <Link underline="hover" color="inherit" href="/histories">
          ประวัติการขายสินค้าทั้งหมด
        </Link>
        <Typography color="text.primary">ประวัติการขายสินค้า</Typography>
      </Breadcrumbs>

      <main>
        {children}
      </main>
    </div>
  );
}
