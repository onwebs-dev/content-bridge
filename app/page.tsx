"use client";

import { FormEvent, useState } from "react";

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
    name: "اقتصادی",
    eyebrow: "شروع منظم",
    price: "۵",
    description: "برای کسب‌وکارهایی که می‌خواهند انتشار وبلاگ را از حالت مقطعی خارج کنند.",
    features: [
      "اتصال و پیکربندی اختصاصی سایت",
      "برنامه‌ریزی تقویم محتوایی ماهانه",
      "شخصی‌سازی لحن، مخاطب و دعوت به اقدام",
      "شناخت موضوع، نیت جست‌وجو، تگ و دسته",
      "انتشار منظم در وبلاگ وردپرس",
      "تنظیم تصویر شاخص و فیلدهای پایه سئو",
      "کنترل محتوای تکراری و گزارش اجرا",
    ],
  },
  {
    name: "نقره‌ای",
    eyebrow: "حضور چندکاناله",
    price: "۱۰",
    featured: true,
    description: "برای برندهایی که می‌خواهند سایت و لینکدین با یک صدای منسجم رشد کنند.",
    features: [
      "تمام امکانات پلن اقتصادی",
      "انتشار مقاله کامل روی سایت",
      "اتصال و پیکربندی صفحه لینکدین",
      "تبدیل هر مقاله به پست مناسب لینکدین",
      "انتشار زمان‌بندی‌شده پست‌های لینکدین",
      "هماهنگ‌سازی لحن در سایت و شبکه اجتماعی",
      "بازبینی و بهینه‌سازی برنامه در پایان ماه",
    ],
  },
  {
    name: "طلایی",
    eyebrow: "رشد حرفه‌ای",
    price: "۱۵",
    description: "برای تیم‌هایی که علاوه بر انتشار، یک برنامه جدی و مداوم سئو می‌خواهند.",
    features: [
      "تمام امکانات پلن نقره‌ای",
      "ممیزی حرفه‌ای محتوا و سئوی سایت",
      "تحقیق و خوشه‌بندی عمیق کلمات کلیدی",
      "نقشه لینک‌سازی داخلی و معماری موضوعی",
      "بهینه‌سازی متا، اسکیما و ساختار مقاله",
      "پایش فرصت‌ها و بازطراحی تقویم محتوا",
      "گزارش تحلیلی ماهانه و جلسه راهبری",
    ],
  },
];

const faqs = [
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
  {
    q: "آیا نتیجه یا رتبه گوگل تضمین می‌شود؟",
    a: "خیر؛ رتبه به عوامل متعددی وابسته است. چیزی که تضمین می‌کنیم اجرای منظم فرایند، تکمیل استانداردهای محتوا و گزارش شفاف هر انتشار است.",
  },
];

type FormStatus = "idle" | "sending" | "success" | "error";

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState("نقره‌ای");
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
      setSelectedPlan("نقره‌ای");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <main>
      <nav className="nav" aria-label="ناوبری اصلی">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="کانتنت بریج، صفحه اصلی">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Content Bridge</span>
          </a>
          <div className="nav-links">
            <a href="#process">فرایند</a>
            <a href="#features">امکانات</a>
            <a href="#pricing">پلن‌ها</a>
            <a href="#faq">پرسش‌ها</a>
          </div>
          <a className="button button-small" href="#contact">شروع پروژه <span aria-hidden="true">←</span></a>
        </div>
      </nav>

      <section className="hero section" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <span className="pill"><i /> استراتژی محتوا و انتشار هوشمند برای وردپرس</span>
            <h1>استراتژی را ما می‌سازیم؛<br /><em>محتوا خودش منتشر می‌شود.</em></h1>
            <p>
              سایت را می‌شناسیم، مسیر کلمات کلیدی را طراحی می‌کنیم و یک تقویم محتوایی قابل اجرا می‌سازیم؛ سپس Content Bridge همه‌چیز را با تصویر، متا، تگ و لینک‌های درست، سر وقت منتشر می‌کند.
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
            <article><span>۰۱</span><h3>مقاله نیمه‌کاره</h3><p>متن آماده است اما تصویر، متا، کلیدواژه و لینک‌ها خالی مانده‌اند؛ پس انتشار عقب می‌افتد.</p></article>
            <article><span>۰۲</span><h3>موضوع‌های بی‌هدف</h3><p>محتوا تولید می‌شود، اما نه برای تقاضای واقعی بازار و نه در خدمت صفحات درآمدزای سایت.</p></article>
            <article><span>۰۳</span><h3>اجرای نامنظم</h3><p>یک هفته سه مقاله و بعد یک ماه سکوت. نتیجه، آرشیوی پراکنده است نه یک موتور رشد.</p></article>
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
            <div><span className="section-label">قول صادقانه ما</span><h3>رتبه تضمین نمی‌کنیم؛ فرایند درست و اجرای منظم را تضمین می‌کنیم.</h3></div>
            <p>هیچ ابزار سالمی نمی‌تواند رتبه گوگل را قول بدهد. ما زیرساخت، محتوا و استانداردهایی را می‌سازیم که قابل کنترل و اندازه‌گیری‌اند.</p>
          </div>
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-heading centered pricing-heading">
            <span className="section-label">پلن‌های ماهانه</span>
            <h2>از انتشار منظم تا رشد حرفه‌ای.</h2>
            <p>هر پلن برای یک مرحله از بلوغ محتوایی طراحی شده است. هر زمان لازم باشد، می‌توانید سطح خدمات را ارتقا دهید.</p>
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
            <label><span>پلن موردنظر</span><select name="plan" value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)}><option>اقتصادی</option><option>نقره‌ای</option><option>طلایی</option><option>برای انتخاب نیاز به مشاوره دارم</option></select></label>
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
