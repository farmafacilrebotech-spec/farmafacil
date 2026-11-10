import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { PNG } from "pngjs";
import QRCode from "qrcode";
import jsQR from "jsqr";

import { FLYER_QR_URL } from "./comercial.ts";

function decodePng(png: Buffer): string {
  const image = PNG.sync.read(png);
  const decoded = jsQR(new Uint8ClampedArray(image.data), image.width, image.height);
  assert.ok(decoded, "el lector no encontró un QR");
  return decoded.data;
}

describe("QR auténtico del flyer", () => {
  it("codifica la URL definitiva y un lector independiente la recupera", async () => {
    const png = await QRCode.toBuffer(FLYER_QR_URL, {
      type: "png",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 512,
    });
    const decoded = decodePng(png);
    assert.equal(decoded, FLYER_QR_URL);
    assert.equal(decoded.includes("@"), false);
  });

  it("el PNG imprimible guarda exactamente esa URL", () => {
    const png = readFileSync(
      new URL("../../docs/comercial/qr-flyer-lanzamiento-2027.png", import.meta.url)
    );
    assert.equal(decodePng(png), FLYER_QR_URL);
  });
});
