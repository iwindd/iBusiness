"use client";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { BestSellerItem, getBestSeller } from './action';

const BestSellerTable = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["Best Sellers"],
    queryFn: async () => {
      return await getBestSeller()
    }
  })
  if (isLoading) return <p>loading...</p>
  if (error) return <p>ERROR</p>
  if (!data || !data.data) return <p>NO DATA</p>

  return (
    <>
      <TableContainer component={Paper} >
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>ชื่อสินค้า</TableCell>
              <TableCell>ยอดขาย(เดือน)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              (data.data as BestSellerItem[])
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 5)
                .map((row) => (
                  <TableRow
                    key={row.serial}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.sold}</TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default BestSellerTable