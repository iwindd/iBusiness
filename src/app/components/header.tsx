import React from 'react'
import { Divider, Typography } from '@mui/material';

interface Header {
  children?: React.ReactNode,
  className?: string
}

interface HeaderCustom extends Header{
  header: React.ReactNode
}

interface HeaderCompact extends Header{
  title: string,
}

export const Header = (props : HeaderCustom) => {
  return (
    <>
      <HeaderRoot>
        <main>
          {props.header}
        </main>
        <article className={props.className}>
          {props.children}
        </article>
      </HeaderRoot>
      <Divider />
    </>
  )
}

const HeaderCompact = (props: HeaderCompact) => {
  return (
    <>
      <HeaderRoot>
        <main>
          <Typography variant='h4'>{props.title}</Typography>
        </main>
        <article className={props.className}>
          {props.children}
        </article>
      </HeaderRoot>
      <Divider />
    </>
  )
}

export const HeaderRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className='mb-2 grid grid-cols-2'>
      {children}
    </header>
  )
}

export default HeaderCompact