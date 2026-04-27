
import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { writeFile } from 'fs/promises';
import path from 'path';

// GET /api/attractions/:id
export async function GET(request, { params }) {
    const { id } = await params;
    const promisePool = mysqlPool.promise();
    
    const userId = request.headers.get("accountId") || 0;

    const [rows] = await promisePool.query(
        `SELECT t.*, account.username, account.name, account.avatar,
            (SELECT COUNT(*) FROM comment WHERE comment.topic_id = t.id) AS comments,
            (SELECT COUNT(*) FROM likes WHERE likes.topic_id = t.id) AS likes,
            (SELECT COUNT(*) FROM likes WHERE topic_id = t.id AND user_id = ?) AS liked
        FROM topic t 
        LEFT JOIN account ON t.owner_id = account.id
        WHERE t.id = ?
        `,
        [userId, id]
    );

    if (rows.length === 0) {
        return NextResponse.json(
        { message: `Topic with id ${id} not found` },
        { status: 404 }
        );
    }
  
    rows[0].liked = rows[0].liked > 0 ? true : false;
    console.log(rows)
     return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const { title, description } = await request.json();
    const promisePool = mysqlPool.promise();

    try {
        const [result] = await promisePool.query(
            "UPDATE topic SET title = ?, description = ? WHERE id = ?",
            [title, description, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Topic updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params; // This is the topic ID from the URL
    const promisePool = mysqlPool.promise();

    try {
        await promisePool.query(
            'DELETE FROM comment WHERE topic_id = ?',
            [id]
        );
        await promisePool.query(
            'DELETE FROM likes WHERE topic_id = ?',
            [id]
        );
        await promisePool.query(
            'DELETE FROM topic WHERE id = ?',
            [id]
        );
        return NextResponse.json({ message: `Deleted topic` });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}