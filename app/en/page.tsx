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
    name: "Base",
    eyebrow: "A professional start",
    price: "9",
    description: "For businesses that want a consistently published blog built on sound strategy and complete SEO.",
    features: ["Complete structural, content and technical site audit", "Competitor review and content-gap analysis", "Keyword research and SERP-overlap clustering", "Search-intent analysis and article-format selection", "Dated six-month editorial calendar", "A dedicated brief for every article", "Plugin installation and site configuration", "Hosting and server compatibility fixes", "Automated, scheduled WordPress publishing", "Complete Yoast, Rank Math, SEOPress or AIOSEO fields", "SEO title, meta description and primary and secondary keywords", "Intent-aware categories and tags, created when missing", "Purposeful internal links inside sentences", "FAQ section with FAQPage schema", "Duplicate control through a unique article ID", "Transparent execution and error reports", "Monthly review and course correction"],
  },
  {
    name: "Professional",
    eyebrow: "The strongest value",
    price: "12",
    featured: true,
    description: "Everything in Base, plus a bespoke featured banner for every article using your brand's visual identity.",
    features: ["Everything in Base", "A bespoke banner using your palette and type system", "A topic-specific composition—never a repeated image", "Theme-safe dimensions with no cropped headline", "Optimised social-preview format", "Descriptive alt text for SEO and accessibility", "Automatic media-library registration with title and description", "Open Graph setup for accurate sharing previews", "A dedicated brand visual kit built during onboarding", "Image-size optimisation for faster pages"],
  },
  {
    name: "Complete",
    eyebrow: "Multi-channel presence",
    price: "17",
    description: "Everything in Professional, plus automated LinkedIn publishing with platform-native tone and timing.",
    features: ["Everything in Professional", "Complete LinkedIn connection and setup", "A standalone post for every article—not a list summary", "A LinkedIn-native caption in the article author's voice", "A distinct opening hook for every post", "Correct link-preview card and image", "Audience-aware publishing schedule", "Consistent voice across site and social", "Topic-relevant hashtag selection", "Ongoing LinkedIn access renewal and management", "Multiple authors on separate profiles", "Publishing report across both channels"],
  },
];

const sharedPlanFeatures = ["Complete audit and strategy", "Keyword research", "Six-month calendar", "Plugin installation and setup", "Complete SEO fields", "Duplicate protection", "Transparent execution reports", "Monthly review and course correction"];

const labourRows = [
  ["Audit, keyword research and strategy", "Drafting the article"],
  ["The six-month plan and every brief", "Following the brief"],
  ["The facts file and permitted claims", "Staying inside those facts"],
  ["Author assignment and voice", "Writing in that voice"],
  ["Cadence and priority decisions", "Publishing on schedule"],
  ["Reading algorithm updates", "—"],
  ["Monthly review and course correction", "—"],
];

const agentCapabilities = [
  ["Checks the moment, not just the calendar", "It follows the plan, but can cover a genuinely relevant breaking topic first and return to the calendar afterwards."],
  ["Refuses to invent facts", "Every number must come from your approved facts file. Without a verified figure, it writes qualitatively instead."],
  ["Writes in a real person's voice", "The author is selected by subject and genuine project experience shapes the voice and closing perspective."],
  ["Varies its rhythm", "Sentence length, paragraph openings and closing register change deliberately so the output does not read like a template."],
  ["Links internally with intent", "Service pages and related articles are linked from inside useful sentences—not dumped into an unrelated block."],
  ["Knows what it may not touch", "The agent drafts; deterministic, reportable scripts control publishing, archiving and calendar updates."],
];

const sixMonthSteps = [
  ["Month 1", "Foundation", "The connection and full test are complete, the calendar starts running and publishing no longer depends on manual reminders."],
  ["Month 2", "Indexation and first signals", "Pages enter the index and Search Console begins surfacing long-tail and question-shaped queries."],
  ["Month 3", "Topical shape", "Internal links gather articles around core services, turning isolated pages into visible topic clusters."],
  ["Months 4–5", "Compounding", "Older content produces data, service pages benefit from purposeful links and the next month's direction becomes more precise."],
  ["Month 6", "Data-led reassessment", "The strongest clusters, useful questions and new opportunities are clear enough to rebuild the next calendar."],
];

