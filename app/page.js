import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="text-balance text-muted-foreground">
        Please login to continue
      </p>
      <Link href="/login">
        <Button className="w-full">Login</Button>
      </Link>
    </main>
  );
}
