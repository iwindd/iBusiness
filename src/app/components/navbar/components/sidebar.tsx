"use client";
import React from 'react'
import Header from './header';
import { useAtom } from 'jotai'
import { SidebarAtom } from '../store'
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Header {
  label: string,
  type: "categories" | "button",
  onClick?: () => void,
  items: {
    label: string,
    route: string
  }[]
}

const headers: Header[] = [
  {
    label: "ร้านค้า", type: "categories", items: [
      { label: 'ขายสินค้า', route: "/cashier" },
      { label: 'สินค้า', route: "/products" },
      { label: 'ประเภทสินค้า', route: "/categories" },
      { label: 'ประวัติการขาย', route: "/histories" }
    ]
  }
]

const NavClass = `flex w-full justify-between px-4 py-2 text-left text-sm font-medium outline-none hover:bg-base-200 transition-all `;

function Sidebar() {
  const [Sidebar] = useAtom(SidebarAtom)
  const pathname = usePathname()

  const renderCategories = (header: Header) => {
    return (
      <Disclosure defaultOpen={true} key={header.label}>
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
                {
                  header.items.map((i, index) => {
                    return (
                      <Link href={i.route}  key={index}> 
                        <li
                          className={NavClass + " border-s hover:text-white " + ((!(pathname).search(i.route)) ? "" : "text-gray-500 border-gray-500")}
                        >
                          {i.label}
                        </li>
                      </Link>
                    )
                  })
                }
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }

  const renderButton = (header: Header) => {
    return (
      <button className={NavClass} onClick={header?.onClick} key={header.label}>{header.label}</button>
    )
  }

  return (
    <aside className={`h-full transition-all w-80 flex flex-col ${Sidebar ? null : "ms-[-20rem]"}`}>
      <Header />
      <main className='grow-1 flex-grow'>
        {
          headers.map(i => {
            if (i.type == "categories") return renderCategories(i);
            if (i.type == "button") return renderButton(i);

            return <></>
          })
        }
      </main>
    </aside>
  );
}

export default Sidebar