const guardrails = [
  ["A cadence for your site", "Publishing limits come from authority, competition, existing content and crawl speed."],
  ["No fabricated numbers", "The agent may only use claims and figures from your approved facts file."],
  ["No thin overlap", "A topic that substantially overlaps existing content changes angle or leaves the calendar."],
  ["Draft by default", "Direct publishing remains off until you explicitly enable it."],
  ["Fail closed", "If existing content cannot be checked, the run stops instead of risking a duplicate."],
];

const faqs = [
  { q: "What if our website is custom-coded rather than WordPress?", a: "We review the project's architecture and build the connector script, authentication, field mapping and publishing logic specifically for that website." },
  { q: "Is this just another AI content generator?", a: "No. A generator writes text. Content Bridge combines human-led strategy, keyword research, editorial planning, WordPress automation and ongoing oversight." },
  { q: "Which WordPress SEO plugins are supported?", a: "Content Bridge writes the correct fields for Yoast, Rank Math, SEOPress and All in One SEO." },
  { q: "How many articles will it publish each month?", a: "There is no reckless default. We recommend cadence from your domain authority, competition, existing content and crawl capacity." },
  { q: "What does the GEO add-on include?", a: "It shapes content for generative and answer engines using direct answers, question-led headings, clear entities, structured data and self-contained quotable passages." },
];

type FormStatus = "idle" | "sending" | "success" | "error";

