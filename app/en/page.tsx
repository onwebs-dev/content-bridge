"use client";

import { FormEvent, useState } from "react";
import { useScrollReveal } from "../useScrollReveal";

const processSteps = [
  { number: "01", title: "Audit and discovery", text: "We crawl the site, map existing content, review competitors and surface technical constraints." },
  { number: "02", title: "Keyword strategy", text: "Search demand, intent and SERP overlap become a keyword universe your business can realistically own." },
  { number: "03", title: "Editorial system", text: "Every article gets a date, target query, structure, internal links, evidence and a clear next action." },
  { number: "04", title: "Connect and publish", text: "Content Bridge connects to WordPress and executes the approved plan on a controlled schedule." },
];

const features = [
  { icon: "SEO", title: "Every SEO field filled", text: "SEO title, meta description, focus keyword, cover image, alt text, canonical and schema arrive complete." },
  { icon: "TAG", title: "Intent-aware taxonomy", text: "The system understands topic and search intent, then assigns the right categories and tags without taxonomy sprawl." },
  { icon: "1×", title: "Publish once, ever", text: "Every article has an external ID. Re-running a workflow updates the post instead of creating a competing duplicate." },
  { icon: "LINK", title: "Purposeful internal links", text: "Articles connect to relevant service pages and earlier content so authority compounds around commercial topics." },
  { icon: "TIME", title: "Controlled publishing cadence", text: "Publishing speed follows the site's authority and crawl capacity—never a burst of low-value AI pages." },
  { icon: "LOG", title: "Loud failures, clear reports", text: "Every run states what was written, updated, skipped or stopped. Nothing silently disappears from the calendar." },
];

const plans = [
  {
    name: "Essential",
    eyebrow: "Consistent publishing",
    price: "5",
    description: "For businesses ready to turn an occasional blog into a dependable publishing operation.",
    features: ["Dedicated site connection and setup", "Monthly editorial calendar", "Brand voice, audience and CTA rules", "Topic, intent, tag and category detection", "Scheduled WordPress blog publishing", "Cover image and essential SEO fields", "Duplicate protection and run reports"],
  },
  {
    name: "Silver",
    eyebrow: "Multi-channel presence",
    price: "10",
    featured: true,
    description: "For brands that want their website and LinkedIn to grow with one consistent editorial voice.",
    features: ["Everything in Essential", "Complete article publishing on your site", "LinkedIn page connection and setup", "Article-to-LinkedIn post adaptation", "Scheduled LinkedIn publishing", "Cross-channel tone consistency", "Monthly calendar review and refinement"],
  },
  {
    name: "Gold",
    eyebrow: "Professional organic growth",
    price: "15",
    description: "For teams that need a serious SEO programme behind their automated content creation.",
    features: ["Everything in Silver", "Professional content and SEO audit", "Deep keyword research and clustering", "Topic architecture and internal-link map", "Metadata, schema and article optimisation", "Opportunity monitoring and calendar steering", "Monthly analysis and strategy session"],
  },
];

const faqs = [
  { q: "What if our website is custom-coded rather than WordPress?", a: "We review the project's architecture and build the connector script, authentication, field mapping and publishing logic specifically for that website." },
  { q: "Is this just another AI content generator?", a: "No. A generator writes text. Content Bridge combines human-led strategy, keyword research, editorial planning, WordPress automation and ongoing oversight." },
  { q: "Which WordPress SEO plugins are supported?", a: "Content Bridge writes the correct fields for Yoast, Rank Math, SEOPress and All in One SEO." },
  { q: "How many articles will it publish each month?", a: "There is no reckless default. We recommend cadence from your domain authority, competition, existing content and crawl capacity." },
  { q: "What does the GEO add-on include?", a: "It shapes content for generative and answer engines using direct answers, question-led headings, clear entities, structured data and self-contained quotable passages." },
  { q: "Do you guarantee rankings or traffic?", a: "No credible provider can. We guarantee the process we control: sound strategy, consistent execution, complete publishing and transparent reporting." },
];

type FormStatus = "idle" | "sending" | "success" | "error";

