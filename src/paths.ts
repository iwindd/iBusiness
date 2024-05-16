export const paths = {
  overview: '/',
  business: "/business",
  business_create: '/business/create',
  account: "/account",
  employees: "/employees",

  //Auth
  auth: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },

  //Store
  cashier: "/store/cashier",
  products: "/store/products",
  stock: "/store/stock",
  categories: "/store/categories",
  histories: "/store/histories",
/*   account: {
    store: "/store/account/store"
  }, */

} as const;

export const routes = [
  { name: "home", path: '/', label: "ภาพรวมธุรกิจ" },
  { name: "business", path: '/business', label: "ธุรกิจของฉัน" },
  { name: "business.create", path: '/business/create', label: "ธุรกิจใหม่" },
  { name: "account", path: '/account', label: "บัญชีของฉัน" },
  { name: "employees", path: '/employees', label: "พนักงาน" },

  //Auth
  { name: "signin", path: '/auth/singin', label: "เข้าสู่ระบบ" },
  { name: "signup", path: '/auth/signup', label: "ลงทะเบียน" },

  //Store
  { name: "cashier", path: '/store/cashier', label: 'ขายสินค้า' },
  { name: "products", path: '/store/products', label: 'สินค้า' },
  { name: "products.product", path: '/store/products/:id', label: 'รายละเอียดสินค้า' },
  { name: "stock", path: '/store/stock', label: 'จัดการสต๊อก' },
  { name: "categories", path: '/store/categories', label: 'ประเภทสินค้า' },
  { name: "categories.category", path: '/store/categories/:id', label: 'รายละเอียดประเภทสินค้า' },
  { name: "histories", path: '/store/histories', label: "ประวัติการขาย" },
  { name: "histories.history", path: '/store/histories/:id', label: "รายละเอียดการขายสินค้า" },
] as {
  name: string,
  path: string,
  label: string
}[]