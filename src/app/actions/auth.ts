"use server"
import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) return { error: "Email already exists" }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { name, email, password: hashedPassword } })

  return { success: true }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", { email, password, redirect: false })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" }
    }
    throw error
  }
}
