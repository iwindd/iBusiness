import { Dashboard, People, Reply, Room, Settings } from "@mui/icons-material"
import { DrawerCategory } from "./typings"

export const DrawerItems: DrawerCategory[] = [
  {
    name: "main",
    label: "เมนูหลัก",
    items: [
      {
        name: "dashboard",
        route: "/dashboard",
        label: "แดชบอร์ด",
        icon: <Dashboard />
      }
    ]
  },
  {
    name: "store",
    label: "ร้านค้าของฉัน",
    items: [
      { name: "cashier", label: 'ขายสินค้า', route: "/cashier", icon: <Dashboard />},
      { name: "products", label: 'สินค้า', route: "/products", icon: <Dashboard /> },
      { name: "categories", label: 'ประเภทสินค้า', route: "/categories", icon: <Dashboard /> },
      { name: "histories", label: 'ประวัติการขาย', route: "/histories", icon: <Dashboard /> }
    ]
  }
]