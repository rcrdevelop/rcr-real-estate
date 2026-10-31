import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Contract, Property } from "./estate";
import { buildContractText } from "./estate";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const LINE_H = 15;

/** Genera el PDF del contrato (con firma si existe) y devuelve los bytes. */
export async function buildContractPdf(
  c: Contract,
  p?: Property
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Contrato ${c.id}`);
  doc.setProducer("RCR Inmobiliaria Demo");

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };

  for (const line of buildContractText(c, p)) {
    if (y < MARGIN + LINE_H) newPage();
    const isTitle = line.startsWith("CONTRATO DE");
    const font = isTitle ? bold : regular;
    const size = isTitle ? 14 : 10.5;
    // wrap long lines
    const wrapped = wrap(line, isTitle ? 62 : 88);
    for (const wl of wrapped) {
      if (y < MARGIN + LINE_H) newPage();
      page.drawText(wl, {
        x: MARGIN,
        y,
        size,
        font,
        color: rgb(0.12, 0.16, 0.23)
      });
      y -= LINE_H;
    }
  }

  // signature block
  if (c.signatureDataUrl) {
    try {
      const png = await doc.embedPng(c.signatureDataUrl);
      const w = 160;
      const h = (png.height / png.width) * w;
      if (y < MARGIN + h + 24) newPage();
      page.drawImage(png, {
        x: PAGE_W - MARGIN - w,
        y: y - h,
        width: w,
        height: h
      });
      page.drawRectangle({
        x: PAGE_W - MARGIN - w,
        y: y - h,
        width: w,
        height: h,
        borderColor: rgb(0.6, 0.65, 0.7),
        borderWidth: 0.5
      });
      page.drawText("Firma digital capturada en navegador", {
        x: PAGE_W - MARGIN - w,
        y: y - h - 12,
        size: 7.5,
        font: regular,
        color: rgb(0.45, 0.5, 0.55)
      });
    } catch {
      /* firma no embebible */
    }
  }

  return doc.save();
}

function wrap(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const words = text.split(" ");
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      out.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim() ? cur + " " + w : w;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as unknown as BlobPart], {
    type: "application/pdf"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
