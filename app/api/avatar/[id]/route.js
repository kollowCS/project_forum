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
    
    const avatarBuffer = rows[0].avatar;

    // Use Uint8Array to ensure Web Response compatibility
    const imageData = new Uint8Array(avatarBuffer);

    return new NextResponse(imageData, {
    headers: {
        "Content-Type": "image/png",
        "Content-Length": imageData.length.toString(),
    },
    });

  }catch(e){
    console.log(e);

    return new NextResponse(
      "Server error",
      {status:500}
    );
  }
}