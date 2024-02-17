import React from 'react'
import { Button, Paper, TextField } from '@mui/material';
import { CashierPageChildType } from '../page';
import Payment from './childs/Payment';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { useSession } from 'next-auth/react';
import ProductField from '../../components/productfield/index';
import { Option } from '@/app/components/productfield/selectize';
import { PaymentOutlined } from '@mui/icons-material';

const CashierInput = ({ addProductToCart }: CashierPageChildType) => {
  const [serial, setSerial] = React.useState<string>("");
  const { data: session, update } = useSession();

  const onSubmit = async () => {
    if (serial.length <= 0) return;

    addProductToCart(serial);
    setSerial("");
  };

  const onSelected = async (product: Option) => {
    if (product.value.length <= 0) return;

    addProductToCart(product.value);
  }

  const { setDialog } = useInterface();
  const PaymentDialog = setDialog(Payment, {
    session: session,
    clear: () => update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== ' ') return;
    e.preventDefault();
    PaymentDialog.onOpen();
  };


  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}>
      <Paper className='border-none grid grid-cols-11 gap-1'>
        <div className='col-span-10'>
          <ProductField onKeyDown={handleKeyDown} onSelected={onSelected} addProductToCart={addProductToCart} />
        </div>
        <div className='w-full h-full'>
          <Button variant="outlined" fullWidth onClick={PaymentDialog.onOpen} className='h-full' color='success' type='submit' endIcon={< PaymentOutlined />} >คิดเงิน</Button>
        </div>
      </Paper>
    </form>
  )
}

export default CashierInput