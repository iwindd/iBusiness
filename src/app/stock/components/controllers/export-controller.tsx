"use client";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { DownloadTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useStock } from "../../providers/StockProvider";
import { useSnackbar } from 'notistack';
import FileSaver from "file-saver";

const ExportController = () => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const { items } = useStock();

  const onExport = async () => {
    setBackdrop(true);
    try {
      const content = items.reduce((cur, pv) => cur += `${pv.serial} ${pv.payload}\n`, "")
  
      const blob = new Blob([content], { type: 'text/plain' });
      FileSaver.saveAs(blob, "stock.txt");
      enqueueSnackbar("Export stock สำเร็จ!", { variant: "success" });

    } catch (error) {
      enqueueSnackbar("ไม่สามารถ export stock ได้", { variant: "error" });
      
    } finally{
      setBackdrop(false);
    }
  }

  return (
    <>
      <Button color="inherit" startIcon={<DownloadTwoTone />} onClick={onExport}>
        Export
      </Button>
    </>
  );
};

export default ExportController;


