import React from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../action';
import { Inputs } from './schema';
interface DataRow extends Inputs {
  id: number,
  title: string,
  createdAt: any,
  products: { id: number }[]
}

const columns: TableColumn<DataRow>[] = [
  { id: "id", name: "#", hide: 1, sortField: "id", selector: row => row.id, sortable: true, format: (data) => data.id },
  { name: "ประเภทสินค้า", sortField: "title", selector: row => row.title, sortable: true, format: (data) => data.title },
  { name: "จำนวนสินค้า", selector: row => row.title, sortable: false, format: (data) => (data.products.length).toLocaleString() },
  {
    name: 'วันที่เพิ่ม', sortField: "createdAt", selector: row => row.createdAt, sortable: true, format: (data) =>
      new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(data.createdAt))
  }
];

const CategoryTable = (props: {
  search: string,
  onManage: (id: number, payload: Inputs) => void
}) => {
  const [perPage, setPerPage] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const [sort, setSort] = React.useState<[string | null, "asc" | "desc"]>([null, "desc"]);
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await getCategories(currentPage, perPage, props.search, sort);
    }
  })

  React.useEffect(() => {
    setTotalRows(data?.total || 0)
  }, [data])

  React.useEffect(() => {
    refetch()
  }, [perPage, currentPage, props.search, sort])

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
            onRowClicked={(data) => props.onManage(data.id, data)}
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

export default CategoryTable  
