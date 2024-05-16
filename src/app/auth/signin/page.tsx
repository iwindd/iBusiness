"use client";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { SignInInputs, SignInSchema } from "@/schema/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import RouterLink from "next/link";
import { paths } from "@/paths";

const SignIn = () => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<SignInInputs>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit: SubmitHandler<SignInInputs> = async (
    payload: SignInInputs
  ) => {
    setBackdrop(true);
    try {
      const resp = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (!resp?.error) {
        enqueueSnackbar("เข้าสู่ระบบสำเร็จแล้ว!", { variant: "success" });

        router.push(paths.overview);
        router.refresh();
      } else {
        setError(
          "email",
          {
            type: "string",
            message: "ไม่พบผู้ใช้งาน",
          },
          {
            shouldFocus: true,
          }
        );
      }
    } catch (error) {
      setError(
        "email",
        {
          type: "string",
          message: "ไม่พบผู้ใช้งาน",
        },
        {
          shouldFocus: true,
        }
      );
    } finally {
      setBackdrop(false);
      resetField("password");
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
          เข้าสู่ระบบ
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="อีเมล"
            autoComplete="email"
            autoFocus
            error={errors["email"]?.message != undefined ? true : false}
            helperText={errors["email"]?.message}
            {...register("email")}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="รหัสผ่าน"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errors["password"]?.message != undefined ? true : false}
            helperText={errors["password"]?.message}
            {...register("password")}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="จดจำฉันไว้"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            เข้าสู่ระบบ
          </Button>
          <Grid container>
            <Grid xs>
              <Link href="#" variant="body2">
                ลืมรหัสผ่าน?
              </Link>
            </Grid>
            <Grid>
              <Link
                href={paths.auth.signUp}
                component={RouterLink}
                variant="body2"
              >
                {"ฉันไม่มีบัญชี?"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
