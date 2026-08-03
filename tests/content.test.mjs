import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, projectRoot), "utf8");
}

test("keeps the Persian and English sales messages aligned", async () => {
  const [persian, english] = await Promise.all([
    source("app/page.tsx"),
    source("app/en/page.tsx"),
  ]);

  assert.match(persian, /شفافیت از روز اول/);
  assert.match(persian, /قبل از شروع، مسیر محتوا و خروجی هر ماه را دقیق می‌بینید/);
  assert.match(persian, /اسکریپت و تنظیمات اختصاصی انجام می‌شود/);
  assert.match(persian, /downloads\/content-bridge-2\.1\.0\.zip/);
  assert.match(persian, /price: "۹"/);
  assert.match(persian, /price: "۱۲"/);
  assert.match(persian, /price: "۱۷"/);
  assert.match(persian, /\+۱۰/);
  assert.match(persian, /در هر سه پلن، بدون استثنا/);
  assert.match(persian, /مسیر شش‌ماهه/);
  assert.match(persian, /۷۹٫۵٪/);

  assert.match(english, /Clarity from day one/);
  assert.match(english, /See the content roadmap and monthly deliverables before work begins/);
  assert.match(english, /purpose-built script and integration setup/);
  assert.match(english, /Download plugin/);
  assert.match(english, /price: "9"/);
  assert.match(english, /price: "12"/);
  assert.match(english, /price: "17"/);
  assert.match(english, /\+10/);
  assert.match(english, /Included in every plan/);
  assert.match(english, /The first six months/);
  assert.match(english, /79\.5%/);
  await access(new URL("public/downloads/content-bridge-2.1.0.zip", projectRoot));
  await access(new URL("public/banner-examples.webp", projectRoot));
});

test("includes bilingual SEO and local shared-host support", async () => {
  const [persianLayout, englishLayout, sitemap, builder] = await Promise.all([
    source("app/layout.tsx"),
    source("app/en/layout.tsx"),
    source("app/sitemap.ts"),
    source("scripts/build-shared-host.mjs"),
  ]);

  assert.match(persianLayout, /keywords:/);
  assert.match(persianLayout, /"fa-IR"/);
  assert.match(persianLayout, /"en-US"/);
  assert.match(englishLayout, /custom publishing integration script/);
  assert.match(sitemap, /\/en/);
  assert.match(builder, /cb_site_context/);
  assert.match(builder, /site\.css/);
  assert.match(builder, /smtp_password/);
  assert.match(builder, /downloadsDir/);
  assert.match(builder, /banner-examples\.webp/);
});
