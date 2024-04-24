import NextAuth from "next-auth"

export interface CartItem {
  id: number,
  serial: string,
  title: string,
  price: number,
  count: number,
  stock: number,
  category: string
}

export interface Address{
  etc: string,
  district: string,
  provice: string,
  area: string,
  postalcode: string
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string,
      application: number,
      title: string,
      displaytitle: string,
      cart: CartItem[],
      addressOBJ: Address,
      account: {
        store: {
          linetoken: string
        }
      },
      time: string
    }
  }
}