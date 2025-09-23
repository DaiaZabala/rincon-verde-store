import { sql } from "./db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "./db"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

// ─── HASH PASSWORD ───────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// ─── VERIFY PASSWORD ─────────────────────────────
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// ─── CREATE JWT TOKEN ───────────────────────────
export async function createToken(userId: number, email: string, role: string): Promise<string> {
  return new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

// ─── VERIFY JWT TOKEN ───────────────────────────
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: number; email: string; role: string }
  } catch {
    return null
  }
}

// ─── AUTHENTICATE USER ─────────────────────────
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users
      WHERE email = ${email} AND role = 'admin'
      LIMIT 1
    `

    if (users.length === 0) return null

    const user = users[0] as User

    // ⚠️ Usamos password_hash, no password
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) return null

    return user
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

// ─── GET CURRENT USER FROM COOKIE ─────────────
export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token?.value) return null

  try {
    const payload = await verifyToken(token.value)
    if (!payload?.userId) return null

    const result = await sql`
      SELECT id, name, email, role
      FROM users
      WHERE id = ${payload.userId} AND role = 'admin' AND is_active = true
      LIMIT 1
    `

    const user = result[0]
    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// ─── SET AUTH COOKIE ───────────────────────────
export async function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })
}

// ─── CLEAR AUTH COOKIE ─────────────────────────
export async function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
}
