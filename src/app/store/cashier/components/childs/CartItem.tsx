"use client";
import React from 'react'
import { TableCell, TableRow, IconButton, Stack, Box, TextField, Input } from '@mui/material';
import { Add, AddTwoTone, DeleteTwoTone, Remove, RemoveTwoTone } from '@mui/icons-material';
import { CartItem, CartState } from '@/app/store/atoms/cart';
import { useRecoilState } from 'recoil';
import { Confirmation, useConfirm } from '@/hooks/use-confirm';

export const Item = (props: CartItem) => {
  const [grow, setGrow] = React.useState<boolean>(false);
  const [, setCart] = useRecoilState(CartState);

  function limitNumberWithinRange(num : number, min : number, max : number){
    const MIN = min ?? 1;
    const MAX = max ?? 20;
    return Math.max(+num, MIN)
  }

  const countController = (delta : number) => {
    setCart(prevCart => {
      return prevCart.map(item => 
        item.serial === props.serial 
          ? { ...item, count: limitNumberWithinRange(item.count + delta, 1, 1000) } 
          : item
      );
    });
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCart(prevCart => {
      return prevCart.map(item => 
        item.serial === props.serial 
          ? { ...item, count: limitNumberWithinRange(+e.target.value, 1, 1000) } 
          : item
      );
    });
  }

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่ ?",
    onConfirm: async () => setCart(prev => prev.filter(i => i.serial != props.serial))
  });

  React.useEffect(() => {
    setGrow(true)
    setTimeout(() => {
      setGrow(false)
    }, 200)
  }, [props.count])

  const isOverstock = props.count > props.stock

  return (
    <TableRow
      sx={{ 
        'backgroundColor': (grow ? isOverstock ? 'var(--mui-palette-error-main)' : undefined : isOverstock ? "var(--mui-palette-error-light)" : ""),
        '&:last-child td, &:last-child th': { border: 0 } 
      }}
    >
      <TableCell component="th" scope="row" >
        {props.serial}
      </TableCell>
      <TableCell >{props.title}</TableCell>
      <TableCell >{props.category}</TableCell>
      <TableCell >{(props.price).toLocaleString()}</TableCell>
      <TableCell >{(props.price * props.count).toLocaleString()}</TableCell>
      <TableCell >
        <IconButton onClick={() => countController(-1)}><RemoveTwoTone/></IconButton>
        <Input disableUnderline sx={{width: '3em'}} inputProps={{min: 0, style: { textAlign: 'center' }}}  type='number' value={props.count} onChange={onChange}/>
        <IconButton onClick={() => countController(1)}><AddTwoTone /></IconButton>
      </TableCell>
      <TableCell>
          <IconButton onClick={confirmation.handleOpen}><DeleteTwoTone/></IconButton>
          <Confirmation {...confirmation.props} />
      </TableCell>
    </TableRow>
  )
}