'use client'
import React from 'react'
import SignIn from './auth/signin';
import SignUp from './auth/signup';

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