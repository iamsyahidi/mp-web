"use client";

import React, { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarPlusIcon, CalendarMinusIcon } from "lucide-react"
import { useRouter } from "next/navigation";


export function Attendance() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [message, setMessage] = useState("")

  const handleCheckin = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const checkInTime = new Date().toISOString()
    const url = new URL(
        `/attendances`,
        `http://${process.env.NEXT_PUBLIC_GENERAL_SERVICE_HOST}:${process.env.NEXT_PUBLIC_GENERAL_SERVICE_PORT}`
      ) 
    try {
      const response = await axios.post(
        url,
        {
          checkInTime
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      
      const { data,status, message } = response?.data
      if (status) {
        localStorage.setItem("recentAttendanceId", data.id)
        setMessage("Check-in successful")
      }else {
        setMessage("Check-in failed, " + message)
      }

    } catch (error) {
      setMessage("Check-in failed, " + error)
      if(error.response && error.response.status === 401){
        router.push('/login');
        return;
      }
    }
  }

  const handleCheckout = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const recentAttendanceId = localStorage.getItem("recentAttendanceId")
    const checkOutTime = new Date().toISOString()
    const url = new URL(
        `/attendances/${recentAttendanceId}`,
        `http://${process.env.NEXT_PUBLIC_GENERAL_SERVICE_HOST}:${process.env.NEXT_PUBLIC_GENERAL_SERVICE_PORT}`
      ) 
    try {
      const response = await axios.put(
        url,
        {
            checkOutTime,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      
      const { data,status, message } = response?.data
      if (status) {
        setMessage("Check-out successful")
      }else {
        setMessage("Check-out failed, " + message)
      }

    } catch (error) {
      if(error.response ){
        if  (error.response.status === 401){
        router.push('/login');
        }
        return;
      }

      setMessage("Check-out failed, " + error?.response?.data?.message)
    }
  }

  setInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString())
  }, 1000)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <Label level="2" className="mt-2">
          Current Time: {currentTime}
        </Label>
        {message && <Label level="2" className="mt-2">{message}</Label>}
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

