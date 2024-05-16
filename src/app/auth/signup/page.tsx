"use client";
import { paths } from "@/paths";
import { LockTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import RouterLink from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpInputs, SignUpSchema } from "@/schema/UserSchema";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { Signup } from "@/controllers/UserController";

const SignupPage = () => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpInputs> = async (
    payload: SignUpInputs
  ) => {
    setBackdrop(true);
    try {
      const resp = await Signup(payload);

      if (resp.state) {
        enqueueSnackbar("ลงทะเบียนสำเร็จ!", { variant: "success" });
        return router.push(paths.auth.signIn);
      }

      enqueueSnackbar(
        "ไม่สามารถลงทะเบียนได้ในขณะนี้กรุณาลองใหม่อีกครั้งในภายหลัง!",
        { variant: "error" }
      );
    } catch (error) {
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockTwoTone />
        </Avatar>
        <Typography component="h1" variant="h5">
          ลงทะเบียน
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="firstName"
                label="ชื่อจริง"
                autoFocus
                {...register("firstname")}
                error={errors["firstname"]?.message != undefined ? true : false}
                helperText={errors["firstname"]?.message}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="นามสกุล"
                autoComplete="family-name"
                {...register("lastname")}
                error={errors["lastname"]?.message != undefined ? true : false}
                helperText={errors["lastname"]?.message}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="อีเมล"
                autoComplete="email"
                {...register("email")}
                error={errors["email"]?.message != undefined ? true : false}
                helperText={errors["email"]?.message}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                label="รหัสผ่าน"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
                error={errors["password"]?.message != undefined ? true : false}
                helperText={errors["password"]?.message}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                label="ยืนยันรหัสผ่าน"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password_confirmation")}
                error={
                  errors["password_confirmation"]?.message != undefined
                    ? true
                    : false
                }
                helperText={errors["password_confirmation"]?.message}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ลงทะเบียน
          </Button>
          <Grid container>
            <Grid>
              <Link
                href={paths.auth.signIn}
                component={RouterLink}
                variant="body2"
              >
                {"ฉันมีบัญชีอยู่แล้ว?"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
