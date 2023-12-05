import React from 'react'
import { TextField } from '@mui/material';
import { CashierPageChildType } from '../page';
import Payment from './childs/Payment';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { useSession } from 'next-auth/react';

const CashierInput = ({ addProductToCart }: CashierPageChildType) => {
  const [serial, setSerial] = React.useState<string>("");
  const { data: session, update } = useSession();

  const onSubmit = async () => {
    if (serial.length <= 0) return;

    addProductToCart(serial);
    setSerial("");
  };

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
      <TextField
        label="รหัสสินค้า"
        value={serial}
        onChange={e => setSerial(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        autoFocus
      />
    </form>
  )
}

export default CashierInput