"use client";
import { useInterface } from "@/app/providers/InterfaceProvider";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useSession } from "next-auth/react";
import { BusinessCreateChildForm } from "../page";

const BusinessLineNotification = ({register, errors} : BusinessCreateChildForm) => {
  return (
    <Card sx={{height: '100%'}}>
      <CardHeader title="การแจ้งเตือนไลน์" />
      <Divider />
      <CardContent>
        <TextField
          label="Line token : "
          fullWidth
          type="password"
          error={errors["line"]?.message != undefined ? true : false}
          helperText={errors["line"]?.message}
          {...register("line")}
        />
      </CardContent>
    </Card>
  );
};

export default BusinessLineNotification;
