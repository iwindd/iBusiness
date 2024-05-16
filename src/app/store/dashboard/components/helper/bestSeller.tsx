"use client";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BestSellerItem} from './action';
import { Typography } from '@mui/material';
import { StyledTableRow } from './activity';

const BestSellerTable = ({ data }: {
  data: BestSellerItem[]
}) => {
  return (
    <main>
      <Typography variant="caption">สินค้าขายดีประจำเดือน : </Typography>
      <TableContainer component={Paper} >
        <Table >
          <TableHead>
            <StyledTableRow>
              <TableCell>ชื่อสินค้า</TableCell>
              <TableCell>ยอดขาย(เดือน)</TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {
              (data)
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 5)
                .map((row) => (
                  <StyledTableRow
                    key={row.serial}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.sold} รายการ</TableCell>
                  </StyledTableRow>
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  )
}

export default BestSellerTable