import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const projectDir = process.cwd();
const outputDir = path.join(projectDir, "releases", "content-bridge-shared-host");
const assetsDir = path.join(outputDir, "assets");
const devOrigin = process.env.CONTENT_BRIDGE_RENDER_ORIGIN || "http://localhost:3000";

async function fetchPage(route) {
  const response = await fetch(`${devOrigin}${route}`);
  if (!response.ok) throw new Error(`Could not render ${route}: ${response.status}`);
  return response.text();
}

function phpPreamble(levelsUp) {
  return `<?php
declare(strict_types=1);
require_once ${levelsUp === 0 ? "__DIR__" : "dirname(__DIR__)"} . '/_bootstrap.php';
[$siteUrl, $siteBasePath] = cb_site_context(${levelsUp});
?>\n`;
}

function cleanHtml(source, locale) {
  const closingHtml = source.indexOf("</html>");
  if (closingHtml === -1) throw new Error(`Rendered ${locale} page has no closing html tag`);
  let html = source.slice(0, closingHtml + 7);

  html = html
    .replace(/<script(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link[^>]+(?:data-rsc-css-href|rel="modulepreload")[^>]*\/?>(?:\s*)/gi, "")
    .replace(/<!-- -->/g, "")
    .replace(/\sdata-rsc-css-href="[^"]*"/g, "")
    .replace(/\sdata-precedence="[^"]*"/g, "");

  const isEnglish = locale === "en";
  const assetPrefix = isEnglish ? "../assets/" : "assets/";
  const pageUrlPhp = isEnglish ? "$siteUrl . '/en/'" : "$siteUrl . '/'";
  const imagePhp = isEnglish ? "$siteUrl . '/assets/og-en.png'" : "$siteUrl . '/assets/og.png'";

  if (isEnglish) {
    html = html.replace('<html lang="fa" dir="rtl">', '<html lang="en" dir="ltr">');
  }

  html = html
    .replace("http://localhost:3000/og-en.png", `<?= cb_e(${imagePhp}) ?>`)
    .replace("http://localhost:3000/og.png", `<?= cb_e(${imagePhp}) ?>`)
    .replace(/<meta property="og:url" content="http:\/\/localhost:3000(?:\/en)?"\/>/, `<meta property="og:url" content="<?= cb_e(${pageUrlPhp}) ?>"/>`)
    .replace(/<link rel="canonical" href="http:\/\/localhost:3000(?:\/en)?"\/>/, `<link rel="canonical" href="<?= cb_e(${pageUrlPhp}) ?>"/>`)
    .replace(/<link rel="alternate" hrefLang="fa-IR" href="http:\/\/localhost:3000"\/>/, '<link rel="alternate" hreflang="fa-IR" href="<?= cb_e($siteUrl . \'/\') ?>"/>')
    .replace(/<link rel="alternate" hrefLang="en-US" href="http:\/\/localhost:3000\/en"\/>/, '<link rel="alternate" hreflang="en-US" href="<?= cb_e($siteUrl . \'/en/\') ?>"/>')
    .replace(/<link rel="alternate" hrefLang="x-default" href="http:\/\/localhost:3000"\/>/, '<link rel="alternate" hreflang="x-default" href="<?= cb_e($siteUrl . \'/\') ?>"/>')
    .replace("</head>", `<link rel="stylesheet" href="${assetPrefix}site.css"/>\n</head>`)
    .replace("</body>", `<script defer src="${assetPrefix}site.js" data-content-bridge-site></script>\n</body>`);

  if (isEnglish) {
    html = html.replace('class="language-switch" href="/"', 'class="language-switch" href="<?= cb_e($siteUrl . \'/\') ?>" data-site-path=""');
  } else {
    html = html.replace('class="language-switch" href="/en"', 'class="language-switch" href="<?= cb_e($siteUrl . \'/en/\') ?>" data-site-path="en/"');
  }

  return `${phpPreamble(isEnglish ? 1 : 0)}${html}`;
}

const siteJs = `(() => {
  "use strict";

  const script = document.currentScript || document.querySelector("script[data-content-bridge-site]");
  const siteRoot = new URL("../", script.src);
  const isEnglish = document.documentElement.lang === "en";
  const tr = (fa, en) => isEnglish ? en : fa;
  const startedAt = Date.now();

  document.querySelectorAll(".language-switch[data-site-path]").forEach((link) => {
    link.href = new URL(link.dataset.sitePath || "./", siteRoot).href;
  });

  const revealElements = document.querySelectorAll(
    ".section-heading, .problem-grid article, .process-item, .feature-card, .promise-card, .price-card, .geo-card, .faq-intro, .faq-list article, .contact-copy, .contact-form"
  );
  if ("IntersectionObserver" in window) {
    revealElements.forEach((element) => element.classList.add("motion-ready"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("motion-visible"));
  }

  const form = document.querySelector(".contact-form");
  const planSelect = form?.querySelector('select[name="plan"]');
  document.querySelectorAll(".plan-button").forEach((button) => {
    button.type = "button";
    button.addEventListener("click", () => {
      const plan = button.closest(".price-card")?.querySelector("h3")?.textContent?.trim();
      if (planSelect && plan) planSelect.value = plan;
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  if (!form) return;
  const submitButton = form.querySelector('button[type="submit"]');
  const privacy = form.querySelector(".privacy");
  const feedback = document.createElement("p");
  feedback.className = "form-feedback";
  feedback.setAttribute("role", "status");
  privacy?.before(feedback);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.textContent = "";
    feedback.className = "form-feedback";
    submitButton.disabled = true;
    const originalLabel = submitButton.innerHTML;
    submitButton.textContent = tr("در حال ارسال…", "Sending…");

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.startedAt = startedAt;
    payload.locale = isEnglish ? "en" : "fa";

    try {
      const response = await fetch(new URL("contact.php", siteRoot), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || tr("ارسال انجام نشد.", "The request could not be sent."));
      feedback.className = "form-feedback success";
      feedback.textContent = result.message || tr("درخواست شما ثبت شد.", "Your request has been received.");
      form.reset();
    } catch (error) {
      feedback.className = "form-feedback error";
      feedback.textContent = error instanceof Error ? error.message : tr("خطایی رخ داد.", "Something went wrong.");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }
  });
})();
`;

const bootstrapPhp = `<?php
declare(strict_types=1);

function cb_e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function cb_site_context(int $levelsUp = 0): array {
    $scriptName = str_replace('\\\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/index.php');
    $basePath = dirname($scriptName);
    for ($i = 0; $i < $levelsUp; $i++) {
        $basePath = dirname($basePath);
    }
    $basePath = rtrim(str_replace('\\\\', '/', $basePath), '/');
    if ($basePath === '.' || $basePath === '/') {
        $basePath = '';
    }

    $forwardedProto = strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $forwardedProto === 'https';
    $scheme = $isHttps ? 'https' : 'http';
    $host = (string)($_SERVER['HTTP_HOST'] ?? 'localhost');
    $host = preg_replace('/[^A-Za-z0-9.\\-:\\[\\]]/', '', $host) ?: 'localhost';
    return [$scheme . '://' . $host . $basePath, $basePath];
}
`;

const configPhp = `<?php
declare(strict_types=1);

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

return [
    'smtp_host' => 'mail.onwebs.ir',
    'smtp_port' => 465,
    'smtp_username' => 'ceo@onwebs.ir',
    // رمز واقعی SMTP را فقط بین دو کوتیشن زیر وارد کنید.
    'smtp_password' => '',
    'from_name' => 'ویرا وب آریا',
    'from_email' => 'ceo@onwebs.ir',
    'to_email' => 'ftsepi@gmail.com',
];
`;

const contactPhp = `<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(string $message, int $status = 200): never {
    http_response_code($status);
    echo json_encode(['message' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function limited_text(mixed $value, int $length): string {
    if (!is_string($value)) return '';
    $value = trim($value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $length, 'UTF-8') : substr($value, 0, $length);
}

function smtp_read($socket): array {
    $lines = [];
    while (($line = fgets($socket, 2048)) !== false) {
        $lines[] = rtrim($line, "\\r\\n");
        if (preg_match('/^(\\d{3}) /', $line, $match)) {
            return [(int)$match[1], implode("\\n", $lines)];
        }
    }
    throw new RuntimeException('SMTP connection closed unexpectedly');
}

function smtp_expect($socket, array $expected): void {
    [$code] = smtp_read($socket);
    if (!in_array($code, $expected, true)) {
        throw new RuntimeException('SMTP rejected the request: ' . $code);
    }
}

function smtp_command($socket, string $command, array $expected): void {
    if (fwrite($socket, $command . "\\r\\n") === false) {
        throw new RuntimeException('Could not write to SMTP connection');
    }
    smtp_expect($socket, $expected);
}

function encoded_header(string $value): string {
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function send_smtp(array $config, string $subject, string $replyTo, string $html): void {
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false,
            'SNI_enabled' => true,
            'peer_name' => $config['smtp_host'],
        ],
    ]);
    $socket = @stream_socket_client(
        'ssl://' . $config['smtp_host'] . ':' . $config['smtp_port'],
        $errorNumber,
        $errorMessage,
        15,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if (!$socket) throw new RuntimeException('SMTP connection failed: ' . $errorNumber);
    stream_set_timeout($socket, 15);

    try {
        smtp_expect($socket, [220]);
        smtp_command($socket, 'EHLO contentbridge.local', [250]);
        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($config['smtp_username']), [334]);
        smtp_command($socket, base64_encode($config['smtp_password']), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $config['from_email'] . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $config['to_email'] . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

        $headers = [
            'From: ' . encoded_header($config['from_name']) . ' <' . $config['from_email'] . '>',
            'To: <' . $config['to_email'] . '>',
            'Reply-To: <' . $replyTo . '>',
            'Subject: ' . encoded_header($subject),
            'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@onwebs.ir>',
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($html), 76, "\\r\\n"),
        ];
        $message = implode("\\r\\n", $headers);
        if (fwrite($socket, $message . "\\r\\n.\\r\\n") === false) {
            throw new RuntimeException('Could not send SMTP message');
        }
        smtp_expect($socket, [250]);
        smtp_command($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond('Method not allowed.', 405);
$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);
if (!is_array($payload)) respond('Invalid request.', 400);

$isEnglish = limited_text($payload['locale'] ?? '', 2) === 'en';
$t = static fn(string $fa, string $en): string => $isEnglish ? $en : $fa;
if (limited_text($payload['company_site'] ?? '', 100) !== '') respond($t('درخواست شما ثبت شد.', 'Your request has been received.'));

$startedAt = (int)($payload['startedAt'] ?? 0);
$nowMs = (int)round(microtime(true) * 1000);
if ($startedAt < 1 || ($nowMs - $startedAt) < 1800) respond($t('لطفاً فرم را با دقت کامل کنید.', 'Please take a moment to complete the form carefully.'), 400);

$name = limited_text($payload['name'] ?? '', 80);
$phone = limited_text($payload['phone'] ?? '', 30);
$email = strtolower(limited_text($payload['email'] ?? '', 120));
$website = limited_text($payload['website'] ?? '', 160);
$plan = limited_text($payload['plan'] ?? '', 60) ?: $t('نیاز به مشاوره', 'Needs consultation');
$geoValue = strtolower(limited_text($payload['geo'] ?? '', 10));
$geo = in_array($geoValue, ['بله', 'yes'], true) ? 'بله (+۵ میلیون تومان)' : 'خیر';
$notes = limited_text($payload['message'] ?? '', 1200);

if (strlen($name) < 2 || strlen($phone) < 7 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond($t('لطفاً نام، شماره تماس و ایمیل معتبر وارد کنید.', 'Please enter a valid name, phone number and email address.'), 400);
}

$config = require __DIR__ . '/config.php';
if (trim((string)$config['smtp_password']) === '') {
    respond($t('رمز SMTP هنوز در فایل config.php تنظیم نشده است.', 'The SMTP password has not been added to config.php yet.'), 503);
}

$e = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$html = '<!doctype html><html lang="fa" dir="rtl"><body style="margin:0;background:#faf8f3;font-family:Tahoma,Arial,sans-serif;color:#171614"><div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e7e2d8;border-radius:16px;overflow:hidden"><div style="background:#1e211f;color:#fff;padding:28px 32px"><div style="color:#e9a48c;font-size:12px">Content Bridge</div><h1 style="font-size:22px;margin:6px 0 0">درخواست جدید شروع پروژه</h1></div><div style="padding:30px 32px"><table style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.8"><tr><td style="padding:8px 0;color:#6c6963;width:145px">نام</td><td style="padding:8px 0;font-weight:bold">' . $e($name) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">شماره تماس</td><td style="padding:8px 0" dir="ltr">' . $e($phone) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">ایمیل</td><td style="padding:8px 0" dir="ltr">' . $e($email) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">وب‌سایت</td><td style="padding:8px 0" dir="ltr">' . $e($website ?: '—') . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">پلن</td><td style="padding:8px 0">' . $e($plan) . '</td></tr><tr><td style="padding:8px 0;color:#6c6963">افزودنی GEO</td><td style="padding:8px 0">' . $geo . '</td></tr></table><div style="margin-top:20px;padding:18px;background:#f6e7df;border-radius:10px"><div style="font-size:11px;color:#a94f34;font-weight:bold;margin-bottom:6px">توضیحات متقاضی</div><div style="white-space:pre-wrap;font-size:14px">' . $e($notes ?: 'توضیحی ثبت نشده است.') . '</div></div></div></div></body></html>';

try {
    send_smtp($config, 'درخواست ' . $plan . ' — ' . $name, $email, $html);
    respond($t('درخواست شما با موفقیت ارسال شد.', 'Your request was sent successfully.'));
} catch (Throwable $error) {
    error_log('Content Bridge SMTP: ' . $error->getMessage());
    respond($t('ارسال فرم موقتاً انجام نشد؛ لطفاً چند دقیقه دیگر دوباره تلاش کنید.', 'We could not send the form right now. Please try again in a few minutes.'), 502);
}
`;

const robotsPhp = `<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';
[$siteUrl] = cb_site_context(0);
header('Content-Type: text/plain; charset=utf-8');
echo "User-agent: *\\nAllow: /\\nDisallow: " . parse_url($siteUrl, PHP_URL_PATH) . "/contact.php\\nSitemap: " . $siteUrl . "/sitemap.xml\\n";
`;

const sitemapPhp = `<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';
[$siteUrl] = cb_site_context(0);
header('Content-Type: application/xml; charset=utf-8');
$fa = cb_e($siteUrl . '/');
$en = cb_e($siteUrl . '/en/');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc><?= $fa ?></loc><xhtml:link rel="alternate" hreflang="fa-IR" href="<?= $fa ?>"/><xhtml:link rel="alternate" hreflang="en-US" href="<?= $en ?>"/><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc><?= $en ?></loc><xhtml:link rel="alternate" hreflang="fa-IR" href="<?= $fa ?>"/><xhtml:link rel="alternate" hreflang="en-US" href="<?= $en ?>"/><changefreq>monthly</changefreq><priority>0.9</priority></url>
</urlset>
`;

const htaccess = `DirectoryIndex index.php index.html
Options -Indexes
AddDefaultCharset UTF-8

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^en$ en/ [R=301,L]
  RewriteRule ^robots\\.txt$ robots.php [L]
  RewriteRule ^sitemap\\.xml$ sitemap.php [L]
</IfModule>

<FilesMatch "^(config\\.php|_bootstrap\\.php)$">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
  <IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
  </IfModule>
</FilesMatch>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 30 days"
  ExpiresByType application/javascript "access plus 30 days"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/png "access plus 30 days"
</IfModule>
`;

const installText = `راهنمای نصب Content Bridge روی هاست اشتراکی
================================================

1) تمام فایل‌های داخل ZIP را در پوشه مقصد هاست Extract کنید.
   می‌تواند public_html یا هر زیردایرکتوری دیگری باشد؛ مسیر خودکار تشخیص داده می‌شود.

2) فایل config.php را با File Manager باز کنید و رمز واقعی SMTP را بین کوتیشن مقابل smtp_password وارد کنید.
   سایر تنظیمات از قبل وارد شده‌اند:
   Host: mail.onwebs.ir | Port: 465 | SSL/TLS
   From: ceo@onwebs.ir | To: ftsepi@gmail.com

3) PHP 8.1 یا جدیدتر و افزونه OpenSSL باید روی هاست فعال باشد.

4) صفحه فارسی در آدرس پوشه نصب و نسخه انگلیسی در /en/ در دسترس است.

5) فایل‌های robots.txt و sitemap.xml به‌صورت خودکار دامنه و پوشه نصب را تشخیص می‌دهند.

نکات مهم
---------
- هیچ فونت، اسکریپت، تصویر یا CDN خارجی استفاده نشده است؛ ظاهر سایت در اینترنت ملی نیز کامل بارگذاری می‌شود.
- فایل config.php به کمک .htaccess از دسترسی وب محافظت شده است.
- اگر هاست LiteSpeed یا Apache باشد، .htaccess بدون تغییر کار می‌کند.
- اگر پس از نصب فرم ایمیل نفرستاد، در کنترل‌پنل هاست بررسی کنید اتصال خروجی به پورت 465 مسدود نباشد.
`;

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.join(outputDir, "en"), { recursive: true });
await mkdir(assetsDir, { recursive: true });

