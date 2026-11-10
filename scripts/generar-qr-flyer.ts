/**
 * Genera el QR imprimible del flyer con la librería `qrcode` (node-qrcode).
 * No uses una imagen de QR hecha por un modelo: no se puede garantizar que scanee.
 *
 *   npx tsx scripts/generar-qr-flyer.ts
 *   npx tsx --test lib/contacto/flyer-qr.test.ts
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";
import { FLYER_QR_URL } from "../lib/contacto/comercial";

async function main() {
  const dir = join(process.cwd(), "docs/comercial");
  mkdirSync(dir, { recursive: true });
  const svgPath = join(dir, "qr-flyer-lanzamiento-2027.svg");
  const pngPath = join(dir, "qr-flyer-lanzamiento-2027.png");
  const options = {
    errorCorrectionLevel: "H" as const,
    margin: 2,
    width: 1024,
    color: { dark: "#000000", light: "#FFFFFF" },
  };
  await QRCode.toFile(svgPath, FLYER_QR_URL, { ...options, type: "svg" });
  await QRCode.toFile(pngPath, FLYER_QR_URL, { ...options, type: "png" });
  console.log(FLYER_QR_URL);
  console.log(svgPath);
  console.log(pngPath);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