export default function EnglishHome() {
  useScrollReveal();
  const [selectedPlan, setSelectedPlan] = useState("Professional");
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
      setSelectedPlan("Professional");
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
        offers: plans.map((plan, index) => ({ "@type": "Offer", name: `${plan.name} Content Bridge plan`, price: ["90000000", "120000000", "170000000"][index], priceCurrency: "IRR", description: plan.description })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Content Bridge WordPress Plugin",
        softwareVersion: "2.1.0",
        applicationCategory: "BusinessApplication",
        operatingSystem: "WordPress 5.6+",
        downloadUrl: "../downloads/content-bridge-2.1.0.zip",
        description: "A secure WordPress publishing bridge for articles, featured images, taxonomy, SEO fields, FAQ data and duplicate-safe updates.",
        author: { "@type": "Organization", name: "Vira Web Aria" },
        license: "https://www.gnu.org/licenses/gpl-2.0.html",
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
      }) }} />

      <nav className="nav" aria-label="Main navigation">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="Content Bridge home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Content Bridge</span></a>
          <div className="nav-links"><a href="#process">Process</a><a href="#features">Features</a><a href="#download-plugin">Plugin</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div>
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
            <article><span>01</span><h3>Half-finished articles</h3><p>The article publishes, but its featured image, meta description and focus keyword remain empty. Someone must open the dashboard and finish it—so nobody does.</p></article>
            <article><span>02</span><h3>Duplicate content</h3><p>A retry publishes the same article twice. Two URLs now compete for one keyword, and neither becomes the clear result.</p></article>
            <article><span>03</span><h3>Silent failure</h3><p>Something breaks, the script still reports success, and three weeks later you discover that nothing was published.</p></article>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="section-heading split-heading"><div><span className="section-label">Our process</span><h2>Before the first article, we build the system.</h2></div><p>Automation is the final step, not the whole product. Discovery, research and editorial judgement are what make automated content worth publishing.</p></div>
          <div className="process-list">{processSteps.map((step, index) => <article className={index === 3 ? "process-item automation" : "process-item"} key={step.number}><span className="process-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><span className="process-arrow" aria-hidden="true">→</span></article>)}</div>
        </div>
      </section>

      <section className="section responsibility-section">
        <div className="container">
          <div className="section-heading split-heading"><div><span className="section-label">The real division of labour</span><h2>The agent writes the draft. Everything that makes it work is ours.</h2></div><p>Before automation is connected, roughly a month goes into understanding the site, mapping demand and building the plan the agent must follow.</p></div>
          <div className="labour-table-wrap"><table className="labour-table"><thead><tr><th>Content Bridge team</th><th>Content agent</th></tr></thead><tbody>{labourRows.map(([human, agent]) => <tr key={human}><td>{human}</td><td>{agent}</td></tr>)}</tbody></table></div>
          <p className="labour-note">The agent is a very fast writer with perfect memory of your rules. Strategy, judgement and course correction remain human.</p>
        </div>
      </section>

      <section className="section agent-section">
        <div className="container">
          <div className="section-heading centered"><span className="section-label">Disciplined execution</span><h2>The agent does more than produce words; it follows the operating rules.</h2><p>The strategy and brief come from our team. The execution layer has clear rules for facts, voice, variation, linking and permissions.</p></div>
          <div className="agent-grid">{agentCapabilities.map(([title, text], index) => <article className="agent-card" key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-heading centered"><span className="section-label">The details that matter</span><h2>All the small content tasks your team no longer has to carry.</h2><p>From choosing the topic to confirming publication, every step is defined, visible and adapted to your WordPress site.</p></div>
          <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><span className="feature-icon">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
          <div className="promise-card"><div className="promise-mark" aria-hidden="true">“</div><div><span className="section-label">Clarity from day one</span><h3>See the content roadmap and monthly deliverables before work begins.</h3></div><p>Topics, publishing dates, content status and delivery reports stay visible—so your team always knows what is happening, why it matters and what comes next.</p></div>
          <div className="custom-site-card"><div className="custom-site-code" aria-hidden="true"><span>&lt;/&gt;</span><i /><i /><i /></div><div className="custom-site-copy"><span className="section-label">Not running WordPress?</span><h3>Custom-coded websites get a purpose-built script and integration setup.</h3><p>We review your architecture, APIs, authentication, database and content model, then develop and test publishing logic around your actual infrastructure.</p><div className="custom-site-tags"><span>Custom connector script</span><span>API and field mapping</span><span>Publishing and duplicate controls</span><span>Server-level testing</span></div></div><a className="custom-site-link" href="#contact">Technical discovery <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section className="section plugin-download-section" id="download-plugin">
        <div className="container">
          <div className="plugin-download-card">
            <div className="plugin-download-icon" aria-hidden="true"><span>CB</span><small>WP</small></div>
            <div className="plugin-download-copy">
              <span className="section-label">Official WordPress plugin</span>
              <h2>Connect your site to a secure content publishing pipeline.</h2>
              <p>Version 2.1.0 receives articles, featured images, taxonomy, complete SEO fields and FAQ data through a secure endpoint, while duplicate-safe updates keep every article unique.</p>
              <div className="plugin-download-tags"><span>Secure REST API</span><span>Duplicate protection</span><span>Yoast and Rank Math</span><span>Logs and diagnostics</span></div>
            </div>
            <div className="plugin-download-action">
              <span className="plugin-version">Version 2.1.0</span>
              <a className="button plugin-download-button" href="../downloads/content-bridge-2.1.0.zip" download>Download plugin <span aria-hidden="true">↓</span></a>
              <small>WordPress 5.6+ · PHP 7.4+</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section seo-proof-section" id="seo-proof">
        <div className="container">
          <div className="section-heading split-heading seo-proof-heading"><div><span className="section-label">SEO informed by current data</span><h2>Built for search in 2026—not an outdated SEO checklist.</h2></div><p>The March 2026 core update ran from March 27 to April 8. SE Ranking data showed substantially more movement than the December update.</p></div>
          <div className="seo-stat-grid"><article><strong>79.5%</strong><span>of top-three URLs changed position</span></article><article><strong>24.1%</strong><span>of top-10 pages dropped beyond the top 100</span></article><article><strong>12 days</strong><span>and four hours of official rollout time</span></article></div>
          <div className="seo-response-grid"><div><h3>How the pipeline responds</h3><p>Every article must contain something an aggregator cannot restate: first-hand experience, identifiable authorship, approved facts and a direct connection to your services.</p></div><ul><li><span>Destination source</span><b>Your projects, decisions and observations</b></li><li><span>Identifiable authorship</span><b>A real name with subject relevance</b></li><li><span>Defensible claims</span><b>Every figure comes from an approved facts file</b></li><li><span>Extractable structure</span><b>Direct answers, FAQ, schema and purposeful links</b></li></ul></div>
          <div className="source-links"><span>Sources:</span><a href="https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history?success=true" target="_blank" rel="noreferrer">Google Search Status</a><a href="https://searchengineland.com/march-2026-google-core-update-what-changed-474397" target="_blank" rel="noreferrer">SE Ranking via Search Engine Land</a></div>
        </div>
      </section>

      <section className="section roadmap-section">
        <div className="container">
          <div className="section-heading centered"><span className="section-label">The first six months</span><h2>Each month adds a measurable layer to the system.</h2><p>The calendar is not a rigid contract. It follows the site's real data and is rebuilt for the next stage at the end of the cycle.</p></div>
          <div className="roadmap-list">{sixMonthSteps.map(([month, title, text], index) => <article className="roadmap-item" key={month}><span className="roadmap-dot">{index + 1}</span><div><small>{month}</small><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="section guardrails-section">
        <div className="container">
          <div className="section-heading split-heading"><div><span className="section-label">Guardrails by design</span><h2>The constraints are part of the product.</h2></div><p>Good automation knows more than what to do. It knows when to stop, verify or return a decision to a person.</p></div>
          <div className="guardrail-grid">{guardrails.map(([title, text]) => <article className="guardrail-card" key={title}><span aria-hidden="true">✓</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-heading centered pricing-heading"><span className="section-label">Plans</span><h2>Every plan includes the complete strategy.</h2><p>Audit, keyword research and a six-month calendar are complete in every plan. The difference is the final delivery—not the strategic depth.</p></div>
          <div className="pricing-grid">{plans.map((plan) => <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>{plan.featured && <span className="popular">Recommended</span>}<span className="plan-eyebrow">{plan.eyebrow}</span><h3>{plan.name}</h3><div className="price"><strong>{plan.price}</strong><span>million Toman<br />per month</span></div><p className="plan-description">{plan.description}</p><ul>{plan.features.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><button className={plan.featured ? "button plan-button" : "button button-secondary plan-button"} onClick={() => choosePlan(plan.name)}>Choose {plan.name} <span aria-hidden="true">→</span></button></article>)}</div>
          <figure className="banner-samples"><div className="banner-samples-copy"><span className="section-label">The Professional visual layer</span><h3>A fresh article banner, inside one consistent identity.</h3><p>The subject and composition change; your palette, quality and visual language stay recognisably yours.</p></div><img src="/banner-examples.webp" alt="Three bespoke banner examples for a site audit, keyword clustering and cross-channel publishing" width="1823" height="863" loading="lazy" /><figcaption>These examples show the design level. The production kit is built from each brand's real palette, type and website layout.</figcaption></figure>
          <div className="all-plans-card"><div><span className="section-label">Included in every plan</span><h3>Even the lowest-priced plan is a complete programme.</h3></div><div className="all-plans-features">{sharedPlanFeatures.map((item) => <span key={item}>{item}</span>)}</div><p>Our team sets article cadence from domain authority, keyword competition, existing content and crawl speed. We sell the right rhythm—not a short burst of volume.</p></div>
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
            <label><span>Plan you are considering</span><select name="plan" value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)}><option>Base</option><option>Professional</option><option>Complete</option><option>I need help choosing</option></select></label>
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
