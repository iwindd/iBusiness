import { Paper, Table, TableBody, TableCell, TableContainer, Typography } from '@mui/material';
import React, { useRef, useTransition } from 'react'
import { getLastCashierActivity } from '../action';
import { useQuery } from '@tanstack/react-query';
import { StyledTableRow } from '@/app/dashboard/components/helper/activity';
import { ParseActivity } from '@/libs/activityClient';
import { ActivityPayload } from '@/libs/activity';
import { Activity, Order, OrderProduct, Product } from '@prisma/client';
import Receipter from '@/app/histories/[id]/components/receipter';
import { useReactToPrint } from 'react-to-print';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { getHistory } from '@/app/histories/action';
import useServerAction from '@/hooks/useServerAction';
import { enqueueSnackbar } from 'notistack';

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paper className='px-2'>
      <Typography variant='caption'>กิจกรรมล่าสุด : </Typography>
      <main>
        {children}
      </main>
    </Paper>
  )
}

const Activity = () => {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const { setBackdrop } = useInterface();
  const receipterRef = useRef(null);
  const [history, setHistory] = React.useState<Order | null>(null);
  const [products, setProducts] = React.useState<OrderProduct[]>([]);
  const handlePrint = useReactToPrint({
    documentTitle: "ใบกำกับภาษีอย่างย่อ",
    onBeforePrint: () => setBackdrop(true),
    onAfterPrint: () => {
      setBackdrop(false);
      setHistory(null);
      setProducts([]);
    },
    removeAfterPrint: true,
  });
  const [runAction] = useServerAction(getHistory);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["CashierActivity"],
    queryFn: async () => {
      return await getLastCashierActivity();
    }
  })

  const WaitToExport = () => {
    if (receipterRef.current) {
      handlePrint(null, () => receipterRef.current);
    } else {
      setTimeout(WaitToExport, 1)
    }
  }

  const LoadReceipter = async (payload: Activity) => {
    setBackdrop(true);
    const id: number = Number(JSON.parse(payload.payload as any).id)
    const resp = await runAction(id);

    if (resp && resp.success && resp.data) {
      setHistory(resp.data)
      setProducts(resp.data.products)
      WaitToExport();
    } else {
      setBackdrop(false);
      enqueueSnackbar("มีบางอย่างผิดพลาด ไม่สามารถออกใบเสร็จได้!", { variant: 'error' })
    }
  }

  React.useEffect(() => {
    if (data?.data && data.success) {
      setActivities(data.data)
    }
  }, [setActivities, data])

  return (
    <Container>
      {
        history != null ? (
          <div className="hidden">
            <Receipter history={history} products={products} ref={receipterRef} />
          </div>
        ) : (null)
      }

      {isLoading || error ? "..." : (
        <TableContainer >
          <Table>
            <TableBody>
              {
                activities.map((payload) => {
                  return (
                    <StyledTableRow
                      className='cursor-pointer'
                      key={payload.id}
                      onClick={() => LoadReceipter(payload)}
                    >
                      <TableCell component="th" scope="row">
                        {ParseActivity({
                          category: payload.category,
                          type: payload.type,
                          data: JSON.parse(payload.payload as any)
                        } as ActivityPayload)}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant='caption'>ออกใบเสร็จ</Typography>
                      </TableCell>
                    </StyledTableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default Activity