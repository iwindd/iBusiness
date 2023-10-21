"use client";
import React from 'react'
import { signOut } from "next-auth/react"

function Page() {
  return (
    <div className="navbar shadow-md">
      <div >
        <a className="btn btn-ghost normal-case text-xl">iMall</a>
      </div>
      <div className="ms-auto px-4">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details className="w-28">
              <summary>
                Account
              </summary>
              <ul className="p-2 bg-base-100">
                <li><a>Account</a></li>
                <li><a onClick={() => signOut({
                  callbackUrl: "/"
                })}>Sign out</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Page