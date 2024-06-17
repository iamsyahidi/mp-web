"use client";

import { Attendance } from "../../components/Attendance";
import { Login } from "../../components/Login";

export default function AttendancePage() {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? <Attendance /> : <Login />;
}
