import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: "File type not supported. Please upload an image." }, { status: 400 });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(process.cwd(), 'public/uploads', file.name);
  
  await writeFile(filePath, buffer);
  return NextResponse.json({ success: true, url: `/uploads/${file.name}` });
}