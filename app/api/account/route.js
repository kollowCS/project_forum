import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

async function GetToken() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var attempt = 10
    while (!token || attempt == 0) {
        attempt--;
        var candidate = ""
        for (let i=0;i<64;i++) {
            candidate += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const [result] = await promisePool.query(
            'SELECT id FROM account WHERE token = '+candidate
        )
        if (result.length == 0) {
            return candidate
        }
    }
}

export async function GET(request) {
    const promisePool = mysqlPool.promise();
    const [rows, fields] = await promisePool.query(
        'SELECT id, username, name, email FROM account'
    )
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
    
    const [result] = await promisePool.query(
      `INSERT INTO account (username, name, email, password, avatar)
       VALUES (?, ?, ?, ?, ?)`,
       [username, name, email, password, "uploads/fox.png"]
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