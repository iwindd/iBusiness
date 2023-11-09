"use client";
import React from 'react'
import Header from './header';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SideState } from '..';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import { NavButton, NavCategories, NavRoute, NavSwitch } from './typings';

type Header = NavButton | NavCategories | NavSwitch | NavRoute

const headers: Header[] = [
  {
    label: "แดชบอร์ด", type: "route", route: "/dashboard"
  },
  {
    label: "ร้านค้า", type: "categories", items: [
      { type: "route", label: 'ขายสินค้า', route: "/cashier" },
      { type: "route", label: 'สินค้า', route: "/products" },
      { type: "route", label: 'ประเภทสินค้า', route: "/categories" },
      { type: "route", label: 'ประวัติการขาย', route: "/histories" }
    ]
  },
  {
    id: "retail",
    label: "ประเภท : ",
    type: "switch",
    value: true,
    active: "ขายปลีก",
    unactive: "ขายส่ง"
  }
]

const NavClass = `flex w-full justify-between px-4 py-2 text-left text-sm font-medium outline-none hover:bg-base-200 transition-all `;

function Sidebar({ SideState: Sidebar }: SideState) {
  const pathname = usePathname()
  const { data: session, update } = useSession();

  const renderRoute = (route: NavRoute) => {
    return (
      <Link href={route.route} key={uuidv4()}>
        <li
          className={NavClass + " border-s hover:text-white " + ((!(pathname).search(route.route)) ? "" : "text-gray-500 border-none")}
        >
          {route.label}
        </li>
      </Link>
    )
  }

  const renderCategories = (header: NavCategories) => {
    return (
      <Disclosure defaultOpen={true} key={uuidv4()}>
        {({ open }) => (
          <>
            <Disclosure.Button className={NavClass}>
              <span>{header.label}</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm ">
              <ul>
                {(header.items).map(renderRoute)}
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }

  const renderButton = (header: NavButton) => {
    return (
      <button className={NavClass} onClick={header?.onClick} key={uuidv4()}>{header.label} </button>
    )
  }

  const renderSwitch = (i: NavSwitch) => {
    const state = (
      i.id == 'retail' ? session?.user.retail == undefined ? i.value as boolean : session.user.retail : i.value as boolean
    )

    const onChange = async (state: boolean) => {
      await update({
        ...session,
        user: {
          ...session?.user,
          retail: state
        }
      })
    }

    if (!session?.user?.retail == undefined) return <p></p>

    return (
      <label className={NavClass + `cursor-pointer label`}>
        <span className="label-text">{i.label}{state ? i.active : i.unactive}</span>
        <input type="checkbox" className="toggle toggle-primary" checked={state} onChange={(e) => onChange(e.target.checked)} />
      </label>
    )
  }

  return (
    <aside className={`h-full transition-all w-80 flex flex-col ${Sidebar ? null : "ms-[-20rem]"}`}>
      <Header />
      <section className='grow-1 flex-grow'>
        {
          headers.map(i => {
            if (i.type == "categories") return renderCategories(i);
            if (i.type == "button") return renderButton(i);
            if (i.type == "switch") return renderSwitch(i);
            if (i.type == "route") return renderRoute(i);

            return <>ERROR</>
          })
        }
      </section>
    </aside>
  );
}

export default Sidebar