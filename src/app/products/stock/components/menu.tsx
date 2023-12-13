import React from 'react'
import File from './menu/file'
import Commit from './menu/commit'
import Controller from './menu/controller'

const Menu = () => {
  return (
    <section className='space-x-2 grid grid-cols-2 col-span-2 '>
      <section className='flex'>
        <File />
        <Commit />
      </section>
      <section className='flex justify-end'>
        <Controller />
      </section>
    </section>
  )
}

export default Menu