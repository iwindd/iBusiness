"use client";

import { PrintTwoTone } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Receipter from "./receipter";
import { Order, OrderProduct } from "@prisma/client";
import React from "react";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { useReactToPrint } from 'react-to-print';

export type ReceipterProps = {
  products: OrderProduct[],
  history: Order | null
};

const ReceipterController = (props: ReceipterProps) => {
  const receipterRef = React.useRef(null);
  const { setBackdrop } = useInterface();
  const handlePrint = useReactToPrint({
    documentTitle: "ใบกำกับภาษีอย่างย่อ",
    onBeforePrint: () => setBackdrop(true),
    onAfterPrint: () => setBackdrop(false),
    removeAfterPrint: true,
  });

  const ReceiptExport = () => handlePrint(null, () => receipterRef.current);

  return (
    <>
      <Button startIcon={<PrintTwoTone />} variant="contained" onClick={ReceiptExport} >ใบเสร็จ</Button>

      <Box sx={{ display: 'none' }}><Receipter ref={receipterRef} {...props} /></Box>
    </>
  );
};

export default ReceipterController;
