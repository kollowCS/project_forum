import { mysqlPool } from "@/utils/db";

// Force dynamic rendering to prevent Vercel from caching broken responses
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = mysqlPool.promise();
  
  try {
    const [rows] = await promisePool.query(
      `SELECT avatar FROM account WHERE id=?`,
      [id]
    );

    if (rows.length === 0 || !rows[0].avatar) {
      return new Response("Avatar not found", { status: 404 });
    }

    // mysql2 returns BLOBs as Node.js Buffers. 
    // Convert to a raw ArrayBuffer which Vercel/Web API expects.
    const nodeBuffer = rows[0].avatar;
    const arrayBuffer = nodeBuffer.buffer.slice(
      nodeBuffer.byteOffset, 
      nodeBuffer.byteOffset + nodeBuffer.byteLength
    );

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": nodeBuffer.length.toString(),
        // Add a small cache for performance once it's working
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });

  } catch (e) {
    console.error("Database error:", e);
    return new Response("Server error", { status: 500 });
  }
}