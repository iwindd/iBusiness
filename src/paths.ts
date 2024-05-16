export const paths = {
  overview: '/',
  auth: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  cashier: "/store/cashier",
  products: "/store/products",
  stock: "/store/stock",
  categories: "/store/categories",
  histories: "/store/histories",
  account: {
    store: "/store/account/store"
  },
  employees: "/store/employees"
} as const;

export const routes = [
  { name: "home", path: '/', label: "หน้าแรก" },
  { name: "signin", path: '/auth/singin', label: "เข้าสู่ระบบ" },
  { name: "signup", path: '/auth/signup', label: "ลงทะเบียน" },
  { name: "cashier", path: '/store/cashier', label: 'ขายสินค้า' },
  { name: "products", path: '/store/products', label: 'สินค้า' },
  { name: "products.product", path: '/store/products/:id', label: 'รายละเอียดสินค้า' },
  { name: "stock", path: '/store/stock', label: 'จัดการสต๊อก' },
  { name: "categories", path: '/store/categories', label: 'ประเภทสินค้า' },
  { name: "categories.category", path: '/store/categories/:id', label: 'รายละเอียดประเภทสินค้า' },
  { name: "histories", path: '/store/histories', label: "ประวัติการขาย" },
  { name: "histories.history", path: '/store/histories/:id', label: "รายละเอียดการขายสินค้า" },
  { name: "employees", path: '/store/employees', label: 'พนักงาน' },
  { name: "account.store", path: '/store/account/store', label: 'ร้านค้า' }
] as {
  name: string,
  path: string,
  label: string
}[]