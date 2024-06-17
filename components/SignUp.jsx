"use client";

import Link from "next/link"
import { useState } from "react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUp() {
  const [email, setEmail] = useState("")
  const [fullname, setFullname] = useState("")
  const [password, setPassword] = useState("")

  const clearForm = () => {
    setEmail("")
    setFullname("")
    setPassword("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = new URL(
        `/auth/register`,
        `http://${process.env.NEXT_PUBLIC_GENERAL_SERVICE_HOST}:${process.env.NEXT_PUBLIC_GENERAL_SERVICE_PORT}`
      )
      const response = await axios.post(url, {
        email,
        fullname,
        password,
      })
      const { data } = response?.data
      const { accessToken, refreshToken } = data

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      alert("User created")
      clearForm()
    } catch (error) {
      alert(error)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                id="fullname"
                placeholder="John Doe"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}

