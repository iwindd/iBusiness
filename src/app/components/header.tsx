import React from 'react'
import { Divider, Typography } from '@mui/material';
import { classNames } from '../../libs/utils';

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
    </>
  )
}

export const HeaderRoot = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <header className={` grid md:grid-cols-2 sm:grid-cols-1 selection:` + className}>
      {children}
    </header>
  )
}

export default HeaderCompact