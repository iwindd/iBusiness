import React from 'react'
import Link from 'next/link'

function Header() {
  return (
    <div className='navbar flex justify-center'>
      <Link href="/"><h1 className='text-center font-bold text-xl'>iStore</h1></Link>
    </div>
  )
}

export default Header