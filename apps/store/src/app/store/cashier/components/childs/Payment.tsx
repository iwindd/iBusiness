/* "use client";
import React from "react";
import { PaymentAction } from "../../action";
import {
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
  TextField,
  InputAdornment,
  ButtonGroup,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Session } from "next-auth";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { useRouter } from "next/navigation";

const Payment = () => {
  const cart = props.data.session?.user.cart || [];
  const [Input, setInput] = React.useState<number>();
  const [type, setType] = React.useState<0 | 1>(0);
  const [note, setNote] = React.useState<string>("");
  const [check, setCheck] = React.useState<boolean>(false);
  const ref: any = React.useRef();
  const { setBackdrop } = useInterface();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBackdrop(true);
    props.onClose();
    const resp = await PaymentAction({ type, note });
    setBackdrop(false);
    if (!resp?.success) props.onOpen();
    if (resp?.data && check) {
      router.push(`/histories/${resp.data.id}?receipter=1`);
    }
    props.data.clear();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: onSubmit,
      }}
    >
      <DialogTitle>ชำระเงิน</DialogTitle>
      <DialogContent className=" space-y-2">
        <label className="flex">
          <span>ราคารวม :</span>
          <span className="ms-auto">
            {cart
              .reduce((total, item) => total + item.price * item.count, 0)
              .toLocaleString()}{" "}
            ฿
          </span>
        </label>
        <TextField
          autoFocus
          fullWidth
          label="คำนวณเงินทอน"
          ref={ref}
          type="number"
          value={Input}
          onChange={(e) => setInput(Number(e.target.value))}
          InputProps={{
            startAdornment: <InputAdornment position="start">฿</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                {(
                  (Input || 0) -
                  cart.reduce(
                    (total, item) => total + item.price * item.count,
                    0
                  )
                ).toLocaleString()}{" "}
                ฿
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="หมายเหตุ"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
        />
        <ButtonGroup fullWidth>
          <Button
            variant={type == 0 ? "contained" : "outlined"}
            color="success"
            onClick={() => setType(0)}
          >
            เงินสด
          </Button>
          <Button
            variant={type == 1 ? "contained" : "outlined"}
            color="success"
            onClick={() => setType(1)}
          >
            ธนาคาร
          </Button>
        </ButtonGroup>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                value={check}
                onChange={(e) => setCheck(e.target.checked)}
              />
            }
            label="ออกใบเสร็จ"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose}>
          ยกเลิก
        </Button>
        <Button type="submit">ตกลง</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Payment;
 */