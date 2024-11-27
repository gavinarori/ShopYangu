"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function LoginForm() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const userLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { ...data, redirect: false }).then((submitted) => {
      if (submitted?.error) {
        toast({
          title: "Error",
          description: submitted.error,
        });
      }

      if (submitted?.ok && !submitted?.error) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      }
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={userLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, email: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("google")}
            >
              Login with Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
