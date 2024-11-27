import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename =
      file.name.replace(/\.[^/.]+$/, '') +
      '-' +
      uniqueSuffix +
      path.extname(file.name);

    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ path: `/uploads/${filename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}
