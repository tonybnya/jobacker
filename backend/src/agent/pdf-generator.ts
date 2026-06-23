import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePdfBuffer(text: string): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const margin = 56;
  const maxWidth = width - margin * 2;
  const lines = text.split("\n");
  let y = height - margin;

  for (const line of lines) {
    if (y < margin) {
      const newPage = doc.addPage([612, 792]);
      y = newPage.getSize().height - margin;
    }

    const isSectionHeader = /^[A-Z\s]+$/.test(line.trim()) && line.trim().length > 0;
    const fontSize = isSectionHeader ? 11 : 9;
    const fontToUse = isSectionHeader ? font : font;

    const lineHeight = fontSize * 1.4;
    if (line.trim() === "") {
      y -= fontSize * 0.6;
      continue;
    }

    const words = line.split(" ");
    let x = margin;
    for (const word of words) {
      const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);
      if (x + wordWidth > margin + maxWidth) {
        y -= lineHeight;
        x = margin;
      }
      page.drawText(word + " ", {
        x,
        y,
        size: fontSize,
        font: fontToUse,
        color: rgb(0, 0, 0),
      });
      x += wordWidth;
    }
    y -= lineHeight;
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
