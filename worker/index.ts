/** Cloudflare Worker entry point for Content Bridge. */
import { connect } from "cloudflare:sockets";
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  SMTP_PASSWORD?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type ContactPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  website?: unknown;
  plan?: unknown;
  geo?: unknown;
  message?: unknown;
  company_site?: unknown;
  startedAt?: unknown;
};

const SMTP_HOST = "mail.onwebs.ir";
const SMTP_PORT = 465;
const SMTP_USER = "ceo@onwebs.ir";
const SMTP_FROM_NAME = "ویرا وب آریا";
const SMTP_TO = "ftsepi@gmail.com";

function json(message: string, status = 200) {
  return Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] || char);
}

function base64Utf8(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

function wrapBase64(value: string) {
  return value.match(/.{1,76}/g)?.join("\r\n") || value;
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${base64Utf8(value)}?=`;
}

async function sendSmtpMail(password: string, subject: string, replyTo: string, html: string) {
  const socket = connect({ hostname: SMTP_HOST, port: SMTP_PORT }, { secureTransport: "on" });
  await socket.opened;
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const readLine = async (): Promise<string> => {
    while (!buffer.includes("\n")) {
      const chunk = await reader.read();
      if (chunk.done) throw new Error("SMTP connection closed unexpectedly");
      buffer += decoder.decode(chunk.value, { stream: true });
    }
    const lineEnd = buffer.indexOf("\n");
    const line = buffer.slice(0, lineEnd).replace(/\r$/, "");
    buffer = buffer.slice(lineEnd + 1);
    return line;
  };

  const readResponse = async (acceptedCodes: number[]) => {
    let code = 0;
    let line = "";
    do {
      line = await readLine();
      if (/^\d{3}/.test(line)) code = Number(line.slice(0, 3));
    } while (line[3] === "-");
    if (!acceptedCodes.includes(code)) throw new Error(`SMTP error ${code}`);
  };

  const command = async (value: string, acceptedCodes: number[]) => {
    await writer.write(encoder.encode(`${value}\r\n`));
    await readResponse(acceptedCodes);
  };

  try {
    await readResponse([220]);
    await command("EHLO contentbridge.onwebs.ir", [250]);
    await command("AUTH LOGIN", [334]);
    await command(base64Utf8(SMTP_USER), [334]);
    await command(base64Utf8(password), [235]);
    await command(`MAIL FROM:<${SMTP_USER}>`, [250]);
    await command(`RCPT TO:<${SMTP_TO}>`, [250, 251]);
    await command("DATA", [354]);

    const body = wrapBase64(base64Utf8(html));
    const message = [
      `From: ${encodeHeader(SMTP_FROM_NAME)} <${SMTP_USER}>`,
      `To: <${SMTP_TO}>`,
      `Reply-To: <${replyTo}>`,
      `Subject: ${encodeHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@onwebs.ir>`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      body,
    ].join("\r\n");

    await writer.write(encoder.encode(`${message}\r\n.\r\n`));
    await readResponse([250]);
    await command("QUIT", [221]);
  } finally {
    reader.releaseLock();
    writer.releaseLock();
    socket.close();
  }
}

async function handleContact(request: Request, env: Env) {
  const isEnglish = new URL(request.url).searchParams.get("lang") === "en";
  const localized = (fa: string, en: string) => isEnglish ? en : fa;
  if (request.method !== "POST") return json(localized("متد درخواست معتبر نیست.", "This request method is not supported."), 405);
  if (!request.headers.get("content-type")?.includes("application/json")) return json(localized("فرمت درخواست معتبر نیست.", "The request format is not valid."), 415);
  if (!env.SMTP_PASSWORD) return json(localized("ارسال ایمیل هنوز روی سرور فعال نشده است.", "Email delivery has not been enabled on the server yet."), 503);

  let payload: ContactPayload;
  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return json(localized("اطلاعات فرم قابل خواندن نیست.", "We could not read the form data."), 400);
  }

  if (clean(payload.company_site, 100)) return json(localized("درخواست شما ثبت شد.", "Your request has been received."));
  const startedAt = Number(payload.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1800) return json(localized("لطفاً فرم را با دقت کامل کنید.", "Please take a moment to complete the form carefully."), 400);

  const name = clean(payload.name, 80);
  const phone = clean(payload.phone, 30);
  const email = clean(payload.email, 120).toLowerCase();
  const website = clean(payload.website, 160);
  const plan = clean(payload.plan, 60) || "نیاز به مشاوره";
  const geoValue = clean(payload.geo, 10).toLowerCase();
  const geo = geoValue === "بله" || geoValue === "yes" ? "بله (+۵ میلیون تومان)" : "خیر";
  const message = clean(payload.message, 1200);

  if (name.length < 2 || phone.length < 7 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(localized("لطفاً نام، شماره تماس و ایمیل معتبر وارد کنید.", "Please enter a valid name, phone number and email address."), 400);
  }

  const html = `<!doctype html><html lang="fa" dir="rtl"><body style="margin:0;background:#faf8f3;font-family:Tahoma,Arial,sans-serif;color:#171614"><div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e7e2d8;border-radius:16px;overflow:hidden"><div style="background:#1e211f;color:#fff;padding:28px 32px"><div style="color:#e9a48c;font-size:12px">Content Bridge</div><h1 style="font-size:22px;margin:6px 0 0">درخواست جدید شروع پروژه</h1></div><div style="padding:30px 32px"><table style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.8"><tr><td style="padding:8px 0;color:#6c6963;width:145px">نام</td><td style="padding:8px 0;font-weight:bold">${escapeHtml(name)}</td></tr><tr><td style="padding:8px 0;color:#6c6963">شماره تماس</td><td style="padding:8px 0" dir="ltr">${escapeHtml(phone)}</td></tr><tr><td style="padding:8px 0;color:#6c6963">ایمیل</td><td style="padding:8px 0" dir="ltr">${escapeHtml(email)}</td></tr><tr><td style="padding:8px 0;color:#6c6963">وب‌سایت</td><td style="padding:8px 0" dir="ltr">${escapeHtml(website || "—")}</td></tr><tr><td style="padding:8px 0;color:#6c6963">پلن</td><td style="padding:8px 0">${escapeHtml(plan)}</td></tr><tr><td style="padding:8px 0;color:#6c6963">افزودنی GEO</td><td style="padding:8px 0">${geo}</td></tr></table><div style="margin-top:20px;padding:18px;background:#f6e7df;border-radius:10px"><div style="font-size:11px;color:#a94f34;font-weight:bold;margin-bottom:6px">توضیحات متقاضی</div><div style="white-space:pre-wrap;font-size:14px">${escapeHtml(message || "توضیحی ثبت نشده است.")}</div></div><p style="font-size:11px;color:#8a877f;margin:24px 0 0">برای پاسخ مستقیم، روی Reply بزنید؛ پاسخ به ${escapeHtml(email)} ارسال می‌شود.</p></div></div></body></html>`;

  try {
    await sendSmtpMail(env.SMTP_PASSWORD, `درخواست ${plan} — ${name}`, email, html);
    return json(localized("درخواست شما با موفقیت ارسال شد.", "Your request was sent successfully."));
  } catch (error) {
    console.error("Contact email failed", error instanceof Error ? error.message : error);
    return json(localized("ارسال فرم موقتاً انجام نشد؛ لطفاً چند دقیقه دیگر دوباره تلاش کنید.", "We could not send the form right now. Please try again in a few minutes."), 502);
  }
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") return handleContact(request, env);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
