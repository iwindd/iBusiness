import React from 'react'
import File from './menu/file'
import Commit from './menu/commit'
import Controller from './menu/controller'

const Menu = () => {
  return (
    <section className='space-x-2 grid md:grid-cols-2 sm:grid-cols-1'>
      <section className='flex'>
        <File />
        <Commit />
      </section>
      <section className='flex md:justify-end sm:justify-start'>
        <Controller />
      </section>
    </section>
  )
}

export default Menu