"use client";

import { FormEvent, useState } from "react";
import { useScrollReveal } from "./useScrollReveal";

const processSteps = [
  {
    number: "۰۱",
    title: "شناخت و ممیزی",
    text: "ساختار سایت، محتوای فعلی، رقبا و موانع فنی را بررسی می‌کنیم.",
  },
  {
    number: "۰۲",
    title: "نقشه کلمات کلیدی",
    text: "تقاضا، نیت جست‌وجو و خوشه‌های موضوعی را به فرصت‌های قابل اجرا تبدیل می‌کنیم.",
  },
  {
    number: "۰۳",
    title: "تقویم محتوایی",
    text: "برای هر محتوا، موضوع، تاریخ، ساختار، لینک‌ها و اقدام بعدی مشخص می‌شود.",
  },
  {
    number: "۰۴",
    title: "اتصال و انتشار",
    text: "Content Bridge به وردپرس متصل می‌شود و انتشار طبق برنامه جلو می‌رود.",
  },
];

const features = [
  {
    icon: "متا",
    title: "هر فیلد، کامل",
    text: "عنوان سئو، توضیحات متا، کلیدواژه کانونی، تصویر شاخص، متن جایگزین و اسکیما فراموش نمی‌شوند.",
  },
  {
    icon: "تگ",
    title: "تگ و دسته‌بندی هوشمند",
    text: "موضوع و نیت جست‌وجو شناخته می‌شود تا هر مقاله دقیقاً در جای درست سایت بنشیند.",
  },
  {
    icon: "۱×",
    title: "بدون محتوای تکراری",
    text: "هر محتوا شناسه یکتا دارد؛ اجرای دوباره، مطلب تازه و رقیب برای صفحه قبلی نمی‌سازد.",
  },
  {
    icon: "لینک",
    title: "لینک‌سازی داخلی هدفمند",
    text: "مقاله‌ها به صفحات خدمات و محتواهای مرتبط متصل می‌شوند تا اعتبار موضوعی پراکنده نشود.",
  },
  {
    icon: "زمان",
    title: "انتشار منظم و کنترل‌شده",
    text: "سرعت انتشار بر اساس ظرفیت واقعی سایت تعیین می‌شود؛ خبری از موج محتوای اسپم نیست.",
  },
  {
    icon: "گزارش",
    title: "خطاهای واضح، گزارش شفاف",
    text: "هر اجرا مشخص می‌کند چه چیزی منتشر، به‌روزرسانی یا متوقف شده است؛ شکست بی‌صدا نداریم.",
  },
];

