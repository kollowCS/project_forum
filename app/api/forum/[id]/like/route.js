import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { writeFile } from 'fs/promises';
import path from 'path';

// GET /api/attractions/:id
export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = mysqlPool.promise();
  const [rows] = await promisePool.query(
    `SELECT COUNT(*) FROM likes WHERE id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    return NextResponse.json(
      { message: `Topic with id ${id} not found` },
      { status: 404 }
    );
  }
  return NextResponse.json(rows[0]);
}

export async function POST(request, { params }) {
    const { id } = await params; // topic_id
    const { user_id } = await request.json();
    const promisePool = mysqlPool.promise();

    const [existing] = await promisePool.query(
        "SELECT * FROM likes WHERE topic_id = ? AND user_id = ?",
        [id, user_id]
    );

    if (existing.length > 0) {
        await promisePool.query(
            "DELETE FROM likes WHERE topic_id = ? AND user_id = ?",
            [id, user_id]
        );
        return NextResponse.json({ message: "Unliked" });
    } else {
        await promisePool.query(
            "INSERT INTO likes (topic_id, user_id) VALUES (?, ?)",
            [id, user_id]
        );
        return NextResponse.json({ message: "Liked" });
    }
}