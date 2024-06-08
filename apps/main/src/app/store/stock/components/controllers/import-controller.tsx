"use client";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { UploadTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useStock } from "../../providers/StockProvider";
import { useSnackbar } from 'notistack';
import { getFileContent } from "@/libs/utils";

const ImportController = () => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const { setItem, render } = useStock();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onImport = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem([]);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt'))
        &&
        (selectedFile instanceof Blob)
      ) {
        e.target.value = '';
        e.target.files = null;
        const content = await getFileContent(selectedFile);
        setBackdrop(true);
        try {
          await render(content)
        } catch (error) {
          enqueueSnackbar("ไม่สามารถอ่านไฟล์ได้", { variant: "error" })
        } finally {
          setBackdrop(false);
        }
      } else {
        e.target.value = '';
        e.target.files = null;
        enqueueSnackbar("ไฟล์ไม่ถูกต้อง!", { variant: "error" })
      }
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        hidden
        accept=".txt"
      />

      <Button color="inherit" startIcon={<UploadTwoTone />} onClick={onImport}>
        Import
      </Button>
    </>
  );
};

export default ImportController;
