"use client";
import Link from "next/link";

const Navigation = (props: {
  href: string,
  header: string,
  variant?: string,
  children: React.ReactNode
}) => {
  return (
    <Link href={props.href}>
      <div
        className={`border rounded cursor-pointer shadow-sm transition-all ${props.variant} hover:bg-base-100 overflow-hidden`}
      >
        <header className="p-1">{props.header}</header>
        <article className="bg-white">
          {props.children}
        </article>
      </div>
    </Link>
  )
}

const navigations = [
  { header: "แดชบอร์ด", href: "dashboard", label: "dashboard", variant: "bg-red-400 hover:bg-red-500" },
  { header: "ขายสินค้า", href: "cashier", label: "ขายสินค้า", variant: "bg-green-400 hover:bg-green-500" },
  { header: "สินค้า", href: "products", label: "สินค้า", variant: "bg-orange-400 hover:bg-orange-500" },
  { header: "ประเภทสินค้า", href: "dashboard", label: "ประเภทสินค้า", variant: "bg-blue-400 hover:bg-blue-500" },
  { header: "ประวัติการขาย", href: "dashboard", label: "ประวัติการขาย", variant: "bg-yellow-300 hover:bg-yellow-400" }
]

export default function Index() {
  return <>
    <div className="container">
      <div className="grid grid-cols-2 gap-2">
        {
          navigations.map(nav => {
            return (
              <Navigation href={nav.href} header={nav.header} variant={nav.variant}>
                <article className="p-4">
                  {nav.label}
                </article>
              </Navigation>
            )
          })
        }
      </div>
    </div>
  </>
}