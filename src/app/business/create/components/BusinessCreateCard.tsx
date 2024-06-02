"use client";
import { AddTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { useSnackbar } from "notistack";
import { BusinessInputs, BusinessSchema } from "@/schema/BusinessSchema";
import { upsertBusiness } from "@/controllers/BusinessController";
import { paths } from "@/paths";
import { useRouter } from "next/navigation";
import { BusinessCreateChildForm } from "../page";

const BusinessCreateCard = ({ register, errors }: BusinessCreateChildForm) => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: `คุณต้องการจะสร้างธุรกิจใหม่หรือไม่`,
    onConfirm: async (data: BusinessInputs) => {
      try {
        setBackdrop(true);
        const resp = await upsertBusiness(data);

        if (resp.state) {
          enqueueSnackbar("เพิ่มธุรกิจสำเร็จ", { variant: "success" });
          router.push(paths.business);
        } else {
          throw Error();
        }
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง!", {
          variant: "error",
        });
      } finally {
        setBackdrop(false);
      }
    },
  });

  const onSubmit = (payload: BusinessInputs) => {
    confirmation.with(payload);
    confirmation.handleOpen();
  };

  return (
    <>
      <Card>
        <CardHeader title="รายละเอียด" />
        <Divider />
        <Grid container spacing={3} sx={{ p: 3 }}>
          <Grid sm={12} md={6} lg={3}>
            <TextField
              type="text"
              label="ชื่อธุรกิจ (เต็ม)"
              autoFocus
              error={errors["title"]?.message != undefined ? true : false}
              helperText={errors["title"]?.message}
              {...register("title")}
              fullWidth
            />
          </Grid>
          <Grid sm={12} md={6} lg={3}>
            <TextField
              type="text"
              label="ชื่อธุรกิจ (ย่อ)"
              autoFocus
              error={errors["short"]?.message != undefined ? true : false}
              helperText={errors["short"]?.message}
              {...register("short")}
              fullWidth
            />
          </Grid>
          <Grid sm={12} md={6} lg={3}>
            <TextField
              type="text"
              label="เบอร์ติดต่อ"
              error={errors["tel"]?.message != undefined ? true : false}
              helperText={errors["tel"]?.message}
              {...register("tel")}
              fullWidth
            />
          </Grid>
          <Grid sm={12} md={6} lg={3}>
            <FormControl fullWidth>
              <InputLabel>ธุรกิจ</InputLabel>
              <Select label="ธุรกิจ" value={1}>
                <MenuItem value={1}>ระบบจัดการร้านค้า</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default BusinessCreateCard;
