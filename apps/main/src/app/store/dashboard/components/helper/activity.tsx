"use client";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Activity } from '@prisma/client';
import { ActivityPayload } from '@/libs/activity';
import { ParseActivity } from '@/libs/activityClient';
import { Typography, styled } from '@mui/material';

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.default,
    borderTop: "0px",
    borderBottom: "0px",
  }
}));

const ActivityTable = ({ activities }: {
  activities: Activity[]
}) => {
  return (
    <main>
      <Typography variant="caption">กิจกรรมล่าสุด : </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {activities.map((payload) => (
              <StyledTableRow
                key={payload.id}
              >
                <TableCell component="th" scope="row">
                  {ParseActivity({
                    category: payload.category,
                    type: payload.type,
                    data: JSON.parse(payload.payload as any)
                  } as ActivityPayload)}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  )
}

export default ActivityTable