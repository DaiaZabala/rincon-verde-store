import { sql } from "./db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "./db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(userId: number, email: string, role: string): Promise<string> {
  return new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: number; email: string; role: string }
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${email} AND role = 'admin'
      LIMIT 1
    `

    if (users.length === 0) return null

    const user = users[0] as User
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) return null

    return user
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload) return null

    const users = await sql`
      SELECT * FROM users 
      WHERE id = ${payload.userId} AND role = 'admin'
      LIMIT 1
    `

    return users.length > 0 ? (users[0] as User) : null
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
}
