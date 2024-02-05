import React, { useEffect } from 'react'
import { Product } from '@prisma/client';
import { Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AddToCashier, getFavoriteItems } from '../action';
import { CashierPageChildType } from '../page';

const FavoritePage = ({addProductToCart} : CashierPageChildType) => {
  const [items, setItems] = React.useState<Product[]>([]);

  const {data, refetch} = useQuery({
    queryKey: ["favProducts"],
    queryFn: async () => {
      return await getFavoriteItems()
    }
  })

  useEffect(() => {
    if (data?.data) {
      setItems(data.data)
    }
  }, [data, setItems])

  const onAddItem = async (serial : string) => {
    addProductToCart(serial)
  }

  return (
    <section className='w-full p-2 my-2 space-x-1 space-y-1 ' >
      {
        items.map((p : Product) => {
          return (
            <Chip key={p.serial} label={p.title} onClick={() => onAddItem(p.serial)} />
          )
        })
      }
    </section>
  )
}

export default FavoritePage