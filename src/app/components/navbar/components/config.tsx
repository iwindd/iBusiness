import { AddShoppingCart, Category, Dashboard, Home, Inventory, ManageHistory} from "@mui/icons-material"
import { DrawerCategory } from "./typings"

export const DrawerItems: DrawerCategory[] = [
  {
    name: "main",
    label: "เมนูหลัก",
    items: [
      { name: "index", route: "/", label: "หน้าแรก", icon: <Home /> },
      { name: "dashboard", route: "/dashboard", label: "แดชบอร์ด", icon: <Dashboard /> }
    ]
  },
  {
    name: "store",
    label: "ร้านค้าของฉัน",
    items: [
      { name: "cashier", label: 'ขายสินค้า', route: "/cashier", icon: <AddShoppingCart />},
      { name: "products", label: 'สินค้า', route: "/products", icon: <Inventory /> },
      { name: "categories", label: 'ประเภทสินค้า', route: "/categories", icon: <Category /> },
      { name: "histories", label: 'ประวัติการขาย', route: "/histories", icon: <ManageHistory /> }
    ]
  }
]