"use client";
import { Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import BusinessCreateCard from "./components/BusinessCreateCard";
import BusinessAddressCard from "./components/BusinessAddressCard";
import BusinessTimeManager from "./components/BusinessTimeManager";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import BusinessLineNotification from "./components/BusinessLineNotification";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import { BusinessInputs, BusinessSchema } from "@/schema/BusinessSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { useSnackbar } from "notistack";
import { upsertBusiness } from "@/controllers/BusinessController";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";

export interface BusinessCreateChildForm {
  register: UseFormRegister<BusinessInputs>;
  setValue: UseFormSetValue<BusinessInputs>;
  errors: FieldErrors<BusinessInputs>;
}

const BusinessCreate = () => {
  const {setBackdrop} = useInterface();
  const {enqueueSnackbar} = useSnackbar();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BusinessInputs>({
    resolver: zodResolver(BusinessSchema),
  });

  const formChild = { register, errors, setValue };

  const onSubmit = async (payload : BusinessInputs) => {
    try {
      setBackdrop(true);
      const resp = await upsertBusiness(payload);

      if (resp.state) {
        enqueueSnackbar("เพิ่มธุรกิจสำเร็จ!", {
          variant: "success",
        });
        router.push(paths.business);
      }else{
        throw Error();
      }
    } catch (error) {
      enqueueSnackbar("มีบางอย่างผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง!", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">ธุรกิจใหม่</Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          ></Stack>
        </Stack>
        <></>
      </Stack>

      <BusinessCreateCard {...formChild} />
      <Grid container spacing={3}>
        <Grid lg={6} md={12}>
          <BusinessTimeManager {...formChild}/>
        </Grid>
        <Grid lg={6} md={12}>
          <BusinessLineNotification {...formChild} />
        </Grid>
      </Grid>
      <BusinessAddressCard {...formChild} />
      <Card component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="เครื่องมือ" />
        <Divider/>
        <CardContent >
          <Stack alignItems={"end"}>
            <Button variant="contained" type="submit" color="primary">เพิ่มธุรกิจ</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default BusinessCreate;
