"use client";
import Link from "next/link";
import { Divider, Paper, Typography } from '@mui/material';
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
    <Link href={props.href} className="hover:translate-y-1 transition-all duration-200 ">
      <Paper
        className={`border p-3 cursor-pointer space-y-1 transition-all overflow-hidden`}
      >
        <header className="p-1 px-3 flex items-center gap-2 bg-common-main">
          {props.startWith}
          <Typography variant="h6">{props.header}</Typography>
        </header>
        <Divider/>
        <article className="bg-white">
          {props.children}
        </article>
      </Paper>
    </Link>
  )
}

export default function Index() {
  const navigations: DrawerItem[] = [...DrawerItems.map(a => a.items)].flat().filter(i => i.route != "/");

  return <>
    <div className="container">
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
        {
          navigations.map(nav => {
            return (
              <Navigation key={nav.name} startWith={nav.icon} href={nav.route} header={nav.label}>
                <article className="p-2 px-3">
                  <Typography variant="body2">{nav.desc}</Typography>
                </article>
              </Navigation>
            )
          })
        }
      </div>
    </div>
  </>
}