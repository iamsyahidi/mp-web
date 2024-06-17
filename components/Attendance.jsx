"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarPlusIcon, CalendarMinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Attendance() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [message, setMessage] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalWorkDuration, setTotalWorkDuration] = useState(0);

  const handleCheckin = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const checkInTime = new Date().toISOString();
    const url = new URL(
      `/attendances`,
      `http://${process.env.NEXT_PUBLIC_GENERAL_SERVICE_HOST}:${process.env.NEXT_PUBLIC_GENERAL_SERVICE_PORT}`
    );
    try {
      const response = await axios.post(
        url,
        {
          checkInTime,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data, status, message } = response?.data;
      if (status) {
        localStorage.setItem("recentAttendanceId", data.id);
        setMessage("Check-in successful");
      } else {
        setMessage("Check-in failed, " + message);
      }
    } catch (error) {
      setMessage("Check-in failed, " + error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
        return;
      }
    }
  };

  const handleCheckout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const recentAttendanceId = localStorage.getItem("recentAttendanceId");
    const checkOutTime = new Date().toISOString();
    const url = new URL(
      `/attendances/${recentAttendanceId}`,
      `http://${process.env.NEXT_PUBLIC_GENERAL_SERVICE_HOST}:${process.env.NEXT_PUBLIC_GENERAL_SERVICE_PORT}`
    );
    try {
      const response = await axios.put(
        url,
        {
          checkOutTime,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { data, status, message } = response?.data;
      if (status) {
        setMessage("Check-out successful");
      } else {
        setMessage("Check-out failed, " + message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        }
        return;
      }

      setMessage("Check-out failed, " + error?.response?.data?.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  setInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString());
  }, 1000);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const url = new URL(
        `/attendances/reports`,
        `http://${process.env.NEXT_PUBLIC_GENERAL_SERVICE_HOST}:${process.env.NEXT_PUBLIC_GENERAL_SERVICE_PORT}`
      );
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { status, message, data } = response?.data;
        if (status) {
          setAttendanceData(data?.list);
          setTotalWorkDuration(data?.totalWorkDuration);
        } else {
          setMessage("Failed to fetch attendance data, " + message);
        }
      } catch (error) {
        setMessage("Failed to fetch attendance data, " + error);
        if (error.response && error.response.status === 401) {
          router.push("/login");
          return;
        }
      }
    };

    fetchAttendanceData();
  }, [router]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Attendance</CardTitle>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <Label level="2" className="mt-2">
          Current Time: {currentTime}
        </Label>
        {message && (
          <Label level="2" className="mt-2">
            {message}
          </Label>
        )}
      </CardHeader>
      <CardContent>
        {/* <div className="flex justify-between"> */}
          <Button
            variant="outline"
            startIcon={<CalendarPlusIcon />}
            onClick={handleCheckin}
          >
            Check-in
          </Button>
          <Button
            variant="outline"
            startIcon={<CalendarMinusIcon />}
            onClick={handleCheckout}
            className="mt-4"
          >
            Check-out
          </Button>
        {/* </div> */}
        <Table>
          <TableCaption>A list of your current month attendance</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Work Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData?.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>{attendance.checkInTime}</TableCell>
                <TableCell>{attendance.checkOutTime}</TableCell>
                <TableCell>{attendance.status}</TableCell>
                <TableCell className="text-right">
                  {attendance.workDuration}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Work Duration</TableCell>
              <TableCell className="text-right">{totalWorkDuration}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

