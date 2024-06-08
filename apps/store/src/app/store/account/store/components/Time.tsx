"use client";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import React, { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useInterface } from "@/app/providers/InterfaceProvider";
import { saveTime } from "../action";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { TimePicker } from "@mui/x-date-pickers";
import { SaveTwoTone } from "@mui/icons-material";
import { useConfirm } from "@/hooks/use-confirm";
import { ConfirmationDialog } from "@/components/core/dialog/confirmation";

type dayName =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
export interface Day {
  id: number;
  name: dayName;
  label: string;
  state: boolean;
  time: any;
}

const Time = () => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const { data: session, update } = useSession();
  const [time, setTime] = React.useState<any>([
    dayjs("2006-06-17T00:00"),
    dayjs("2006-06-17T23:59"),
  ]);
  const [dayMode, setDaymode] = React.useState<string>("1");
  const [timeMode, setTimemode] = React.useState<string>("1");
  const [check, setCheck] = React.useState<boolean>(false);
  const [days, setDays] = React.useState<Day[]>([
    {
      id: 1,
      name: "sunday",
      label: "วันอาทิตย์",
      state: true,
      time: [dayjs("2006-06-17T06:00"), dayjs("2006-06-17T18:00")],
    },
    {
      id: 2,
      name: "monday",
      label: "วันจันทร์",
      state: true,
      time: [dayjs("2006-06-17T06:00"), dayjs("2006-06-17T18:00")],
    },
    {
      id: 3,
      name: "tuesday",
      label: "วันอังคาร",
      state: true,
      time: [dayjs("2006-06-17T06:00"), dayjs("2006-06-17T18:00")],
    },
    {
      id: 4,
      name: "wednesday",
      label: "วันพุธ",
      state: true,
      time: [dayjs("2006-06-17T06:00"), dayjs("2006-06-17T18:00")],
    },
    {
      id: 5,
      name: "thursday",
      label: "วันพฤหัสบดี",
      state: true,
      time: [dayjs("2006-06-17T06:00"), dayjs("2006-06-17T18:00")],
    },
    {
      id: 6,
      name: "friday",
      label: "วันศุกร์",
      state: true,
      time: [dayjs("2006-06-17T06:00"), dayjs("2006-06-17T18:00")],
    },
    {
      id: 7,
      name: "saturday",
      label: "วันเสาร์",
      state: true,
      time: [dayjs("2006-06-17T06:00"), dayjs("2006-06-17T18:00")],
    },
  ]);

  const confirmDialog = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะบันทึกการตั้งค่าหรือไม่ การตั้งค่าเก่าๆ ของคุณจะหายไปไม่สามารถกู้ได้",
    onConfirm: async () => {
      setBackdrop(true);
      const resp = await saveTime(days, dayMode, timeMode, check);
      setBackdrop(false);

      if (resp.success) {
        update({
          ...session,
          user: {
            ...session?.user,
            time: resp?.infomation,
          },
        });

        return enqueueSnackbar("แก้ไขเวลาสำเร็จ!", { variant: "success" });
      }

      enqueueSnackbar("ไม่สามารถทำรายการได้ กรุณาลองอีกครั้งภายหลัง!", {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (session?.user.time) {
      const data = JSON.parse(session.user.time as any) as {
        days: { name: dayName; state: boolean; time: [string, string] }[];
        mode: [string, string];
        check: boolean;
      };

      if (data) {
        setCheck(data.check);
        setDaymode(data.mode[0]);
        setTimemode(data.mode[1]);
        setDays((days) => {
          return days.map((d) => {
            const info = data.days.find((t) => t.name == d.name);
            if (!info) return d;
            const time = info.time as [string, string];
            const parseTime: any = [dayjs(time[0]), dayjs(time[1])];
            setTime(parseTime);

            return {
              ...d,
              ...{ state: info.state as boolean, time: parseTime },
            };
          });
        });
      }
    }
  }, [session]);

  const onSave = () => confirmDialog.handleOpen();

  const toggleDay = (id: number) => {
    setDays((days) =>
      days.map((day) => {
        if (day.id === id) {
          return { ...day, state: !day.state };
        }
        return day;
      })
    );
  };

  const handleTimeChange = (id: number, val: any) => {
    setDays((days) =>
      days.map((day) => {
        if (day.id === id) {
          return { ...day, time: val };
        }
        return day;
      })
    );
  };

  const handleAllTimeChange = (val: any) => {
    setTime(val);
    setDays((days) =>
      days.map((day) => {
        return { ...day, time: val };
      })
    );
  };

  return (
    <>
      <Card>
        <CardHeader title="เวลาทำการ" />
        <Divider />
        <CardContent>
          <FormControl sx={{ m: 1 }} fullWidth>
            <InputLabel>วันเปิด</InputLabel>
            <Select
              input={<OutlinedInput label="Name" />}
              value={dayMode}
              onChange={(e) => setDaymode(e.target.value)}
            >
              <MenuItem value="1">ทุกวัน</MenuItem>
              <MenuItem value="2">กำหนดเอง</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1 }} fullWidth>
            <InputLabel>เวลา</InputLabel>
            <Select
              input={
                <OutlinedInput
                  label="Name"
                  value={timeMode}
                  onChange={(e) => setTimemode(e.target.value)}
                />
              }
            >
              <MenuItem value="1">ตลอดเวลา</MenuItem>
              <MenuItem value="2">กำหนดเอง</MenuItem>
            </Select>
          </FormControl>
          {timeMode == "2" ? (
            <FormControl sx={{ m: 1 }} fullWidth>
              <TimePicker
                value={time}
                onChange={handleAllTimeChange}
                disabled={!(!check || (timeMode == "2" && dayMode == "1"))}
                ampm={false}
              />
            </FormControl>
          ) : null}
          {timeMode == "2" && dayMode == "2" ? (
            <FormControl sx={{ m: 1 }} fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    value={check}
                    defaultChecked={check}
                    onChange={(e) => setCheck(e.target.checked)}
                  />
                }
                label="หลายเวลา"
              />
            </FormControl>
          ) : null}
          {dayMode == "2" ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>สถานะ</TableCell>
                  <TableCell align="center">วัน</TableCell>
                  <TableCell align="right">{check ? "เวลา" : null}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {days.map((day, index) => (
                  <TableRow key={day.id + index + day.label}>
                    <TableCell
                      onClick={() => toggleDay(day.id)}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color={day.state ? "default" : "error"}
                      >
                        {day.state ? "เปิด" : "ปิด"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{day.label}</TableCell>
                    <TableCell align="right">
                      <TimePicker
                        slotProps={{ textField: { variant: "standard" } }}
                        value={!check ? time : day.time}
                        onChange={(newValue: any) =>
                          handleTimeChange(day.id, newValue)
                        }
                        disabled={!check || !day.state}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            onClick={onSave}
            startIcon={<SaveTwoTone />}
            color="secondary"
          >
            บันทึก
          </Button>
        </CardActions>
      </Card>
      <ConfirmationDialog {...confirmDialog.props}/>
    </>
  );
};

export default Time;
