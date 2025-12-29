"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@components/ui/button"
import Link from "next/link"

export function SignUpForm() {
  const [organizationName, setOrganizationName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [description, setDescription] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    organizationName?: string
    email?: string
    password?: string
    confirmPassword?: string
    description?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      organizationName?: string
      email?: string
      password?: string
      confirmPassword?: string
      description?: string
    } = {}

    if (!organizationName) {
      newErrors.organizationName = "Organization name is required"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!description) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log("Sign up attempted with:", {
      organizationName,
      email,
      password,
      description,
    })
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 font-outfit">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-2">
          Organization Sign Up
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">Join Evkeria today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="organizationName"
            className="block text-gray-700 text-sm font-medium"
          >
            Organization Name
          </label>
          <input
            id="organizationName"
            type="text"
            placeholder="Enter your organization name"
            value={organizationName}
            onChange={(e) => {
              setOrganizationName(e.target.value)
              if (errors.organizationName)
                setErrors({ ...errors, organizationName: undefined })
            }}
            className={`w-full h-11 sm:h-12 px-3 sm:px-4 border rounded-lg outline-none transition-colors focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] text-sm sm:text-base ${
              errors.organizationName ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.organizationName && (
            <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            className={`w-full h-11 sm:h-12 px-3 sm:px-4 border rounded-lg outline-none transition-colors focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] text-sm sm:text-base ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: undefined })
              }}
              className={`w-full h-11 sm:h-12 px-3 sm:px-4 pr-10 sm:pr-12 border rounded-lg outline-none transition-colors focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] text-sm sm:text-base ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-medium"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined })
              }}
              className={`w-full h-11 sm:h-12 px-3 sm:px-4 pr-10 sm:pr-12 border rounded-lg outline-none transition-colors focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] text-sm sm:text-base ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Describe your organization"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description)
                setErrors({ ...errors, description: undefined })
            }}
            rows={3}
            className={`w-full px-3 sm:px-4 py-3 border rounded-lg outline-none transition-colors focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] text-sm sm:text-base resize-none ${
              errors.description ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#1e3a5f] hover:bg-[#162d4d] text-white font-medium rounded-lg transition-colors mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-500">Already have an account? </span>
          <Link
            href="login"
            className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  )
}