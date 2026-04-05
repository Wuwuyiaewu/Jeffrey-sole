import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM resumes ORDER BY id");
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, title, description } = body as { name?: string; title?: string; description?: string };
  if (!name || !title || !description) {
    return NextResponse.json({ error: "name, title and description are required" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO resumes (name, title, description) VALUES ($1, $2, $3) RETURNING *",
      [name, title, description],
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  } finally {
    client.release();
  }
}
