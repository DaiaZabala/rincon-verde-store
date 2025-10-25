// En el archivo: src/lib/auth.ts

import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Define un tipo básico para el usuario que se recupera de la DB
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  password_hash: string;
  is_active: boolean;
};

// Secreto JWT: DEBE ser una variable de entorno segura en producción
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// ─── HASH PASSWORD ───────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ─── VERIFY PASSWORD ─────────────────────────────
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ─── JWT UTILITIES ───────────────────────────────

export async function createToken(userId: number, email: string, role: string): Promise<string> {
  return new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: number; email: string; role: string };
  } catch {
    return null;
  }
}

// ─── AUTHENTICATION LOGIC ─────────────────────────

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const users = await sql<User>`
      SELECT * FROM users
      WHERE email = ${email} AND role = 'admin'
      LIMIT 1
    `;

    if (users.rows.length === 0) return null;

    const user = users.rows[0];

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) return null;

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

// ─── COOKIE & USER RETRIEVAL ─────────────────────

/**
 * Recupera la información completa del usuario autenticado a partir de la cookie de sesión.
 * @returns Un objeto con la información del usuario o null si no está autenticado.
 */
export async function getCurrentUser() {
  // 🔑 CORRECCIÓN: Se llama a cookies() sin await.
  const cookieStore = cookies(); 
  const token = (await cookieStore).get("auth-token");

  if (!token?.value) return null;

  try {
    const payload = await verifyToken(token.value);
    if (!payload?.userId) return null;

    const result = await sql<Pick<User, 'id' | 'name' | 'email' | 'role'>>`
      SELECT id, name, email, role
      FROM users
      WHERE id = ${payload.userId} AND role = 'admin' AND is_active = true
      LIMIT 1
    `;

    const user = result.rows[0];
    if (!user) return null;

    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Recupera solo el ID del usuario autenticado para verificaciones rápidas de autorización.
 * @returns El ID del usuario o null si no está autenticado.
 */
export async function getUserId(): Promise<number | null> {
  const user = await getCurrentUser();
  return user ? user.id : null;
}


// ─── COOKIE MANAGEMENT ───────────────────────────

export async function setAuthCookie(token: string) {
  // 🔑 CORRECCIÓN: Se llama a cookies() sin await.
  const cookieStore = cookies(); 
  (await cookieStore).set("auth-token", token, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  });
}

export async function clearAuthCookie() {
  // CORRECCIÓN: El error 2339 se corrige llamando a cookies() sin 'await'.
  // La función cookies() en Next.js ya es síncrona en este contexto.
  const cookieStore = cookies(); 
  
  // Ahora .delete() funciona correctamente en el objeto cookieStore.
  (await
    // Ahora .delete() funciona correctamente en el objeto cookieStore.
    cookieStore).delete("auth-token"); 
}