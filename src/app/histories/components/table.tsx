import React from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';
import { useQuery } from '@tanstack/react-query';
import { getHistories } from '../action';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
interface DataRow {
  id: number,
  price: number,
  cost: number,
  profit: number,
  type: number,
  note: string,
  createdAt: any,
  productsText: string
}

const columns: TableColumn<DataRow>[] = [
  {
    name: 'วันทำรายการ', sortField: "createdAt", selector: row => row.createdAt, sortable: true, format: (data) =>
      new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(data.createdAt))
  },
  { name: 'ราคา', sortField: "price", selector: row => row.price, sortable: true, format: (data) => data.price.toLocaleString() + " ฿" },
  { name: 'ต้นทุน', sortField: "cost", selector: row => row.cost, sortable: true, format: (data) => data.cost.toLocaleString() + " ฿" },
  { name: 'กำไร', sortField: "profit", selector: row => row.profit, sortable: true, format: (data) => data.profit.toLocaleString() + " ฿" },
  {
    name: 'สินค้า', selector: row => row.productsText, sortable: false, format: (data) => {
      const MoreItem = data.productsText.length >= 20;

      return MoreItem ? data.productsText.substring(0, 20) + '...' : data.productsText
    }
  },
  { name: 'หมายเหตุ', sortField: "note", selector: row => row.note, sortable: true, format: (data) => data.note.toLocaleString() || "-" },
];

const HistoryTable = (props: {
  search: string
}) => {
  const [perPage, setPerPage] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const [sort, setSort] = React.useState<[string | null, "asc" | "desc"]>([null, "desc"]);
  const {data: session} = useSession();
  const params = useSearchParams()
  const scope = params.get("scope");
  const router = useRouter();
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ["histories"],
    queryFn: async () => {
      return await getHistories(currentPage, perPage, props.search, sort, scope as "today" | "week" | "month" | null);
    }
  })

  React.useEffect(() => {
    setTotalRows(data?.total || 0)
  }, [data])

  React.useEffect(() => {
    refetch()
  }, [perPage, currentPage, props.search, sort, session?.user.retail])

  if (error) {
    return <p>ERROR</p>
  }

  return (
    <>
      {!isLoading ? (
        <>
          <DataTable
            columns={columns}
            data={data ? (data.success ? data.data as DataRow[] : []) : []}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationComponentOptions={{
              selectAllRowsItem: true,
              selectAllRowsItemText: 'ALL',
            }}
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            sortServer
            onSort={(data, style) => {
              setSort([data.sortField as string, style])
            }}
            onChangeRowsPerPage={setPerPage}
            onChangePage={setCurrentPage}
            onRowClicked={(data) => router.push(`/histories/${data.id}`)}
          />
        </>
      ) : (
        <div className='flex justify-center'>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )
      }
    </>
  )
}

export default HistoryTable
