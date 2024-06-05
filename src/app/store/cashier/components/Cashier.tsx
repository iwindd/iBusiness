"use client";
import React from "react";
import { Button, Paper, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useRecoilState } from "recoil";
import { CartItem, CartState } from "../../atoms/cart";
import { getProduct } from "../../controllers/ProductController";
import { enqueueSnackbar } from "notistack";
interface CashierProp  {
  onPayment: () => void;
}

const Cashier = ({ onPayment }: CashierProp) => {
  const [serial, setSerial] = React.useState<string>("");
  const [, setCart] = useRecoilState(CartState);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { state, data: newItem } = await getProduct(serial);
      if (!state || !newItem) throw Error("");

      setCart((prev: CartItem[]) => {
        const item = prev.find((i) => i.serial === newItem.serial);
        enqueueSnackbar(`เพิ่มสินค้า <${item?.title}> เข้าตะกร้าแล้ว!`, {
          variant: "success",
        });
        if (item) {
          return prev.map((i) =>
            i.serial === newItem.serial ? { ...i, count: i.count + 1 } : i
          );
        } else {
          return [
            {
              ...newItem,
              count: 0,
            },
            ...prev,
          ];
        }
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("ไม่พบสินค้านี้ในระบบ", { variant: "error" });
    } finally {
      setSerial("");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSerial(e.target.value.replace(/[^\d]/g, ""));
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== " ") return;
    e.preventDefault();
    onPayment();
  };

  return (
    <Paper component={"form"} onSubmit={onSubmit} sx={{ boxShadow: "none" }}>
      <Grid container spacing={2}>
        <Grid lg={11}>
          <TextField
            value={serial}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="รหัสสินค้า"
            fullWidth
            autoFocus
          />
        </Grid>
        <Grid lg={1}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ height: "100%" }}
          >
            เพิ่ม
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Cashier;