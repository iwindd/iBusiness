import GuestProtected from "../protected/guest"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GuestProtected>
          {children}
        </GuestProtected>
      </body>
    </html>
  )
}
