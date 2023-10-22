"use client";
import React from 'react'
import Header from './header';
import { useAtom } from 'jotai'
import { SidebarAtom } from '../store'

function Sidebar() {
  const [Sidebar] = useAtom(SidebarAtom)

  return (
    <aside className={`h-full transition-all w-80 flex flex-col ${Sidebar ? null : "ms-[-20rem]"}`}>
      <Header />
      <main className=' grow-1 flex-grow'>MAIN</main>
    </aside>
  );
}

export default Sidebar