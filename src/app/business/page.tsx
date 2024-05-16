"use client";
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

const MainPage = () => {
  const { data } = useSession();

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">ธุรกิจของฉัน</Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          ></Stack>
        </Stack>
        <></>
      </Stack>
      
    </Stack>
  );
};

export default MainPage;
