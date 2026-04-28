import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import fs from "fs/promises";

export async function GET(request) {
    const promisePool = mysqlPool.promise();
    const [rows, fields] = await promisePool.query(
        'SELECT id, username, name, email FROM account'
    )
    // rows[0].avatar = rows[0].id; //HACKY SOLUTION TO MY ALREADY MESSED UP CODE
    rows[0].avatar=`/api/avatar/${id}`;
    return NextResponse.json(rows);
}

// POST /api/account  -> Create
export async function POST(request) {
  try {
    const body = await request.json();
    const promisePool = mysqlPool.promise();
    // return NextResponse.json(body);
    const { username, name, email, password } = body;

    const [existing] = await promisePool.query(
        `SELECT id FROM account WHERE username = ?`,
        [username]
    )

    console.log(username,existing)
    if (existing.length > 0) {
        return NextResponse.json(
            { error: "Username already exists" },
            { status: 409 }
        )
    }

    const [emailExisting] = await promisePool.query(
        `SELECT id FROM account WHERE email = ?`,
        [email]
    )

    if (emailExisting.length > 0) {
        return NextResponse.json(
            { error: "This email has already been used" },
            { status: 409 }
        )
    }
    
    let avatar=await fs.readFile("./public/uploads/fox.png"); //DEFAULT IMAGE HERE
    
    const [result] = await promisePool.query(
      `INSERT INTO account (username, name, email, password, avatar)
       VALUES (?, ?, ?, ?, ?)`,
       [username, name, email, password, avatar]
    )
    
    const [rows] = await promisePool.query(
      `SELECT * FROM account WHERE id = ?`,
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