const plans = [
  {
    name: "پایه",
    eyebrow: "شروع حرفه‌ای",
    price: "۹",
    description: "برای کسب‌وکارهایی که می‌خواهند وبلاگشان با استراتژی درست و سئوی کامل، منظم منتشر شود.",
    features: [
      "ممیزی کامل ساختار، محتوا و سلامت فنی سایت",
      "بررسی رقبا و شناسایی شکاف‌های محتوایی",
      "تحقیق کلمات کلیدی و خوشه‌بندی براساس نتایج واقعی جست‌وجو",
      "تحلیل نیت جست‌وجو و تعیین قالب هر مقاله",
      "تقویم محتوای شش‌ماهه با تاریخ مشخص برای هر مقاله",
      "بریف اختصاصی: کلیدواژه، ساختار تیترها و طول هدف",
      "نصب و پیکربندی افزونه روی سایت شما",
      "رفع مشکلات سرور و ناسازگاری‌های هاست",
      "انتشار خودکار و زمان‌بندی‌شده روی وردپرس",
      "تکمیل فیلدهای Yoast، Rank Math، SEOPress یا AIOSEO",
      "عنوان سئو، متا، کلیدواژه اصلی و کلیدواژه‌های فرعی",
      "دسته و برچسب هوشمند، ساخته‌شده در صورت نبود",
      "لینک‌سازی داخلی هدفمند در دل جملات",
      "سؤالات پرتکرار همراه اسکیمای FAQ",
      "کنترل محتوای تکراری با شناسه اختصاصی",
      "گزارش شفاف اجرا و خطاها",
      "بازبینی ماهانه و اصلاح مسیر",
    ],
  },
  {
    name: "حرفه‌ای",
    eyebrow: "کامل‌ترین نسبت ارزش",
    price: "۱۲",
    featured: true,
    description: "همه‌ی پلن پایه، به‌علاوه‌ی تصویر شاخص اختصاصی برای هر مقاله با هویت بصری برند شما.",
    features: [
      "تمام امکانات پلن پایه",
      "بنر اختصاصی هر مقاله با پالت و فونت برند",
      "ترکیب بصری متناسب با موضوع؛ بدون تصویر تکراری",
      "ابعاد استاندارد و سازگار با قالب سایت",
      "فرمت بهینه برای پیش‌نمایش شبکه‌های اجتماعی",
      "متن جایگزین توصیفی برای سئو و دسترس‌پذیری",
      "ثبت خودکار در کتابخانه رسانه با عنوان و توضیح",
      "تنظیم Open Graph برای اشتراک‌گذاری درست",
      "کیت بصری اختصاصی برند در مرحله راه‌اندازی",
      "بهینه‌سازی حجم تصویر برای سرعت صفحه",
    ],
  },
  {
    name: "کامل",
    eyebrow: "حضور چندکاناله",
    price: "۱۷",
    description: "همه‌ی پلن حرفه‌ای، به‌علاوه‌ی انتشار خودکار روی لینکدین با لحن و زمان‌بندی مناسب همان پلتفرم.",
    features: [
      "تمام امکانات پلن حرفه‌ای",
      "اتصال و راه‌اندازی کامل لینکدین",
      "تبدیل هر مقاله به پستی مستقل، نه خلاصه فهرست‌وار",
      "کپشن با لحن مناسب لینکدین و نام همان نویسنده",
      "قلاب اول اختصاصی برای هر پست",
      "کارت پیش‌نمایش لینک با تصویر درست",
      "زمان‌بندی انتشار متناسب با مخاطب",
      "هماهنگی لحن میان سایت و شبکه اجتماعی",
      "هشتگ‌گذاری متناسب با موضوع",
      "مدیریت و تمدید دوره‌ای دسترسی لینکدین",
      "پشتیبانی از چند نویسنده روی پروفایل‌های جدا",
      "گزارش عملکرد انتشار در هر دو کانال",
    ],
  },
];

const sharedPlanFeatures = ["ممیزی و استراتژی کامل", "تحقیق کلمات کلیدی", "تقویم شش‌ماهه", "نصب و پیکربندی افزونه", "تکمیل فیلدهای سئو", "جلوگیری از محتوای تکراری", "گزارش شفاف اجرا", "بازبینی ماهانه و اصلاح مسیر"];

const labourRows = [
  ["ممیزی، تحقیق کلمات کلیدی و استراتژی", "نگارش پیش‌نویس مقاله"],
  ["تقویم شش‌ماهه و بریف هر مقاله", "اجرای دقیق بریف"],
  ["فایل واقعیت‌ها و ادعاهای مجاز", "ماندن در محدوده همان داده‌ها"],
  ["انتخاب نویسنده و لحن", "نوشتن با همان صدا"],
  ["تصمیم درباره ریتم و اولویت", "انتشار طبق برنامه"],
  ["خواندن تغییرات الگوریتم", "—"],
  ["بازبینی ماهانه و اصلاح مسیر", "—"],
];

const agentCapabilities = [
  ["موضوع روز را می‌سنجد", "از تقویم جلو می‌رود؛ اما اگر خبر واقعاً مرتبطی منتشر شود، اول آن را پوشش می‌دهد و بعد به برنامه برمی‌گردد."],
  ["واقعیت نمی‌سازد", "هر عدد باید از فایل واقعیت‌های تأییدشده شما بیاید؛ اگر داده‌ای وجود نداشته باشد، ادعای عددی منتشر نمی‌شود."],
  ["با صدای یک فرد واقعی می‌نویسد", "نویسنده براساس موضوع انتخاب می‌شود و تجربه‌های واقعی همان فرد، لحن و جمع‌بندی مقاله را شکل می‌دهد."],
  ["ریتم متن را تغییر می‌دهد", "طول جمله، شروع پاراگراف و لحن جمع‌بندی متنوع می‌شود تا خروجی یکنواخت و ماشینی نباشد."],
  ["لینک داخلی را با هدف می‌سازد", "در دل جمله به صفحات خدمات و مقاله‌های مرتبط لینک می‌دهد؛ نه در یک فهرست بی‌ارتباط انتهای متن."],
  ["مرز اختیارش را می‌داند", "ایجنت پیش‌نویس می‌سازد؛ انتشار، آرشیو و تغییر تقویم در اختیار اسکریپت‌های قطعی و قابل گزارش است."],
];

