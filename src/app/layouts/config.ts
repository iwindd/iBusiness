import { paths } from '@/paths';
import { NavItemConfig } from '@/typings/layout';

const path = paths

export const navItems = [
  { key: 'overview', title: 'ภาพรวม', href: path.overview, icon: 'chart-pie' },
  { key: 'cashier', title: 'ขายสินค้า', href: path.cashier, icon: 'user' },
  { key: 'products', title: 'สินค้า', href: path.products, icon: 'user' },
  { key: 'categories', title: 'ประเภทสินค้า', href: path.categories, icon: 'user' },
  { key: 'histories', title: 'ประวัติการขายสินค้า', href: path.histories, icon: 'user' },
  { key: 'store', title: 'ร้านค้า', href: path.account.store, icon: 'user' },
  { key: 'employees', title: 'พนักงาน', href: path.employees, icon: 'user' },
] satisfies NavItemConfig[];
