import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { writeFile } from 'fs/promises';
import path from 'path';

// GET /api/attractions/:id
export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = mysqlPool.promise();
  const [rows] = await promisePool.query(
    `
    SELECT comment.*, account.username, account.name, account.avatar
    FROM comment
    JOIN account ON comment.user_id = account.id
    WHERE comment.topic_id = ?
    `,
    [id]
  );
    rows.map((comment)=>{
        comment.avatar = `/api/avatar/${comment.user_id}`;
    })
  return NextResponse.json(rows);
}

export async function PUT(request, { params }) {
    const { id: commentId } = await params;
    const { msg } = await request.json();

    const promisePool = mysqlPool.promise();

    try {

        const [result] = await promisePool.query(
            "UPDATE comment SET message = ? WHERE id = ?",
            [msg, commentId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "Comment not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Comment updated"
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
  const { id: topic_id } = await params;
  const promisePool = mysqlPool.promise();
  const token = request.headers.get("Authorization");

  try {
    const body = await request.json();
    const { user_id, message } = body;

    const [authorized] = await promisePool.query(
      `SELECT * FROM account WHERE id = ? AND token = ?`,
       [user_id, token]
    );
    if (authorized.length === 0) {
      return NextResponse.json({ message: "User not authorized." }, { status: 401 });
    }

    const [exists] = await promisePool.query(
      `SELECT id FROM topic WHERE id = ?`,
       [topic_id]
    );
    if (exists.length === 0) {
      return NextResponse.json({ message: "Topic not found." }, { status: 404 });
    }

    const [result] = await promisePool.query(
      `INSERT INTO comment (topic_id, user_id, message)
       VALUES (?, ?, ?)`,
       [topic_id, user_id, message]
    );
  
    const [rows] = await promisePool.query(
      `SELECT * FROM comment WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    const { id: commentId } = await params

    const promisePool = mysqlPool.promise()

    try {
        const [result] = await promisePool.query(
            `DELETE FROM comment WHERE id = ?`,
            [commentId]
        )

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "Comment not found." },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: "Comment deleted"
        })

    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}