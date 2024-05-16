import { paths } from '@/paths';
import { NavItemConfig } from '@/typings/layout';

const path = paths

export const ApplicationNavItems = [
  { key: 'overview', title: 'ภาพรวมธุรกิจ', href: path.overview, icon: 'chart-pie' },
  { key: 'business', title: 'ธุรกิจของฉัน', href: path.business, icon: 'business' },
  { key: 'account', title: 'บัญชีของฉัน', href: path.account, icon: 'person' },
  { key: 'employees', title: 'พนักงาน', href: path.employees, icon: 'badge' },
] satisfies NavItemConfig[];

export const StoreNavItems = [
  { key: 'overview', title: 'ภาพรวม', href: path.overview, icon: 'chart-pie' },
  { key: 'cashier', title: 'ขายสินค้า', href: path.cashier, icon: 'cashier' },
  { key: 'products', title: 'สินค้า', href: path.products, icon: 'product' },
  { key: 'stock', title: 'จัดการสต๊อก', href: path.stock, icon: 'stock' },
  { key: 'categories', title: 'ประเภทสินค้า', href: path.categories, icon: 'category' },
  { key: 'histories', title: 'ประวัติการขายสินค้า', href: path.histories, icon: 'history' },
] satisfies NavItemConfig[];

