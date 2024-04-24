export const paths = {
  overview: '/',
  auth: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  cashier: "/cashier",
  products: "/products",
  categories: "/categories",
  histories: "/histories",
  account: {
    store: "/account/store"
  },
  employees: "/employees"
} as const;

export const routes = [
  { name: "home", path: '/', label: "หน้าแรก" },
  { name: "signin", path: '/auth/singin', label: "เข้าสู่ระบบ" },
  { name: "signup", path: '/auth/signup', label: "ลงทะเบียน" },
  { name: "cashier", path: '/cashier', label: 'ขายสินค้า' },
  { name: "products", path: '/products', label: 'สินค้า' },
  { name: "categories", path: '/categories', label: 'ประเภทสินค้า' },
  { name: "histories", path: '/histories', label: "ประวัติการขาย" },
  { name: "histories.history", path: '/histories/:id', label: "รายละเอียดการขายสินค้า" },
  { name: "employees", path: '/employees', label: 'พนักงาน' },
  { name: "account.store", path: '/account/store', label: 'ร้านค้า' }
] as {
  name: string,
  path: string,
  label: string
}[]