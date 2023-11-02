"use client"
import React from 'react'
import { useAtom } from 'jotai'
import { SidebarAtom } from '../store'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { signOut } from 'next-auth/react'
import { classNames } from '@/libs/utils'

const SidebarController = () => {
  const [Sidebar, setSidebar] = useAtom(SidebarAtom)

  return (
    <aside className='h-full'>
      <button
        className='w-12 h-12 rounded-full'
        onClick={() => setSidebar(!Sidebar)}
      >
        {Sidebar ? "<" : ">"}
      </button>
    </aside>
  )
}

function Navbar() {
  return (
    <nav className='navbar w-full flex justify-between'>
      {/* <SidebarController /> */}
      <main className='h-full flex-grow justify-end'>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold ">
              Account
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Account
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      onClick={() => signOut()}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block w-full px-4 py-2 text-left text-sm'
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </main>
    </nav>
  )
}

export default Navbar