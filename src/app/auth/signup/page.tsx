import Image from "next/image"

import { Navbar } from "@components/Navbar/Navbar"
import { SignUpForm } from "./SignupForm"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2744] via-[#1a3a5c] to-[#0d2137] relative">
      

      <main className="container mx-auto px-4 pt-32 pb-12 lg:pt-40 lg:pb-16">
        {/* Glassmorphic Card Container */}
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Side - Image */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <Image
                  src="/user_photo.png"
                  alt="user photo"
                  width={500}
                  height={600}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <SignUpForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