const sixMonthSteps = [
  ["ماه ۱", "زیرساخت", "اتصال و آزمون کامل می‌شود، تقویم وارد اجرا می‌شود و انتشار دیگر به یادآوری دستی وابسته نیست."],
  ["ماه ۲", "ایندکس و اولین سیگنال‌ها", "صفحه‌ها وارد ایندکس می‌شوند و Search Console عبارت‌های طولانی و پرسش‌محور را نشان می‌دهد."],
  ["ماه ۳", "شکل‌گیری خوشه موضوعی", "لینک‌های داخلی مقاله‌ها را دور خدمات اصلی جمع می‌کنند و موضوع‌ها از حالت پراکنده خارج می‌شوند."],
  ["ماه‌های ۴ و ۵", "اثر انباشته", "محتواهای قدیمی‌تر داده می‌سازند، صفحات خدمات از لینک‌های هدفمند نیرو می‌گیرند و مسیر ماه بعد دقیق‌تر می‌شود."],
  ["ماه ۶", "بازطراحی با داده واقعی", "خوشه‌های مؤثر، پرسش‌های ارزشمند و فرصت‌های جدید مشخص می‌شوند و تقویم برای دوره بعد بازچینی می‌شود."],
];

const guardrails = [
  ["ریتم اختصاصی هر سایت", "سقف انتشار از اعتبار دامنه، رقابت، محتوای موجود و سرعت خزش تعیین می‌شود."],
  ["بدون عدد ساختگی", "ایجنت فقط از فایل واقعیت‌های تأییدشده شما عدد و ادعا برمی‌دارد."],
  ["بدون هم‌پوشانی کم‌ارزش", "موضوع مشابه با محتوای موجود، زاویه تازه می‌گیرد یا از برنامه حذف می‌شود."],
  ["پیش‌نویس به‌صورت پیش‌فرض", "انتشار مستقیم تا زمانی که شما فعالش نکنید خاموش می‌ماند."],
  ["توقف امن هنگام خطا", "اگر بررسی محتوای موجود ممکن نباشد، اجرا متوقف می‌شود تا مطلب تکراری ساخته نشود."],
];

const faqs = [
  {
    q: "اگر سایت ما وردپرسی یا CMS آماده نباشد چه می‌شود؟",
    a: "برای سایت‌های کدنویسی‌شده، معماری پروژه بررسی و اسکریپت اتصال، احراز هویت، نگاشت فیلدها و منطق انتشار دقیقاً متناسب با همان سایت طراحی و تنظیم می‌شود.",
  },
  {
    q: "آیا فقط یک ابزار تولید محتوا می‌خریم؟",
    a: "خیر. ارزش اصلی در شناخت سایت، طراحی برنامه و نظارت انسانی است. اتصال و انتشار خودکار، مرحله آخر این فرایند است.",
  },
  {
    q: "از چه افزونه‌های سئویی پشتیبانی می‌شود؟",
    a: "Content Bridge با Yoast، Rank Math، SEOPress و All in One SEO کار می‌کند و فیلدهای هرکدام را در جای درست می‌نویسد.",
  },
  {
    q: "تعداد مقاله‌ها در ماه چقدر است؟",
    a: "تعداد ثابت و کورکورانه تعیین نمی‌کنیم. ریتم انتشار با توجه به وضعیت دامنه، رقابت موضوعات و ظرفیت خزش سایت پیشنهاد می‌شود.",
  },
  {
    q: "GEO دقیقاً چه چیزی به پلن اضافه می‌کند؟",
    a: "محتوا برای دیده‌شدن و نقل‌شدن در موتورهای پاسخ‌گو و جست‌وجوی مولد آماده می‌شود؛ با پاسخ‌های مستقیم، ساختار پرسش‌محور، داده‌های قابل استناد و بخش‌های مستقل.",
  },
];

type FormStatus = "idle" | "sending" | "success" | "error";

