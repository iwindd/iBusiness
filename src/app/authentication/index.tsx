'use client'
import React from 'react'
import SignIn from './components/signin';
import SignUp from './components/signup';

export type AuthPage = "signin" | "signup";
function Authentication() {
  const [page, setPage] = React.useState<AuthPage>("signin");

  return (
    page == "signin" ? (
      <SignIn setPage={setPage} />
    ) : (
      <SignUp setPage={setPage} />
    )
  )
}

export default Authentication