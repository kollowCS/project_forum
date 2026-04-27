import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET /api/attractions/:id
export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = mysqlPool.promise();
  try {
    const[rows]=await promisePool.query(
      `SELECT avatar FROM account WHERE id=?`,
      [id]
    );
    if(rows.length===0||!rows[0].avatar){
      return new NextResponse(
        "Avatar not found",
        {status:404}
      );
    }

    const res = new NextResponse(
      Buffer.from(rows[0].avatar),
      {
        headers:{
          "Content-Type":"image/png"
        }
      }
    )
    console.log(res);
    return res;

  }catch(e){
    console.log(e);

    return new NextResponse(
      "Server error",
      {status:500}
    );
  }
}