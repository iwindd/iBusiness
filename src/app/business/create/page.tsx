import { Stack, Typography } from "@mui/material";
import React from "react";
import BusinessCreateCard from "./components/BusinessCreateCard";

const BusinessCreate = () => {
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
        <>

        </>
      </Stack>

      <BusinessCreateCard/>
    </Stack>
  );
};

export default BusinessCreate;
