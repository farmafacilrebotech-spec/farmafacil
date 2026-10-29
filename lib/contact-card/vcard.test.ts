import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  buildVCard,
  escapeVCardText,
  foldVCardLine,
  loadContactCardPhoto,
} from "./vcard.ts";
import type { ResolvedContactCard } from "./types.ts";

const sample: ResolvedContactCard = {
  id: "pilar",
  givenName: "Pilar",
  familyName: "Reyes Bononat",
  fullName: "Pilar Reyes Bononat",
  title: "Fundadora y Directora",
  organization: "FarmaFácil",
  email: "pilar@farmafacil.solutions",
  website: "https://www.farmafacil.solutions",
  publicUrl: "https://www.farmafacil.solutions/contacto/pilar",
  vcfFilename: "Pilar_Reyes_Bononat.vcf",
  phoneEnvKey: "CONTACT_CARD_PHONE_PILAR",
  logoSrc: "/images/logo/farmafacil-logo.png",
  phone: {
    display: "+34 711 520 218",
    e164: "34711520218",
    telHref: "tel:+34711520218",
    whatsappUrl: "https://wa.me/34711520218",
  },
};

describe("vCard 3.0 tarjeta digital", () => {
  it("incluye FN, N, ORG, TITLE, TEL, EMAIL y URL corporativos", () => {
    const vcf = buildVCard(sample);
    assert.match(vcf, /^BEGIN:VCARD\r\n/);
    assert.match(vcf, /VERSION:3\.0\r\n/);
    assert.match(vcf, /FN;CHARSET=UTF-8:Pilar Reyes Bononat\r\n/);
    assert.match(
      vcf,
      /N;CHARSET=UTF-8:Reyes Bononat;Pilar;;;\r\n/
    );
    assert.match(vcf, /ORG;CHARSET=UTF-8:FarmaFácil\r\n/);
    assert.match(vcf, /TITLE;CHARSET=UTF-8:Fundadora y Directora\r\n/);
    assert.match(vcf, /TEL;TYPE=CELL,VOICE:\+34 711 520 218\r\n/);
    assert.match(vcf, /EMAIL;TYPE=INTERNET:pilar@farmafacil\.solutions\r\n/);
    assert.match(vcf, /URL:https:\/\/www\.farmafacil\.solutions\r\n/);
    assert.ok(!vcf.toLowerCase().includes("gmail"));
    assert.equal(vcf.includes("END:VCARD"), true);
  });

  it("escapa caracteres especiales vCard", () => {
    assert.equal(escapeVCardText("a;b,c\\d"), "a\\;b\\,c\\\\d");
  });

  it("pliega líneas largas para PHOTO", () => {
    const long = "PHOTO;ENCODING=b;TYPE=JPEG:" + "A".repeat(200);
    const folded = foldVCardLine(long);
    const lines = folded.split("\r\n");
    assert.ok(lines.length > 1);
    assert.ok(lines.every((l, i) => (i === 0 ? l.length <= 75 : l.length <= 75)));
    assert.ok(lines.slice(1).every((l) => l.startsWith(" ")));
  });

  it("embebe PHOTO JPEG compacto del logo oficial si existe", () => {
    const photoPath = join(
      process.cwd(),
      "public/images/logo/farmafacil-contact-photo.jpg"
    );
    assert.equal(existsSync(photoPath), true, "falta farmafacil-contact-photo.jpg");
    const photo = loadContactCardPhoto();
    assert.ok(photo);
    assert.equal(photo!.type, "JPEG");
    assert.ok(photo!.base64.length > 100);
    const raw = readFileSync(photoPath);
    assert.ok(raw.byteLength < 12_000, "PHOTO no debe inflar el VCF");

    const vcf = buildVCard(sample, { photo });
    assert.match(vcf, /PHOTO;ENCODING=b;TYPE=JPEG:/);
    assert.ok(vcf.length < 20_000);
  });

  it("QR público canónico no cambia", () => {
    assert.equal(
      sample.publicUrl,
      "https://www.farmafacil.solutions/contacto/pilar"
    );
  });
});
