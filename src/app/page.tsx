"use client";
import Link from "next/link";
import { Typography } from '@mui/material';
import { DrawerItems } from "./components/navbar/components/config";
import { DrawerItem } from "./components/navbar/components/typings";

const Navigation = (props: {
  href: string,
  header: string,
  variant?: string,
  startWith: React.ReactNode,
  children: React.ReactNode
}) => {
  return (
    <Link href={props.href}>
      <div
        className={`border rounded cursor-pointer shadow-sm transition-all hover:shadow-md overflow-hidden`}
      >
        <header className="p-1 px-3 border-b flex items-center gap-2">
          {props.startWith}
          <Typography variant="h6">{props.header}</Typography>
        </header>
        <article className="bg-white">
          {props.children}
        </article>
      </div>
    </Link>
  )
}

export default function Index() {
  const navigations : DrawerItem[] = [...DrawerItems.map(a => a.items)].flat().filter(i => i.route != "/");

  return <>
    <div className="container">
      <div className="grid grid-cols-2 gap-2">
        {
          navigations.map(nav => {
            return (
              <Navigation key={nav.name} startWith={nav.icon} href={nav.route} header={nav.label}>
                <article className="p-2 px-3">
                  <Typography variant="caption">
                    <i>{nav.desc}</i>
                  </Typography>
                </article>
              </Navigation>
            )
          })
        }
      </div>
    </div>
  </>
}