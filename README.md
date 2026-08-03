# Content Bridge

[فارسی](#نسخه-فارسی) · [English](#english)

## English

Content Bridge is an open-source, bilingual sales landing page for a managed AI-assisted content operation. It presents content strategy, keyword planning, WordPress publishing, LinkedIn distribution, professional SEO, GEO services, and purpose-built integrations for custom-coded websites.

**Live demo:** [content-bridge-fa.onwebs.chatgpt.site](https://content-bridge-fa.onwebs.chatgpt.site)

### Highlights

- Persian RTL and English LTR experiences
- Responsive, accessible UI with lightweight motion
- SEO metadata, canonical URLs, hreflang, sitemap, robots, Open Graph, and JSON-LD
- Three monthly service plans plus an optional GEO add-on
- Custom connector messaging for non-WordPress and custom-coded websites
- Contact form with SMTP delivery
- Self-hosted fonts and assets for restricted-network compatibility
- A portable PHP package for Apache/LiteSpeed shared hosting and subdirectory installs

### Stack

- React 19 and Next.js-compatible routing
- vinext and Vite
- Cloudflare Worker runtime
- TypeScript and CSS
- Optional PHP shared-host export

### Local development

Requirements: Node.js 22.13 or newer.

```bash
git clone https://github.com/onwebs-dev/content-bridge.git
cd content-bridge
npm install
npm run dev
```

Open `http://localhost:3000`. Run the production checks with:

```bash
npm test
```

### Email configuration

The form reads the SMTP password from `SMTP_PASSWORD`; copy `.dev.vars.example` to `.dev.vars` for local work and never commit the real password. Host, sender, and recipient defaults live in `worker/index.ts` and can be replaced for your deployment.

For the PHP shared-host build, keep the development server running, build the app, and run:

```bash
npm run build
npm run build:shared-host
```

Then set the real SMTP password only in the generated `config.php` on your server. The export detects its installation path automatically, including subdirectories.

### Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before sending a change.

### License

Released under the [MIT License](./LICENSE) by [ONWEBS](https://github.com/onwebs-dev) and Sepehr Fathi.

---

## نسخه فارسی

Content Bridge یک لندینگ فروش دوزبانه و متن‌باز برای سرویس مدیریت و اتوماسیون محتوا با کمک هوش مصنوعی است. این پروژه خدمات استراتژی محتوا، تحقیق کلمات کلیدی، انتشار وردپرس، توزیع در لینکدین، سئوی حرفه‌ای، GEO و اتصال اختصاصی سایت‌های کدنویسی‌شده را معرفی می‌کند.

**نسخه آنلاین:** [content-bridge-fa.onwebs.chatgpt.site](https://content-bridge-fa.onwebs.chatgpt.site)

### امکانات اصلی

- تجربه فارسی راست‌به‌چپ و انگلیسی چپ‌به‌راست
- رابط واکنش‌گرا و دسترس‌پذیر با موشن سبک
- متادیتای SEO، آدرس canonical، تگ hreflang، سایت‌مپ، robots، Open Graph و JSON-LD
- سه پلن ماهانه و افزونه اختیاری GEO
- معرفی اتصال اختصاصی برای سایت‌های کدنویسی‌شده و غیروردپرسی
- فرم تماس با ارسال SMTP
- فونت و دارایی‌های کاملاً محلی برای عملکرد مناسب در شبکه‌های محدود
- خروجی PHP قابل نصب روی هاست اشتراکی و زیردایرکتوری

### اجرای محلی

به Node.js نسخه 22.13 یا جدیدتر نیاز دارید.

```bash
git clone https://github.com/onwebs-dev/content-bridge.git
cd content-bridge
npm install
npm run dev
```

سایت در `http://localhost:3000` در دسترس است. برای بررسی نسخه نهایی اجرا کنید:

```bash
npm test
```

### تنظیم ایمیل

رمز SMTP از متغیر `SMTP_PASSWORD` خوانده می‌شود. برای توسعه محلی فایل `.dev.vars.example` را با نام `.dev.vars` کپی کنید و هیچ‌وقت رمز واقعی را commit نکنید. تنظیمات میزبان، فرستنده و گیرنده در `worker/index.ts` قابل شخصی‌سازی است.

برای ساخت خروجی هاست اشتراکی، سرور توسعه را روشن نگه دارید و اجرا کنید:

```bash
npm run build
npm run build:shared-host
```

رمز واقعی SMTP را فقط داخل فایل `config.php` تولیدشده روی سرور وارد کنید. خروجی، مسیر نصب و زیردایرکتوری را خودکار تشخیص می‌دهد.

### مشارکت

Issue و Pull Request پذیرفته می‌شود. قبل از ارسال تغییر، [راهنمای مشارکت](./CONTRIBUTING.md) را بخوانید.

### مجوز

این پروژه توسط [ONWEBS](https://github.com/onwebs-dev) و سپهر فتحی با [مجوز MIT](./LICENSE) منتشر شده است.
