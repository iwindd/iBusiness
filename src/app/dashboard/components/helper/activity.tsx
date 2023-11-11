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
import { getActivities } from './action';
import { Activity } from '@prisma/client';
import { ActivityPayload } from '@/libs/activity';
import { ParseActivity } from '@/libs/activityClient';

const ActivityTable = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ['Activities'],
    queryFn: async () => {
      return await getActivities()
    }
  })

  if (isLoading) return <p>loading...</p>
  if (error) return <p>error</p>
  if (!data || !data.data) return <p>no data</p>

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {(data.data as Activity[]).map((payload) => (
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