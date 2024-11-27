import { writeFile } from 'fs/promises'
import path from 'path'

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + path.extname(file.name)

  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(filepath, buffer)


  return `/uploads/${filename}`
}

