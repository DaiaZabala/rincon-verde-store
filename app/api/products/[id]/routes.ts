import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const product = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}