const [faSource, enSource] = await Promise.all([fetchPage("/"), fetchPage("/en")]);
await writeFile(path.join(outputDir, "index.php"), cleanHtml(faSource, "fa"), "utf8");
await writeFile(path.join(outputDir, "en", "index.php"), cleanHtml(enSource, "en"), "utf8");

const builtAssetsDir = path.join(projectDir, "dist", "client", "assets");
const assetNames = await readdir(builtAssetsDir);
const cssName = assetNames.find((name) => name.endsWith(".css"));
if (!cssName) throw new Error("Built stylesheet was not found");
let css = await readFile(path.join(builtAssetsDir, cssName), "utf8");
css = css.replaceAll("url(/assets/", "url(./");
await writeFile(path.join(assetsDir, "site.css"), css, "utf8");
await writeFile(path.join(assetsDir, "site.js"), siteJs, "utf8");

for (const name of assetNames.filter((name) => /\.woff2?$/.test(name))) {
  await cp(path.join(builtAssetsDir, name), path.join(assetsDir, name));
}
await cp(path.join(projectDir, "public", "og.png"), path.join(assetsDir, "og.png"));
await cp(path.join(projectDir, "public", "og-en.png"), path.join(assetsDir, "og-en.png"));

await writeFile(path.join(outputDir, "_bootstrap.php"), bootstrapPhp, "utf8");
await writeFile(path.join(outputDir, "config.php"), configPhp, "utf8");
await writeFile(path.join(outputDir, "contact.php"), contactPhp, "utf8");
await writeFile(path.join(outputDir, "robots.php"), robotsPhp, "utf8");
await writeFile(path.join(outputDir, "sitemap.php"), sitemapPhp, "utf8");
await writeFile(path.join(outputDir, ".htaccess"), htaccess, "utf8");
await writeFile(path.join(outputDir, "INSTALL-FA.txt"), installText, "utf8");

console.log(outputDir);
