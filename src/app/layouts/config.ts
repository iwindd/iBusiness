import { paths } from '@/paths';
import { NavItemConfig } from '@/typings/layout';

const path = paths

export const navItems = [
  { key: 'overview', title: 'ภาพรวม', href: path.overview, icon: 'chart-pie' },
  { key: 'cashier', title: 'ขายสินค้า', href: path.cashier, icon: 'cashier' },
  { key: 'products', title: 'สินค้า', href: path.products, icon: 'product' },
  { key: 'stock', title: 'จัดการสต๊อก', href: path.stock, icon: 'stock' },
  { key: 'categories', title: 'ประเภทสินค้า', href: path.categories, icon: 'category' },
  { key: 'histories', title: 'ประวัติการขายสินค้า', href: path.histories, icon: 'history' },
  { key: 'store', title: 'ร้านค้า', href: path.account.store, icon: 'store' },
  { key: 'employees', title: 'พนักงาน', href: path.employees, icon: 'employees' },
] satisfies NavItemConfig[];
