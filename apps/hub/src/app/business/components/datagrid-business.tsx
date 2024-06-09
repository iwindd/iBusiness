import Datatable from "@/components/datatable";
import { Business } from "@prisma/client";
import * as ff from "@/libs/formatter";
import React from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { getBusiness, loginBusiness } from "@/controllers/BusinessController";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { useSnackbar } from "notistack";

const DatagridBusiness = () => {
  const { data, update } = useSession();
  const router = useRouter();
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();

  const businessControl = React.useCallback(
    (business: Business) => async () => {
      setBackdrop(true);
      try {

        const resp = await loginBusiness(business.id);
        
        if (resp.state){
          window.location.href = `${resp.redirect}`;
        }
      } catch (error) {
        enqueueSnackbar("ไม่สามารถจัดการร้านค้าได้", { variant: "error" });
      } finally {
        setBackdrop(false);
      }
    },
    []
  );

  const columns = [
    { field: "title", sortable: false, headerName: "ชื่อธุรกิจ", flex: 1 },
    {
      field: "tel",
      sortable: true,
      headerName: "เบอร์ติดต่อ",
      flex: 1,
      type: "number",
      valueFormatter: (data: any) => ff.number(data.value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "เครื่องมือ",
      flex: 1,
      getActions: ({ row }: { row: Business }) => [
        <GridActionsCellItem
          key="manage"
          icon={<ViewAgendaTwoTone />}
          label="จัดการร้านค้า"
          onClick={businessControl(row)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <>
      <Datatable
        name={"business"}
        columns={columns}
        fetch={getBusiness}
        height={700}
      />
    </>
  );
};

export default DatagridBusiness;
