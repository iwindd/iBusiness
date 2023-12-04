import React from 'react'
import { Divider, Typography } from '@mui/material';

const Header = (props: {
  title: string,
  children?: React.ReactNode,
  className?: string
}) => {
  return (
    <>
      <header className='mb-2 grid grid-cols-2'>
        <main>
          <Typography variant='h4'>{props.title}</Typography>
        </main>
        <article className={props.className}>
          {props.children}
        </article>
      </header>
      <Divider />
    </>
  )
}

export default Header