import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const promisePool = mysqlPool.promise();
    const page = ((searchParams.get("page") || 1)-1);

    const filter = (searchParams.get("search")||'');
    const searchVal = `%${filter}%`; 

    console.log(searchVal);
    const limit = 5;
    console.log("PAGE:",page);
    try {
        //Thanks Google.
        const [rows, fields] = await promisePool.query(
        `
            SELECT topic.* , account.username, account.name, account.avatar,
                (SELECT COUNT(*) FROM comment WHERE comment.topic_id = topic.id) AS comments,
                (SELECT COUNT(*) FROM likes WHERE likes.topic_id = topic.id) AS likes
            FROM topic
            LEFT JOIN account ON topic.owner_id = account.id
            WHERE topic.title LIKE ? OR topic.description LIKE ?
            ORDER BY topic.id DESC 
            LIMIT ? OFFSET ?
        `, [searchVal,searchVal,limit,page * limit])  // PAGENATION (ex. 0 * LIM + LIM, 1 * LIM + LIM, ... Offset)
        rows.map((topic)=>{
            topic.avatar =`/api/avatar/${topic.owner_id}`;
        })
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/forum  -> Create
export async function POST(request) {
  try {
    const body = await request.json();
    // return NextResponse.json(body);
    const { owner_id, title, description } = body;
    
    const promisePool = mysqlPool.promise();
    const [result] = await promisePool.query(
      `INSERT INTO topic (owner_id, title, description)
       VALUES (?, ?, ?)`,
       [owner_id, title, description]
    )
    
    const [rows] = await promisePool.query(
      `SELECT * FROM topic WHERE id = ?`,
      [result.insertId]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}