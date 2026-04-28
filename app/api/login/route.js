import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

function GetToken() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var attempt = 10
    while (attempt > 0) {
        attempt--;
        var candidate = ""
        for (let i=0;i<64;i++) {
            candidate += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return candidate
    }
    return null;
}

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        const promisePool = mysqlPool.promise();

        const [rows] = await promisePool.query(
            `SELECT * FROM account WHERE username = ? AND password = ?`,
            [username, password]
        );

        if (rows.length === 0) {
            return Response.json(
                { message: "Invalid Login" },
                { status: 401 }
            );
        }

        await promisePool.query(
            `UPDATE account SET token = ? WHERE id = ?`,
            [GetToken(), rows[0].id]
        );

        const [rows2] = await promisePool.query(
            `SELECT * FROM account WHERE username = ? AND password = ?`,
            [username, password]
        );

        return Response.json(rows2[0]);

    } catch (err) {
        console.error("LOGIN ERROR:", err);

        return Response.json(
            { error: String(err) },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    const promisePool = mysqlPool.promise();

    const token = request.headers.get("Authorization");
    const id = request.headers.get("AccountId");
    const [rows] = await promisePool.query(
        'SELECT * FROM account WHERE id = ? AND token = ?', 
        [id, token]
    )
    if (rows.length === 0) {
        return Response.json({ message: "Invalid login token" }, { status: 401 });
    }
    console.log("avatar:",rows[0].avatar)
    rows[0].avatar = "/api/avatar/"+rows[0].id
    return Response.json(rows[0]); 
}