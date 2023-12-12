import React from 'react'
import File from './menu/file'
import Commit from './menu/commit'

const Menu = () => {
  return (
    <section className='space-x-2 flex'>
      <File />
      <Commit />
    </section>
  )
}

export default Menu