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
] as {
  name: string,
  path: string,
  label: string
}[]