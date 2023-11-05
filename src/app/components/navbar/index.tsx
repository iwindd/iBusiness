"use client";
import React, { ReactNode } from 'react';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';

export interface SideState {
  SideState: boolean,
  setSideState: React.Dispatch<React.SetStateAction<boolean>>
}

function Layout({ children }: { children: ReactNode }) {
  const [SideState, setSideState] = React.useState<boolean>(true);

  const props: SideState = {
    SideState: SideState,
    setSideState: setSideState
  }

  return (
    <div className='flex h-full'>
      <Sidebar {...props} />
      <div className="flex flex-col w-full">
        <Navbar {...props} />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
