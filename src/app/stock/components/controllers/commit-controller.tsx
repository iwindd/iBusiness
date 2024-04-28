"use client";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { SaveTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useStock } from "../../providers/StockProvider";
import { useSnackbar } from 'notistack';
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { CommitStock } from "@/controllers/StockController";

const CommitController = () => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const { items, setItem } = useStock();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะจัดการสต๊อกหรือไม่ ?",
    onConfirm: async () => {
      setBackdrop(true);
      try {
        const resp = await CommitStock(items);

        if (resp.state) {
          enqueueSnackbar("จัดการสต๊อกสินค้าสำเร็จแล้ว!", { variant: "success" });
          setItem([]);
        } else {
          enqueueSnackbar("ไม่สามารถทำรายการได้ กรุณาลองอีกครั้งภายหลัง!", { variant: 'error' })
        }
      } catch (error) {
        enqueueSnackbar("ไม่สามารถทำรายการได้ กรุณาลองอีกครั้งภายหลัง!", { variant: 'error' })
      } finally {
        setBackdrop(false);
      }
    }
  });


  return (
    <>
      <Button color="inherit" startIcon={<SaveTwoTone />} onClick={confirmation.handleOpen}>
        Commit
      </Button>

      <Confirmation {...confirmation.props} />
    </>
  );
};

export default CommitController;


