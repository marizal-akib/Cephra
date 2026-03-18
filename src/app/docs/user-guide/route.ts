import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "docs", "cephra_user_guide.docx");
  const fileBuffer = await readFile(filePath);

  return new Response(fileBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="cephra_user_guide.docx"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