export default function Home() {
  useScrollReveal();
  const [selectedPlan, setSelectedPlan] = useState("حرفه‌ای");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [startedAt] = useState(() => Date.now());

  const choosePlan = (plan: string) => {
    setSelectedPlan(plan);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "ارسال فرم انجام نشد.");
      }

      setStatus("success");
      setFeedback("درخواست شما ثبت شد. خیلی زود برای یک گفت‌وگوی کوتاه با شما تماس می‌گیریم.");
      form.reset();
      setSelectedPlan("حرفه‌ای");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <main className="lang-fa">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Content Bridge — محتواساز خودکار وردپرس",
            alternateName: "سرویس تولید و انتشار خودکار محتوا",
            description: "استراتژی محتوا، تحقیق کلمات کلیدی، برنامه‌ریزی و تولید و انتشار خودکار مقاله در وردپرس با تکمیل فیلدهای سئو.",
            provider: { "@type": "Organization", name: "ویرا وب آریا", email: "ceo@onwebs.ir" },
            areaServed: "IR",
            serviceType: ["تولید محتوای خودکار", "اتوماسیون محتوای وردپرس", "اتوماسیون محتوای سایت کدنویسی‌شده", "اسکریپت اتصال اختصاصی", "سئو محتوا", "GEO"],
            offers: plans.map((plan, index) => ({
              "@type": "Offer",
              name: `پلن ${plan.name} Content Bridge`,
              price: ["90000000", "120000000", "170000000"][index],
              priceCurrency: "IRR",
              description: plan.description,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "افزونه وردپرس Content Bridge",
            softwareVersion: "2.1.0",
            applicationCategory: "BusinessApplication",
            operatingSystem: "WordPress 5.6+",
            downloadUrl: "downloads/content-bridge-2.1.0.zip",
            description: "افزونه اتصال امن وردپرس به فرایند تولید و انتشار محتوا با پشتیبانی از سئو، تصویر، دسته‌بندی، FAQ و جلوگیری از انتشار تکراری.",
            author: { "@type": "Organization", name: "ویرا وب آریا" },
            license: "https://www.gnu.org/licenses/gpl-2.0.html",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      <nav className="nav" aria-label="ناوبری اصلی">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="کانتنت بریج، صفحه اصلی">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Content Bridge</span>
          </a>
          <div className="nav-links">
            <a href="#process">فرایند</a>
            <a href="#features">امکانات</a>
            <a href="#download-plugin">افزونه</a>
            <a href="#pricing">پلن‌ها</a>
            <a href="#faq">پرسش‌ها</a>
          </div>
          <a className="language-switch" href="/en" hrefLang="en" aria-label="View the English version">EN</a>
          <a className="button button-small" href="#contact">شروع پروژه <span aria-hidden="true">←</span></a>
        </div>
      </nav>

      <section className="hero section" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <span className="pill"><i /> محتواساز خودکار و استراتژی محتوای وردپرس</span>
            <h1>استراتژی را ما می‌سازیم؛<br /><em>محتوا خودش منتشر می‌شود.</em></h1>
            <p>
              Content Bridge یک محتواساز خودکار ساده نیست؛ سایت را می‌شناسیم، مسیر کلمات کلیدی و تقویم را می‌سازیم، سپس مقاله‌ها با تصویر، متا، تگ و لینک‌های درست، سر وقت در وردپرس منتشر می‌شوند.
            </p>
            <div className="hero-actions">
              <a className="button" href="#pricing">مشاهده پلن‌ها <span aria-hidden="true">←</span></a>
              <a className="text-link" href="#process">ببینید چطور کار می‌کند <span aria-hidden="true">↓</span></a>
            </div>
            <div className="compatibility">
              <span>هماهنگ با</span>
              <b>Yoast</b><b>Rank Math</b><b>SEOPress</b><b>AIOSEO</b>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay" aria-label="نمونه جریان برنامه‌ریزی و انتشار محتوا">
            <div className="paper-card">
              <div className="paper-head">
                <div>
                  <span className="paper-kicker">تقویم محتوایی</span>
                  <strong>برنامه این ماه</strong>
                </div>
                <span className="live-status"><i /> در حال اجرا</span>
              </div>
              <div className="mini-timeline">
                <div className="mini-row complete"><span>شناخت سایت و بازار</span><b>تکمیل</b></div>
                <div className="mini-row complete"><span>خوشه‌بندی کلمات کلیدی</span><b>تکمیل</b></div>
                <div className="mini-row active"><span>تقویم و بریف محتوا</span><b>در جریان</b></div>
                <div className="mini-row"><span>انتشار خودکار</span><b>زمان‌بندی</b></div>
              </div>
              <div className="article-preview">
                <span className="article-date">امروز، ۱۰:۳۰</span>
                <div className="article-lines"><i /><i /><i /></div>
                <span className="published-dot">آماده انتشار</span>
              </div>
              <div className="paper-foot">
                <span><b>۶ ماه</b> برنامه روشن</span>
                <span><b>۱۰۰٪</b> فیلدهای محتوا</span>
                <span><b>۰</b> کار تکراری</span>
              </div>
            </div>
            <span className="floating-note note-one">تگ مناسب ✓</span>
            <span className="floating-note note-two">متا تکمیل شد ✓</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-inner">
          <p>محتوای بیشتر کافی نیست؛ <strong>محتوای درست و منظم</strong> است که یک دارایی می‌سازد.</p>
          <div className="trust-points"><span>بدون کپی‌پیست</span><span>بدون انتشار تکراری</span><span>بدون خطای بی‌صدا</span></div>
        </div>
      </section>

      <section className="section problem-section">
        <div className="container narrow">
          <span className="section-label">مسئله‌ای که حل می‌کنیم</span>
          <h2>انتشار محتوا نباید هر هفته از صفر شروع شود.</h2>
          <p className="lead">بیشتر فرایندهای محتوایی در یکی از این سه نقطه متوقف می‌شوند؛ ما هر سه را از مسیر حذف کرده‌ایم.</p>
          <div className="problem-grid">
            <article><span>۰۱</span><h3>مقاله نیمه‌کاره</h3><p>مقاله منتشر می‌شود اما تصویر شاخص، توضیحات متا و کلیدواژه خالی می‌ماند. یک نفر باید پیشخوان را باز کند و کار را تمام کند؛ و کسی نمی‌کند.</p></article>
            <article><span>۰۲</span><h3>محتوای تکراری</h3><p>یک اجرای دوباره، همان مقاله را دو بار منتشر می‌کند. حالا دو آدرس برای یک کلیدواژه با هم رقابت می‌کنند و هیچ‌کدام برنده نمی‌شوند.</p></article>
            <article><span>۰۳</span><h3>شکست خاموش</h3><p>چیزی خراب می‌شود، اسکریپت «موفق» گزارش می‌دهد و سه هفته بعد می‌فهمید هیچ مقاله‌ای منتشر نشده است.</p></article>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="section-label">فرایند ما</span><h2>پیش از اولین انتشار، مسیر را می‌سازیم.</h2></div>
            <p>اتوماسیون آخرین قدم است، نه تمام محصول. چیزی که کیفیت خروجی را تعیین می‌کند، شناخت، تحقیق و برنامه‌ای است که قبل از آن ساخته‌ایم.</p>
          </div>
          <div className="process-list">
            {processSteps.map((step, index) => (
              <article className={index === 3 ? "process-item automation" : "process-item"} key={step.number}>
                <span className="process-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
                <span className="process-arrow" aria-hidden="true">←</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section responsibility-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="section-label">تقسیم کار واقعی</span><h2>ایجنت پیش‌نویس را می‌نویسد؛ هر چیزی که آن را مؤثر می‌کند با ماست.</h2></div>
            <p>پیش از اتصال اتوماسیون، حدود یک ماه صرف شناخت سایت، نقشه تقاضا و ساخت تقویمی می‌شود که ایجنت باید دقیقاً از آن پیروی کند.</p>
          </div>
          <div className="labour-table-wrap">
            <table className="labour-table">
              <thead><tr><th>تیم Content Bridge</th><th>ایجنت محتوا</th></tr></thead>
              <tbody>{labourRows.map(([human, agent]) => <tr key={human}><td>{human}</td><td>{agent}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="labour-note">ایجنت یک نویسنده بسیار سریع با حافظه کامل از قوانین شماست؛ استراتژی، قضاوت و اصلاح مسیر همچنان انسانی می‌ماند.</p>
        </div>
      </section>

      <section className="section agent-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-label">اجرای هوشمند و منضبط</span>
            <h2>ایجنت فقط کلمه تولید نمی‌کند؛ قواعد کار را اجرا می‌کند.</h2>
            <p>تقویم و بریف از تیم ما می‌آید. لایه اجرا نیز برای واقعیت‌محوری، تنوع، لینک‌سازی و کنترل اختیار، قانون روشن دارد.</p>
          </div>
          <div className="agent-grid">{agentCapabilities.map(([title, text], index) => <article className="agent-card" key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-label">جزئیات مهم</span>
            <h2>کارهای کوچک زیادی که دیگر روی دوش تیم شما نیست.</h2>
            <p>از تصمیم درباره موضوع تا کنترل انتشار، هر مرحله مشخص، قابل پیگیری و متناسب با سایت شماست.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
          <div className="promise-card">
            <div className="promise-mark" aria-hidden="true">“</div>
            <div><span className="section-label">شفافیت از روز اول</span><h3>قبل از شروع، مسیر محتوا و خروجی هر ماه را دقیق می‌بینید.</h3></div>
            <p>موضوع‌ها، تقویم انتشار، وضعیت هر محتوا و گزارش اجرا همیشه روشن است؛ می‌دانید چه کاری، چرا و چه زمانی انجام می‌شود.</p>
          </div>
          <div className="custom-site-card">
            <div className="custom-site-code" aria-hidden="true"><span>&lt;/&gt;</span><i /><i /><i /></div>
            <div className="custom-site-copy">
              <span className="section-label">سایت شما وردپرسی نیست؟</span>
              <h3>برای سایت‌های کدنویسی‌شده، اسکریپت و تنظیمات اختصاصی انجام می‌شود.</h3>
              <p>معماری سایت، API، روش احراز هویت، دیتابیس و مدل محتوای پروژه بررسی می‌شود؛ سپس اتصال و منطق انتشار متناسب با همان زیرساخت توسعه و آزمایش می‌شود.</p>
              <div className="custom-site-tags"><span>اسکریپت اتصال اختصاصی</span><span>نگاشت فیلدها و API</span><span>کنترل انتشار و تکرار</span><span>تست و عیب‌یابی روی سرور</span></div>
            </div>
            <a className="custom-site-link" href="#contact">نیازسنجی فنی <span aria-hidden="true">←</span></a>
          </div>
        </div>
      </section>

      <section className="section plugin-download-section" id="download-plugin">
        <div className="container">
          <div className="plugin-download-card">
            <div className="plugin-download-icon" aria-hidden="true"><span>CB</span><small>WP</small></div>
            <div className="plugin-download-copy">
              <span className="section-label">افزونه رسمی وردپرس</span>
              <h2>اتصال امن سایت به خط تولید و انتشار محتوا.</h2>
              <p>نسخه ۲.۱.۰ مقاله، تصویر شاخص، دسته و تگ، فیلدهای کامل سئو و FAQ را از مسیر امن دریافت می‌کند؛ انتشار دوباره نیز همان مطلب را به‌روزرسانی می‌کند.</p>
              <div className="plugin-download-tags"><span>REST API امن</span><span>ضدتکرار</span><span>Yoast و Rank Math</span><span>گزارش و عیب‌یابی</span></div>
            </div>
            <div className="plugin-download-action">
              <span className="plugin-version">نسخه ۲.۱.۰</span>
              <a className="button plugin-download-button" href="downloads/content-bridge-2.1.0.zip" download>دانلود افزونه <span aria-hidden="true">↓</span></a>
              <small>WordPress 5.6+ · PHP 7.4+</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section seo-proof-section" id="seo-proof">
        <div className="container">
          <div className="section-heading split-heading seo-proof-heading">
            <div><span className="section-label">سئو براساس داده تازه</span><h2>برای جست‌وجوی ۲۰۲۶ ساخته شده؛ نه نسخه قدیمی سئو.</h2></div>
            <p>به‌روزرسانی هسته مارچ ۲۰۲۶ از ۲۷ مارچ تا ۸ اپریل اجرا شد. داده‌های SE Ranking نشان دادند جابه‌جایی نتایج، گسترده‌تر از آپدیت دسامبر بوده است.</p>
          </div>
          <div className="seo-stat-grid">
            <article><strong>۷۹٫۵٪</strong><span>از URLهای سه نتیجه اول تغییر موقعیت داشتند</span></article>
            <article><strong>۲۴٫۱٪</strong><span>از صفحات Top 10 به خارج Top 100 رفتند</span></article>
            <article><strong>۱۲ روز</strong><span>و ۴ ساعت، مدت رسمی انتشار آپدیت</span></article>
          </div>
          <div className="seo-response-grid">
            <div>
              <h3>پاسخ ما به این تغییرات</h3>
              <p>هر مقاله باید چیزی داشته باشد که یک گردآورنده نتواند بازنویسی کند: تجربه واقعی، نویسنده مشخص، داده تأییدشده و ارتباط روشن با خدمات شما.</p>
            </div>
            <ul>
              <li><span>منبع مقصد</span><b>پروژه‌ها، تصمیم‌ها و تجربه‌های واقعی خود شما</b></li>
              <li><span>نویسندگی مشخص</span><b>نام واقعی و تخصص مرتبط با موضوع</b></li>
              <li><span>ادعای قابل اتکا</span><b>هر عدد فقط از فایل واقعیت‌های تأییدشده</b></li>
              <li><span>ساختار قابل فهم</span><b>پاسخ مستقیم، FAQ، اسکیما و لینک داخلی هدفمند</b></li>
            </ul>
          </div>
          <div className="source-links"><span>منابع:</span><a href="https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history?success=true" target="_blank" rel="noreferrer">Google Search Status</a><a href="https://searchengineland.com/march-2026-google-core-update-what-changed-474397" target="_blank" rel="noreferrer">SE Ranking via Search Engine Land</a></div>
        </div>
      </section>

      <section className="section roadmap-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-label">مسیر شش‌ماهه</span>
            <h2>هر ماه، یک لایه قابل اندازه‌گیری به سیستم اضافه می‌شود.</h2>
            <p>تقویم ثابت و بی‌انعطاف نیست؛ با داده‌های واقعی سایت جلو می‌رود و در پایان دوره برای مرحله بعد بازطراحی می‌شود.</p>
          </div>
          <div className="roadmap-list">{sixMonthSteps.map(([month, title, text], index) => <article className="roadmap-item" key={month}><span className="roadmap-dot">{index + 1}</span><div><small>{month}</small><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="section guardrails-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="section-label">قیدهای عمدی</span><h2>محدودیت‌ها بخشی از محصول‌اند.</h2></div>
            <p>اتوماسیون خوب فقط نمی‌داند چه کاری انجام دهد؛ می‌داند چه زمانی باید متوقف شود، بررسی کند یا تصمیم را به انسان برگرداند.</p>
          </div>
          <div className="guardrail-grid">{guardrails.map(([title, text]) => <article className="guardrail-card" key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-heading centered pricing-heading">
            <span className="section-label">پلن‌ها</span>
            <h2>هر سه پلن، کل کار استراتژی را دارند.</h2>
            <p>ممیزی، تحقیق کلمات کلیدی و تقویم شش‌ماهه در همه پلن‌ها کامل انجام می‌شود؛ تفاوت در خروجی نهایی است، نه در عمق کار.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>
                {plan.featured && <span className="popular">انتخاب پیشنهادی</span>}
                <span className="plan-eyebrow">{plan.eyebrow}</span>
                <h3>{plan.name}</h3>
                <div className="price"><strong>{plan.price}</strong><span>میلیون تومان<br />در ماه</span></div>
                <p className="plan-description">{plan.description}</p>
                <ul>{plan.features.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
                <button className={plan.featured ? "button plan-button" : "button button-secondary plan-button"} onClick={() => choosePlan(plan.name)}>
                  انتخاب پلن {plan.name} <span aria-hidden="true">←</span>
                </button>
              </article>
            ))}
          </div>

          <figure className="banner-samples">
            <div className="banner-samples-copy"><span className="section-label">ارزش بصری پلن حرفه‌ای</span><h3>برای هر مقاله یک بنر تازه، در یک هویت ثابت.</h3><p>موضوع و ترکیب‌بندی تغییر می‌کند؛ پالت، کیفیت و زبان بصری برند شما ثابت می‌ماند.</p></div>
            <img src="/banner-examples.png" alt="سه نمونه بنر اختصاصی برای ممیزی سایت، خوشه‌بندی کلمات کلیدی و انتشار چندکاناله" width="1823" height="863" loading="lazy" />
            <figcaption>نمونه جهت نمایش سطح طراحی است؛ کیت واقعی از رنگ، فونت و قالب سایت هر برند ساخته می‌شود.</figcaption>
          </figure>

          <div className="all-plans-card">
            <div><span className="section-label">در هر سه پلن، بدون استثنا</span><h3>ارزان‌ترین پلن هم یک برنامه کامل است.</h3></div>
            <div className="all-plans-features">{sharedPlanFeatures.map((item) => <span key={item}>{item}</span>)}</div>
            <p>تعداد مقاله‌ها را تیم ما براساس اعتبار دامنه، رقابت کلیدواژه‌ها، محتوای موجود و سرعت خزش سایت تعیین می‌کند. ریتم درست می‌فروشیم، نه انتشار پرحجم و کوتاه‌مدت.</p>
          </div>

          <div className="geo-card">
            <div className="geo-badge">GEO<span>+</span></div>
            <div className="geo-copy">
              <span className="section-label">افزودنی اختیاری برای همه پلن‌ها</span>
              <h3>بهینه‌سازی برای موتورهای پاسخ‌گو و جست‌وجوی مولد</h3>
              <p>ساختار پاسخ‌محور، پرسش‌های واقعی، بلوک‌های قابل استناد و داده‌های شفاف؛ تا محتوای شما برای دیده‌شدن در ChatGPT، Gemini و پاسخ‌های هوش مصنوعی آماده‌تر باشد.</p>
              <div className="geo-tags"><span>پاسخ مستقیم</span><span>ساختار پرسش‌محور</span><span>Entity و Schema</span><span>بخش‌های قابل نقل</span></div>
            </div>
            <div className="geo-price"><strong>+۵</strong><span>میلیون تومان<br />در ماه</span></div>
          </div>
          <p className="pricing-note">هزینه‌ها ماهانه‌اند. دامنه دقیق خدمات و ریتم انتشار پس از بررسی اولیه سایت نهایی می‌شود.</p>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="container faq-grid">
          <div className="faq-intro"><span className="section-label">پرسش‌های رایج</span><h2>قبل از شروع، احتمالاً این‌ها را می‌پرسید.</h2><p>پاسخ کوتاه اینجاست؛ برای بررسی شرایط خاص سایتتان، فرم پایین صفحه را بفرستید.</p></div>
          <div className="faq-list">
            {faqs.map((faq, index) => <article key={faq.q}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{faq.q}</h3><p>{faq.a}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy">
            <span className="section-label light">شروع پروژه</span>
            <h2>بیایید ببینیم کدام مسیر برای سایت شما منطقی‌تر است.</h2>
            <p>فرم را در کمتر از دو دقیقه کامل کنید. سایتتان را بررسی می‌کنیم و برای یک گفت‌وگوی کوتاه با شما هماهنگ می‌شویم.</p>
            <div className="contact-points">
              <span><i>۱</i> بررسی اولیه سایت</span>
              <span><i>۲</i> پیشنهاد پلن و ریتم انتشار</span>
              <span><i>۳</i> نقشه شروع همکاری</span>
            </div>
            <p className="no-pressure">بدون تعهد؛ اگر Content Bridge مناسب شما نباشد، صادقانه می‌گوییم.</p>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-head"><div><span>فرم درخواست مشاوره</span><strong>اولین قدم را بردارید.</strong></div><span className="form-time">حدود ۲ دقیقه</span></div>
            <div className="field-grid">
              <label><span>نام و نام خانوادگی *</span><input name="name" required autoComplete="name" placeholder="مثلاً سارا احمدی" maxLength={80} /></label>
              <label><span>شماره تماس *</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" maxLength={30} /></label>
            </div>
            <div className="field-grid">
              <label><span>ایمیل *</span><input name="email" type="email" required autoComplete="email" placeholder="name@company.com" maxLength={120} dir="ltr" /></label>
              <label><span>آدرس سایت</span><input name="website" inputMode="url" placeholder="example.com" maxLength={160} dir="ltr" /></label>
            </div>
            <label><span>پلن موردنظر</span><select name="plan" value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)}><option>پایه</option><option>حرفه‌ای</option><option>کامل</option><option>برای انتخاب نیاز به مشاوره دارم</option></select></label>
            <label className="check-field"><input type="checkbox" name="geo" value="بله" /><span><b>افزودنی GEO را هم می‌خواهم</b><small>ماهانه ۵ میلیون تومان به پلن اضافه می‌شود.</small></span></label>
            <label><span>درباره وضعیت فعلی محتوا یا هدفتان بنویسید</span><textarea name="message" rows={4} maxLength={1200} placeholder="مثلاً ماهانه چند محتوا منتشر می‌کنید و مهم‌ترین چالش شما چیست؟" /></label>
            <input className="honey" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="button submit-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "در حال ارسال…" : "ارسال درخواست و شروع گفتگو"}<span aria-hidden="true">←</span></button>
            {feedback && <p className={`form-feedback ${status}`} role="status">{feedback}</p>}
            <p className="privacy">اطلاعات شما فقط برای پاسخ به همین درخواست استفاده می‌شود.</p>
          </form>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Content Bridge<small>محصولی از ویرا وب آریا</small></span></a>
          <p>استراتژی محتوا، برنامه‌ریزی و انتشار هوشمند برای وردپرس.</p>
          <a href="mailto:ceo@onwebs.ir" dir="ltr">ceo@onwebs.ir</a>
        </div>
      </footer>
    </main>
  );
}
