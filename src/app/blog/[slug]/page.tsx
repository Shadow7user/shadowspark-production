import WhatsAppLink from "@/components/WhatsAppLink";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const posts: Record<
  string,
  {
    title: string;
    date: string;
    readTime: string;
    category: string;
    content: string;
  }
> = {
  "why-nigerian-smes-need-whatsapp-chatbots": {
    title: "Why Nigerian SMEs Need WhatsApp Chatbots in 2026",
    date: "2026-02-10",
    readTime: "5 min read",
    category: "AI Chatbots",
    content: `Nigeria has over 100 million active WhatsApp users — making it the primary communication channel for businesses and customers alike. Yet most SMEs still handle customer queries manually, leading to slow response times and lost sales.

## The Problem

The average Nigerian SME receives 50-200 customer messages per day on WhatsApp. Without automation, business owners spend 3-5 hours daily just responding to repetitive questions about pricing, availability, and business hours.

## How AI Chatbots Help

An AI-powered WhatsApp chatbot can:

- **Respond instantly** to common questions 24/7
- **Qualify leads** by asking the right questions before handing off to sales
- **Process orders** directly within the chat
- **Provide multilingual support** in English, Pidgin, and local languages
- **Escalate complex issues** to human agents seamlessly

## Real Results

Businesses using ShadowSpark chatbots have seen:
- **3x faster** average response time
- **40% more** qualified leads captured
- **60% reduction** in repetitive support queries
- **97% customer satisfaction** rating

## Getting Started

Setting up a WhatsApp chatbot with ShadowSpark takes less than a week. We handle the technical setup, AI training, and integration with your existing systems. Start with our free trial to see the difference.`,
  },
  "bi-dashboards-for-small-business": {
    title: "BI Dashboards: Stop Guessing, Start Knowing",
    date: "2026-02-05",
    readTime: "4 min read",
    category: "Business Intelligence",
    content: `Most Nigerian business owners make decisions based on gut feeling and incomplete spreadsheets. A Business Intelligence dashboard changes that by turning your raw data into actionable insights.

## What Is a BI Dashboard?

A BI dashboard is a visual interface that connects to your business data — sales records, customer interactions, inventory, expenses — and presents it in real-time charts, graphs, and metrics.

## Why It Matters for Nigerian SMEs

- **See revenue trends** before they become problems
- **Track inventory levels** across multiple locations
- **Monitor customer satisfaction** in real-time
- **Identify your best-performing products** and channels
- **Make data-driven decisions** instead of guessing

## What ShadowSpark Offers

Our BI dashboards connect directly to your existing tools — whether that's an Excel spreadsheet, a POS system, or a custom database. We build custom visualizations that answer the questions that matter most to your business.

No technical knowledge required. We handle the setup, and you get a mobile-friendly dashboard you can check from anywhere.`,
  },
  "automate-invoice-processing-rpa": {
    title: "How to Automate Invoice Processing with RPA",
    date: "2026-01-28",
    readTime: "6 min read",
    category: "RPA",
    content: `Invoice processing is one of the most time-consuming tasks in Nigerian businesses. From receiving invoices to matching them with purchase orders, entering data, and processing payments — it's repetitive, error-prone, and expensive.

## The Cost of Manual Processing

A typical Nigerian SME spends 15-30 minutes per invoice on manual processing. For a business handling 100 invoices per month, that's 25-50 hours of staff time — just on invoices.

## What Is RPA?

Robotic Process Automation (RPA) uses software robots to mimic human actions on digital systems. For invoice processing, an RPA bot can:

- **Extract data** from invoices (PDF, image, or email)
- **Match invoices** to purchase orders automatically
- **Flag discrepancies** for human review
- **Enter data** into your accounting software
- **Route approvals** to the right person
- **Process payments** on schedule

## Implementation with ShadowSpark

We build custom RPA workflows that integrate with your existing accounting and ERP systems. Most implementations take 2-4 weeks and pay for themselves within the first quarter through time savings alone.`,
  },
  "ai-customer-support-vs-human-agents": {
    title: "AI Customer Support vs Human Agents: Finding the Balance",
    date: "2026-01-20",
    readTime: "5 min read",
    category: "AI Chatbots",
    content: `The question isn't whether to use AI or humans for customer support — it's how to combine them effectively. The best customer experiences use AI for speed and humans for empathy.

## What AI Does Best

- Instant responses to FAQs (pricing, hours, policies)
- 24/7 availability without overtime costs
- Consistent, accurate information every time
- Handling multiple conversations simultaneously
- Multilingual support without additional staff

## What Humans Do Best

- Complex problem-solving and edge cases
- Emotional support and empathy
- Negotiation and upselling
- Building long-term customer relationships
- Handling sensitive or escalated issues

## The Hybrid Model

ShadowSpark's chatbots are designed for seamless human handoff. When the AI detects a query it can't handle confidently — or when a customer explicitly requests a human — the conversation transfers to your team with full context preserved.

This means your team focuses on high-value interactions while the AI handles the routine work. The result: faster resolution times, happier customers, and a more efficient team.`,
  },
  "choosing-right-ai-tools-for-your-business": {
    title: "Choosing the Right AI Tools for Your Business",
    date: "2026-01-15",
    readTime: "7 min read",
    category: "Strategy",
    content: `Not every business needs the most powerful (and expensive) AI models. The right tool depends on your use case, budget, and scale.

## Small Businesses (1-10 employees)

**Start with:** A WhatsApp chatbot for customer support
**Why:** Immediate ROI from reduced response times and 24/7 availability
**Budget:** \u20A650,000-100,000/month

## Growing Businesses (10-50 employees)

**Add:** BI dashboard + lead management
**Why:** Data-driven decisions become critical as you scale
**Budget:** \u20A6100,000-250,000/month

## Established Businesses (50+ employees)

**Add:** RPA workflows + custom integrations
**Why:** Manual processes become bottlenecks at scale
**Budget:** Custom pricing based on scope

## Key Questions to Ask

1. What's your most time-consuming repetitive task?
2. Where do you lose the most customers in your funnel?
3. What data do you wish you had but don't?
4. How many customer messages do you handle daily?

The answers to these questions will point you to the right starting point. ShadowSpark offers free consultations to help you identify the highest-impact AI tools for your specific business.`,
  },
  "whatsapp-business-api-vs-sandbox": {
    title: "WhatsApp Business API vs Sandbox: What's the Difference?",
    date: "2026-01-08",
    readTime: "4 min read",
    category: "Technical",
    content: `If you're building a WhatsApp chatbot for your Nigerian business, you'll encounter two options: the WhatsApp Business API and the sandbox environment. Understanding the difference is crucial for planning your launch.

## WhatsApp Sandbox

The sandbox is a testing environment provided by platforms like Twilio. It lets you:

- Test your chatbot without Meta approval
- Use a shared phone number (not your business number)
- Send messages to opted-in testers only
- Prototype and iterate quickly

**Best for:** Development, testing, and demos

## WhatsApp Business API

The production API gives you:

- Your own verified business phone number
- Green checkmark verification badge
- Template messages for proactive outreach
- Higher message limits
- Full analytics and delivery reports

**Best for:** Live customer-facing deployment

## How to Transition

ShadowSpark builds your chatbot on the sandbox during development, then handles the migration to the production API when you're ready. The transition typically takes 1-2 weeks including Meta's business verification process.

## Cost Comparison

- **Sandbox:** Free (testing only)
- **Business API:** Per-conversation pricing (varies by region, typically \u20A615-50 per conversation)

We include WhatsApp API costs in our plans so you don't have to manage Meta billing separately.`,
  },
};

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: { title: post.title, description: post.content.slice(0, 160) },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#0a0f1a] pt-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Post not found</h1>
            <Link
              href="/blog"
              className="mt-4 inline-block text-[#d4a843] hover:text-[#e8c56d]"
            >
              Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#d4a843]"
          >
            <ArrowLeft size={14} />
            Back to blog
          </Link>

          <span className="inline-block rounded-full bg-[#d4a843]/10 px-3 py-1 text-xs font-medium text-[#d4a843]">
            {post.category}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>

          <div className="prose-invert mt-10">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mb-4 mt-8 text-xl font-bold text-white"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("- ")) {
                return (
                  <ul key={i} className="mb-4 space-y-2">
                    {block.split("\n").map((line, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-slate-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a843]" />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/^- /, "")
                              .replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-white">$1</strong>',
                              ),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.match(/^\d\./)) {
                return (
                  <ol key={i} className="mb-4 list-decimal space-y-2 pl-5">
                    {block.split("\n").map((line, j) => (
                      <li key={j} className="text-slate-400">
                        {line.replace(/^\d+\.\s*/, "")}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p
                  key={i}
                  className="mb-4 leading-relaxed text-slate-400"
                  dangerouslySetInnerHTML={{
                    __html: block.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-white">$1</strong>',
                    ),
                  }}
                />
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#d4a843]/10 to-[#c0935a]/10 p-8 text-center">
            <h3 className="text-xl font-bold text-white">
              Ready to automate your business?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Start your free trial or chat with us on WhatsApp.
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
              >
                Start Free Trial
              </Link>
              <WhatsAppLink
                href="https://wa.me/2349037621612"
                source="blog_post"
                className="rounded-lg border border-emerald-500/20 px-6 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                Chat on WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
