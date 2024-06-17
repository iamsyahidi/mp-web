"use client";

import Link from "next/link"
import { useState } from "react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";


export function Login() {
    const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const clearForm = () => {
    setEmail("")
    setPassword("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = new URL(
        `/auth/login`,
        `http://${process.env.NEXT_PUBLIC_GENERAL_SERVICE_HOST}:${process.env.NEXT_PUBLIC_GENERAL_SERVICE_PORT}`
      )
      const response = await axios.post(url, {
        email,
        password,
      })
      const { data } = response?.data
      const { accessToken, refreshToken } = data

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      alert("Logged in successfully")
      clearForm()
      router.push('/attendance')
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
      </div>
    </div>
  )
}

