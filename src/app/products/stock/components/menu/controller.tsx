import React from 'react'
import { useInterface } from '@/app/providers/InterfaceProvider';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import AddItemDialog from './components/addDialog';
import { SelectizeGetProductData } from './action';
import { useStock } from '../../providers/StockProvider';

const Controller = () => {
  const { setDialog, setBackdrop } = useInterface();
  const { setItem } = useStock();

  const AddDialog = setDialog(AddItemDialog, {
    onAdd: async (serial: string, changedBy: number) => {
      if (!serial || serial == "") return;
      setBackdrop(true);
      const resp = await SelectizeGetProductData(serial);
      if (resp.success && resp.data && resp.data)  {
        setItem(prevItems => {
          const payload = {
            id: resp.data?.id as number,
            serial: resp.data?.serial as string,
            title: resp.data?.title as string,
            stock: resp.data?.stock as number,
            payload: changedBy || 0,
            all: (resp.data?.stock as number) + changedBy || 0
          }

          return [...prevItems, payload]
        })
        setBackdrop(false);
      }
    }
  }, "xs");

  return (
    <section className='flex justify-end' >
      <Button startIcon={<Add />} onClick={AddDialog.onOpen}>
        Add
      </Button>
    </section>
  )
}

export default Controller