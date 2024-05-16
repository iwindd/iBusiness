"use client";
import {
  AddTwoTone,
  CancelTwoTone,
  EditTwoTone,
  UpdateTwoTone,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
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

const BusinessCreateCard = () => {
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessInputs>({
    resolver: zodResolver(BusinessSchema),
  });

  const onSubmit = (payload: BusinessInputs) => {
    confirmation.with(payload);
    confirmation.handleOpen();
  };

  return (
    <>
      <Card>
        <CardHeader title="ธุรกิจใหม่" />
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid sm={12} md={6} lg={3}>
              <TextField
                type="text"
                label="ชื่อธุรกิจ"
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
                label="เบอร์ติดต่อ"
                error={errors["tel"]?.message != undefined ? true : false}
                helperText={errors["tel"]?.message}
                {...register("tel")}
                fullWidth
              />
            </Grid>
          </Grid>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              color="inherit"
              endIcon={<AddTwoTone />}
              size="small"
              variant="text"
              type="submit"
              onClick={() => setIsEdit(!isEdit)}
            >
              เพิ่มธุรกิจ
            </Button>
          </CardActions>
        </form>
      </Card>
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default BusinessCreateCard;
