"use client";
import React from 'react'
import Header from './header';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SideState } from '..';
import { v4 as uuidv4 } from 'uuid';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
interface Header {
  id?: string,
  label: string,
  type: "categories" | "button" | "switch",
  onClick?: () => void,
  value?: any,
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
  },
  {
    id: "retail",
    label: "ประเภท : ",
    type: "switch",
    value: true,
    items: [
      { label: "ขายปลีก", route: "" },
      { label: "ขายส่ง", route: "" }
    ],
  }
]

const NavClass = `flex w-full justify-between px-4 py-2 text-left text-sm font-medium outline-none hover:bg-base-200 transition-all `;

function Sidebar({ SideState: Sidebar }: SideState) {
  const pathname = usePathname()
  const { data: session, update } = useSession();

  const renderCategories = (header: Header) => {
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
                {
                  (header?.items).map((i, index) => {
                    return (
                      <Link href={i.route} key={index}>
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
      <button className={NavClass} onClick={header?.onClick} key={uuidv4()}>{header.label} </button>
    )
  }

  const renderSwitch = (i: Header) => {
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
        <span className="label-text">{i.label}{i.items[state ? 0 : 1].label}</span>
        <input type="checkbox" className="toggle toggle-primary" checked={state} onChange={(e) => onChange(e.target.checked)} />
      </label>
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
            if (i.type == "switch") return renderSwitch(i);

            return <></>
          })
        }
      </main>
    </aside>
  );
}

export default Sidebar