"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-40 pb-20">
      <div className="max-w-md w-full px-8">
        <h1 className="font-outfit font-semibold text-[#1e4e79] text-4xl text-center mb-8">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-outfit font-medium text-[#1e4e79] mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] font-outfit"
              required
            />
          </div>

          <div>
            <label className="block font-outfit font-medium text-[#1e4e79] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] font-outfit"
              required
            />
          </div>

          <div>
            <label className="block font-outfit font-medium text-[#1e4e79] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] font-outfit"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-[#4fa3e3] to-[#6fb3e6] font-outfit font-medium text-white"
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center font-outfit text-[#1e4e79]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#4fa3e3] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
