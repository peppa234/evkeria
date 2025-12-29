import Image from "next/image"
import { LoginForm } from "./LoginOrgForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2744] via-[#1a3a5c] to-[#0d2137] relative">
      

      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32 md:pt-40 pb-8 sm:pb-12 lg:pb-16">
        {/* Main Content Card */}
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
          {/* Header Text */}
          <div className="text-center mb-8 sm:mb-12 font-outfit">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e3a5f] mb-3 sm:mb-4">
              Are You an Organizer?
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Sign in or create an account to publish and manage your opportunities.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Left Side - Image */}
            <div className="flex-1 flex justify-center lg:justify-start w-full">
              <div className="relative w-full max-w-md lg:max-w-lg rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/loginOrgPhoto.png"
                  alt="Conference panel discussion"
                  width={500}
                  height={600}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}