export default function EnglishHome() {
  useScrollReveal();
  const [selectedPlan, setSelectedPlan] = useState("Silver");
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
      const response = await fetch("/api/contact?lang=en", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "We could not send your request.");
      setStatus("success");
      setFeedback("Your request is in. We will review your site and get in touch shortly.");
      form.reset();
      setSelectedPlan("Silver");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="lang-en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Content Bridge Automated WordPress Content Creation",
        alternateName: "Managed AI Content Automation",
        description: "A managed content engine combining strategy, keyword research, editorial planning, automated article creation, WordPress publishing and SEO completion.",
        provider: { "@type": "Organization", name: "Vira Web Aria", email: "ceo@onwebs.ir" },
        serviceType: ["Automated content creation", "AI content automation", "WordPress article publishing", "Custom-coded website content automation", "Custom integration scripts", "Content SEO", "GEO"],
        offers: plans.map((plan, index) => ({ "@type": "Offer", name: `${plan.name} Content Bridge plan`, price: ["50000000", "100000000", "150000000"][index], priceCurrency: "IRR", description: plan.description })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
      }) }} />

      <nav className="nav" aria-label="Main navigation">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="Content Bridge home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Content Bridge</span></a>
          <div className="nav-links"><a href="#process">Process</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div>
          <a className="language-switch" href="/" hrefLang="fa" aria-label="مشاهده نسخه فارسی">فا</a>
          <a className="button button-small" href="#contact">Start a project <span aria-hidden="true">→</span></a>
        </div>
      </nav>

      <section className="hero section" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <span className="pill"><i /> Managed AI content automation for WordPress</span>
            <h1>We build the strategy.<br /><em>Your content publishes itself.</em></h1>
            <p>Content Bridge is more than an automated content generator. We audit your site, map real search demand and build the editorial plan—then complete articles publish to WordPress with the image, metadata, tags and internal links already in place.</p>
            <div className="hero-actions"><a className="button" href="#pricing">Explore the plans <span aria-hidden="true">→</span></a><a className="text-link" href="#process">See how it works <span aria-hidden="true">↓</span></a></div>
            <div className="compatibility"><span>Works with</span><b>Yoast</b><b>Rank Math</b><b>SEOPress</b><b>AIOSEO</b></div>
          </div>

          <div className="hero-visual reveal reveal-delay" aria-label="Content strategy and publishing workflow">
            <div className="paper-card">
              <div className="paper-head"><div><span className="paper-kicker">EDITORIAL CALENDAR</span><strong>This month&apos;s plan</strong></div><span className="live-status"><i /> Running</span></div>
              <div className="mini-timeline">
                <div className="mini-row complete"><span>Site and market audit</span><b>DONE</b></div>
                <div className="mini-row complete"><span>Keyword clustering</span><b>DONE</b></div>
                <div className="mini-row active"><span>Calendar and briefs</span><b>ACTIVE</b></div>
                <div className="mini-row"><span>Automated publishing</span><b>SCHEDULED</b></div>
              </div>
              <div className="article-preview"><span className="article-date">Today, 10:30</span><div className="article-lines"><i /><i /><i /></div><span className="published-dot">Ready to publish</span></div>
              <div className="paper-foot"><span><b>6 months</b> mapped</span><span><b>100%</b> complete fields</span><span><b>0</b> repeated work</span></div>
            </div>
            <span className="floating-note note-one">Taxonomy ready ✓</span><span className="floating-note note-two">Metadata complete ✓</span>
          </div>
        </div>
      </section>

      <section className="trust-strip"><div className="container trust-inner"><p>More content is not the goal. <strong>The right content, published consistently,</strong> becomes an asset.</p><div className="trust-points"><span>No copy-paste</span><span>No duplicate posts</span><span>No silent failures</span></div></div></section>

      <section className="section problem-section">
        <div className="container narrow">
          <span className="section-label">The problem we solve</span><h2>Content publishing should not restart from zero every week.</h2><p className="lead">Most automated blogging workflows break in the same three places. Content Bridge was designed around removing all three.</p>
          <div className="problem-grid">
            <article><span>01</span><h3>Half-finished articles</h3><p>The draft exists, but the cover, metadata, keyword and internal links still need someone to finish the job.</p></article>
            <article><span>02</span><h3>Content without demand</h3><p>Pages get produced, but not for genuine search intent and not in support of the site's revenue-driving services.</p></article>
            <article><span>03</span><h3>Inconsistent execution</h3><p>Three posts in one week, then silence for a month. That creates a scattered archive—not a content engine.</p></article>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="section-heading split-heading"><div><span className="section-label">Our process</span><h2>Before the first article, we build the system.</h2></div><p>Automation is the final step, not the whole product. Discovery, research and editorial judgement are what make automated content worth publishing.</p></div>
          <div className="process-list">{processSteps.map((step, index) => <article className={index === 3 ? "process-item automation" : "process-item"} key={step.number}><span className="process-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><span className="process-arrow" aria-hidden="true">→</span></article>)}</div>
        </div>
      </section>

      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-heading centered"><span className="section-label">The details that matter</span><h2>All the small content tasks your team no longer has to carry.</h2><p>From choosing the topic to confirming publication, every step is defined, visible and adapted to your WordPress site.</p></div>
          <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><span className="feature-icon">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
          <div className="promise-card"><div className="promise-mark" aria-hidden="true">“</div><div><span className="section-label">Our honest promise</span><h3>We do not guarantee rankings. We guarantee a sound process and consistent execution.</h3></div><p>No healthy SEO service can promise Google's outcome. We build the strategy, content infrastructure and publishing standards that can be controlled and measured.</p></div>
          <div className="custom-site-card"><div className="custom-site-code" aria-hidden="true"><span>&lt;/&gt;</span><i /><i /><i /></div><div className="custom-site-copy"><span className="section-label">Not running WordPress?</span><h3>Custom-coded websites get a purpose-built script and integration setup.</h3><p>We review your architecture, APIs, authentication, database and content model, then develop and test publishing logic around your actual infrastructure.</p><div className="custom-site-tags"><span>Custom connector script</span><span>API and field mapping</span><span>Publishing and duplicate controls</span><span>Server-level testing</span></div></div><a className="custom-site-link" href="#contact">Technical discovery <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-heading centered pricing-heading"><span className="section-label">Monthly plans</span><h2>From consistent publishing to professional organic growth.</h2><p>Choose the operating level that fits your current stage. The content engine can grow with your team.</p></div>
          <div className="pricing-grid">{plans.map((plan) => <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>{plan.featured && <span className="popular">Recommended</span>}<span className="plan-eyebrow">{plan.eyebrow}</span><h3>{plan.name}</h3><div className="price"><strong>{plan.price}</strong><span>million Toman<br />per month</span></div><p className="plan-description">{plan.description}</p><ul>{plan.features.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><button className={plan.featured ? "button plan-button" : "button button-secondary plan-button"} onClick={() => choosePlan(plan.name)}>Choose {plan.name} <span aria-hidden="true">→</span></button></article>)}</div>
          <div className="geo-card"><div className="geo-badge">GEO<span>+</span></div><div className="geo-copy"><span className="section-label">Optional add-on for every plan</span><h3>Optimisation for generative search and answer engines</h3><p>Direct answers, question-led structure, clear entities, structured data and quotable passages—so your content is easier for ChatGPT, Gemini and AI search experiences to understand and cite.</p><div className="geo-tags"><span>Direct answers</span><span>Question structure</span><span>Entity and schema</span><span>Quotable passages</span></div></div><div className="geo-price"><strong>+5</strong><span>million Toman<br />per month</span></div></div>
          <p className="pricing-note">Prices are monthly. Final scope and publishing cadence are confirmed after the initial site review.</p>
        </div>
      </section>

      <section className="section faq-section" id="faq"><div className="container faq-grid"><div className="faq-intro"><span className="section-label">Frequently asked questions</span><h2>What teams usually ask before we begin.</h2><p>The short answers are here. Use the form below when you want us to review your specific setup.</p></div><div className="faq-list">{faqs.map((faq, index) => <article key={faq.q}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{faq.q}</h3><p>{faq.a}</p></div></article>)}</div></div></section>

      <section className="section contact-section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy"><span className="section-label light">Start a project</span><h2>Let&apos;s find the content system that makes sense for your site.</h2><p>Complete the form in under two minutes. We will review your website and arrange a short conversation around the most sensible next step.</p><div className="contact-points"><span><i>1</i> Initial site review</span><span><i>2</i> Plan and cadence recommendation</span><span><i>3</i> Practical launch roadmap</span></div><p className="no-pressure">No obligation. If Content Bridge is not a good fit, we will say so clearly.</p></div>
          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-head"><div><span>PROJECT ENQUIRY</span><strong>Take the first step.</strong></div><span className="form-time">About 2 minutes</span></div>
            <div className="field-grid"><label><span>Full name *</span><input name="name" required autoComplete="name" placeholder="e.g. Sara Ahmadi" maxLength={80} /></label><label><span>Phone number *</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="+98 912 123 4567" maxLength={30} /></label></div>
            <div className="field-grid"><label><span>Email *</span><input name="email" type="email" required autoComplete="email" placeholder="name@company.com" maxLength={120} /></label><label><span>Website</span><input name="website" inputMode="url" placeholder="example.com" maxLength={160} /></label></div>
            <label><span>Plan you are considering</span><select name="plan" value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)}><option>Essential</option><option>Silver</option><option>Gold</option><option>I need help choosing</option></select></label>
            <label className="check-field"><input type="checkbox" name="geo" value="Yes" /><span><b>Add GEO optimisation</b><small>Adds 5 million Toman per month.</small></span></label>
            <label><span>Tell us about your current content setup or goal</span><textarea name="message" rows={4} maxLength={1200} placeholder="For example: how often do you publish now, and what is the biggest bottleneck?" /></label>
            <input className="honey" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="button submit-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry and start the conversation"}<span aria-hidden="true">→</span></button>
            {feedback && <p className={`form-feedback ${status}`} role="status">{feedback}</p>}<p className="privacy">Your details are used only to respond to this enquiry.</p>
          </form>
        </div>
      </section>

      <footer><div className="container footer-inner"><a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Content Bridge<small>A Vira Web Aria product</small></span></a><p>Strategy, planning and automated WordPress content publishing.</p><a href="mailto:ceo@onwebs.ir">ceo@onwebs.ir</a></div></footer>
    </main>
  );
}
