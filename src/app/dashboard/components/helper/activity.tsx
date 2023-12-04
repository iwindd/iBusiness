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

const ActivityTable = ({ activities }: {
  activities: Activity[]
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {activities.map((payload) => (
            <TableRow
              key={payload.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {ParseActivity({
                  category: payload.category,
                  type: payload.type,
                  data: JSON.parse(payload.payload as any)
                } as ActivityPayload)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ActivityTable