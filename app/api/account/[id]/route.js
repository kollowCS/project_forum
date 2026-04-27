import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { writeFile } from 'fs/promises';
import path from 'path';

// GET /api/attractions/:id
export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = mysqlPool.promise();
  const [rows] = await promisePool.query(
    `SELECT * FROM account WHERE id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    return NextResponse.json(
      { message: `Account with id ${id} not found` },
      { status: 404 }
    );
  }
  rows[0].avatar=`/api/avatar/${id}`;
  return NextResponse.json(rows[0]);
}

//No. I didnt write this. Do not ask. I already spent 14 hours relearning JS and CSS.
//It's even a miracle that I even managed to get this project finished. 
//Sorry, I'm really in a good mood right now so my language can sounds a lil harsh.

//Thanks Google!
// PUT /api/account/:id  -> Update
export async function PUT(request,{params}){
  try{
    const{id}=await params;
    const token=request.headers.get("Authorization");

    const data=await request.formData();
    const name=data.get("name");
    const email=data.get("email");
    const password=data.get("password");
    const file=data.get("avatar");

    const promisePool=mysqlPool.promise();

    const[exists]=await promisePool.query(
      `SELECT id FROM account WHERE id=?`,
      [id]
    );

    if(exists.length===0){
      return NextResponse.json(
        {message:"Not found"},
        {status:404}
      );
    }

    const[accessible]=await promisePool.query(
      `SELECT id FROM account WHERE id=? AND token=?`,
      [id,token]
    );

    if(accessible.length===0){
      return NextResponse.json(
        {message:"Unauthorized edit"},
        {status:401}
      );
    }

    let avatar=null;

    if(file&&typeof file!=="string"){
      const bytes=await file.arrayBuffer();
      avatar=Buffer.from(bytes);
    }

    await promisePool.query(
      `UPDATE account SET name=?,email=?,password=?,avatar=? WHERE id=?`,
      [name,email,password,avatar,id]
    );

    const[rows]=await promisePool.query(
      `SELECT id,username,name,email FROM account WHERE id=?`,
      [id]
    );

    return NextResponse.json(rows[0]);

  }catch(e){
    console.log(e);

    return NextResponse.json(
      {error:e.message},
      {status:500}
    );
  }
}
// export async function PUT(request, { params }) {
//   try {
//     const { id } = await params;
//     const token = request.headers.get("Authorization");

//     const data = await request.formData();
//     const name = data.get("name");
//     const email = data.get("email");
//     const password = data.get("password");
//     const file = data.get("avatar");

//     const promisePool = mysqlPool.promise();

//     const [exists] = await promisePool.query(`SELECT id FROM account WHERE id = ?`, [id]);
//     if (exists.length === 0) {
//       return NextResponse.json({ message: "Not found" }, { status: 404 });
//     }

//     const [accessible] = await promisePool.query(
//       `SELECT id FROM account WHERE id = ? AND token = ?`, [id, token]
//     );
//     if (accessible.length === 0) {
//       return NextResponse.json({ message: "Unauthorized edit" }, { status: 401 });
//     }

//     let avatarPath = data.get("avatar"); 
//     if (file && typeof file !== "string") {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const fileName = `${Date.now()}-${file.name}`;
//       const filePath = path.join(process.cwd(), "public/uploads", fileName);
      
//       await writeFile(filePath, buffer);
//       avatarPath = `uploads/${fileName}`;
//     }
//     await promisePool.query(
//       `UPDATE account SET name = ?, email = ?, password = ?, avatar = ? WHERE id = ?`,
//       [name, email, password, avatarPath, id]
//     );

//     const [rows] = await promisePool.query(`SELECT * FROM account WHERE id = ?`, [id]);
//     return NextResponse.json(rows[0]);

//   } catch (e) {
//     console.log(e);
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// DELETE /api/account/:id  -> Delete
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const promisePool = mysqlPool.promise();

    const [exists] = await promisePool.query(
      `SELECT id FROM account WHERE id = ?`,
      [id]
    );
    if (exists.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await promisePool.query(`DELETE FROM account WHERE id = ?`, [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
