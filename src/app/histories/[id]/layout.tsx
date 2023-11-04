import Link from 'next/link'

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <div className="text-sm breadcrumbs">
        <ul>
          <li><Link href={'/histories'}>ประวัติการขายสินค้าทั้งหมด</Link></li>
          <li>ประวัติการขายสินค้า</li>
        </ul>
      </div>

      <main>
        {children}
      </main>
    </div>
  );
}
