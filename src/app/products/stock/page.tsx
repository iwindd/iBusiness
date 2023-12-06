"use client";
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';
import { ImportExport, Upload } from '@mui/icons-material'
import { Button, Typography, Box, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react'
import { commitStock, fetchingStock } from './action';
import Header from '@/app/components/header';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

export interface data {
  id: number,
  serial: string,
  title: string,
  stock: number,
  payload: number,
  all: number
}

const getFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new Error('Invalid file type. Expected a Blob.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const content = event.target.result as string;
        resolve(content);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

const Confirmation = (props: DialogProps<{
  onCommit: () => void
}>) => {

  const onConfirm = () => {
    props.onClose();
    props.data.onCommit();
  }

  return (
    <>
      <DialogTitle id="responsive-dialog-title">
        {"แจ้งเตือน"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          คุณต้องการจะจัดการสต๊อกหรือไม่ ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>ยกเลิก</Button>
        <Button onClick={onConfirm}>ยืนยัน</Button>
      </DialogActions>
    </>
  )
}

const Stock = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [data, setData] = React.useState<data[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { setBackdrop, setDialog } = useInterface();
  const router = useRouter();

  const confirmation = setDialog(Confirmation, {
    onCommit: async () => {
      setBackdrop(true);
      const resp = await commitStock(data);
      if (!resp.success) {
        setBackdrop(false);
        enqueueSnackbar("ไม่สามารถ commit ได้ในขณะนี้กรุณาลองอีกครั้งภายหลัง!", { variant: "error" });
        return
      }

      enqueueSnackbar("จัดการสต๊อกสินค้าสำเร็จแล้ว!", { variant: "success" });
      router.push("/products")
      setBackdrop(false);
    }
  })

  useEffect(() => {
    if (file) {
      const Render = async () => {
        const content = await getFileContent(file as File);

        try {
          setBackdrop(true);
          const lines = content.split(/\r?\n/);
          const resultArray: Record<string, number> = {};

          lines.forEach(line => {
            const [id, valueStr] = line.split(' ');
            const value = parseInt(valueStr);

            if (isNaN(value)) {
              throw new Error('Invalid value in the file.');
            }

            if (resultArray[id] !== undefined) {
              resultArray[id] += value;
            } else {
              resultArray[id] = value;
            }
          });

          const fetchingData = await fetchingStock(resultArray);
          if (fetchingData.success && fetchingData.data) {
            if (fetchingData?.data?.length > 0) {
              setData(fetchingData.data.map((product) => {
                return {
                  ...product,
                  payload: resultArray[product.serial],
                  all: product.stock + resultArray[product.serial]
                }
              }))
              enqueueSnackbar("เพิ่มข้อมูลสำเร็จ :)", { variant: "success" });
            } else {
              enqueueSnackbar("ไม่พบสินค้า!", { variant: "error" });
            }
          } else {
            throw new Error(fetchingData.error as string);
          }

          setBackdrop(false);
        } catch (error) {
          enqueueSnackbar("ไม่สามารถอ่านไฟล์ได้", { variant: "error" })
          setBackdrop(false);
          return;
        }
      }

      Render()
    }
  }, [file])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setData([]);
    setFile(null);

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt'))
        &&
        (selectedFile instanceof Blob)
      ) {
        setFile(selectedFile);
      } else {
        e.target.value = '';
        enqueueSnackbar("ไฟล์ไม่ถูกต้อง!", { variant: "error" })
      }
    }
  };

  const onUpdate = (newData: data, oldData: data) => {
    if (newData.all != oldData.all) {
      newData.payload = newData.payload + (newData.all - oldData.all)
      setData((prevData) => {
        const newData2 = [...prevData];

        const index = newData2.findIndex((data) => data.id === newData.id);
        newData2[index] = newData;

        return newData2;
      })
    }

    return newData
  }

  return (
    <div>
      <Header title='จัดการสต๊อก' className='flex justify-end space-x-2'>
        <input
          accept=".txt"
          style={{ display: 'none' }}
          id="payload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="payload">
          <Button
            variant="contained"
            component="span"
            startIcon={<ImportExport />}
          >
            Import
          </Button>
        </label>
        <label htmlFor="#">
          {
            data.length > 0 ? (
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={confirmation.onOpen}
                color="success"
              >
                Commit
              </Button>
            ) : (null)
          }
        </label>
      </Header>
      <Box sx={{ height: 750, width: '100%' }} className="mt-4">
        <DataGrid
          columns={
            [
              { field: "serial", flex: 1, sortable: true, headerName: "#" },
              { field: "title", flex: 1, sortable: true, headerName: "ชื่อสินค้า" },
              { field: "stock", flex: 1, sortable: true, headerName: "คงเหลือ", renderCell: ({ value }) => (value as number).toLocaleString() },
              {
                field: "payload", flex: 1, sortable: true, headerName: "เปลี่ยนแปลง", renderCell: ({ value }) => {
                  return (
                    <Typography variant="caption" color={value > 0 ? "green" : "red"} >
                      {value > 0 ? "+" : "-"} {Math.abs(value).toLocaleString()}
                    </Typography>
                  )
                }
              },
              { field: "all", flex: 1, sortable: true, editable: true, headerName: "รวม", renderCell: ({ value }) => (value as number).toLocaleString() }
            ]
          }
          density="compact"
          rows={data}
          processRowUpdate={onUpdate}
        />
      </Box>
    </div>
  )
}

export default Stock