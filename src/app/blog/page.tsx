import WhatsAppLink from "@/components/WhatsAppLink";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "AI tips, automation strategies, and business insights for Nigerian SMEs. Learn how to leverage chatbots, dashboards, and RPA.",
  openGraph: {
    title: "ShadowSpark Blog",
    description: "AI tips and automation strategies for Nigerian businesses.",
  },
};

const posts = [
  {
    slug: "why-nigerian-smes-need-whatsapp-chatbots",
    title: "Why Nigerian SMEs Need WhatsApp Chatbots in 2026",
    excerpt:
      "With over 100 million WhatsApp users in Nigeria, businesses that automate customer support on WhatsApp see 3x faster response times and 40% more leads. Here's how to get started.",
    date: "2026-02-10",
    readTime: "5 min read",
    category: "AI Chatbots",
  },
  {
    slug: "bi-dashboards-for-small-business",
    title: "BI Dashboards: Stop Guessing, Start Knowing",
    excerpt:
      "Most Nigerian SMEs make decisions based on gut feeling. A simple BI dashboard connected to your sales data can reveal patterns you never knew existed.",
    date: "2026-02-05",
    readTime: "4 min read",
    category: "Business Intelligence",
  },
  {
    slug: "automate-invoice-processing-rpa",
    title: "How to Automate Invoice Processing with RPA",
    excerpt:
      "Manual invoice processing costs Nigerian businesses thousands of hours per year. Learn how robotic process automation can handle it in minutes.",
    date: "2026-01-28",
    readTime: "6 min read",
    category: "RPA",
  },
  {
    slug: "ai-customer-support-vs-human-agents",
    title: "AI Customer Support vs Human Agents: Finding the Balance",
    excerpt:
      "AI doesn't replace your team — it supercharges them. See how hybrid support models deliver faster resolutions while keeping the human touch.",
    date: "2026-01-20",
    readTime: "5 min read",
    category: "AI Chatbots",
  },
  {
    slug: "choosing-right-ai-tools-for-your-business",
    title: "Choosing the Right AI Tools for Your Business",
    excerpt:
      "Not every business needs GPT-4. We break down which AI tools make sense for different business sizes and industries in Nigeria.",
    date: "2026-01-15",
    readTime: "7 min read",
    category: "Strategy",
  },
  {
    slug: "whatsapp-business-api-vs-sandbox",
    title: "WhatsApp Business API vs Sandbox: What's the Difference?",
    excerpt:
      "Confused about WhatsApp Business API options? We explain the difference between sandbox testing and production API access for Nigerian developers.",
    date: "2026-01-08",
    readTime: "4 min read",
    category: "Technical",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The ShadowSpark <span className="gradient-text">Blog</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            AI tips, automation strategies, and business insights for Nigerian
            SMEs.
          </p>
        </section>

        {/* Featured Post */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/blog/${posts[0].slug}`}
            className="group block rounded-2xl border border-[#d4a843]/10 bg-gradient-to-r from-[#d4a843]/5 to-[#c0935a]/5 p-8 transition-all hover:border-[#d4a843]/20 md:p-12"
          >
            <span className="inline-block rounded-full bg-[#d4a843]/10 px-3 py-1 text-xs font-medium text-[#d4a843]">
              {posts[0].category}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white group-hover:text-[#d4a843] sm:text-3xl">
              {posts[0].title}
            </h2>
            <p className="mt-3 max-w-3xl text-slate-400">{posts[0].excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(posts[0].date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {posts[0].readTime}
              </span>
            </div>
          </Link>
        </section>

        {/* Post Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group glass-card rounded-xl p-6 transition-all hover:-translate-y-1 hover:border-[#d4a843]/20"
              >
                <span className="inline-block rounded-full bg-[#c0935a]/10 px-3 py-1 text-xs font-medium text-[#c0935a]">
                  {post.category}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-[#d4a843]">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1 text-[#d4a843] group-hover:gap-2 transition-all">
                    Read more <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#d4a843]/10 to-[#c0935a]/10 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white">Stay in the loop</h2>
            <p className="mt-2 text-slate-400">
              Get weekly AI tips and business automation insights delivered to
              your WhatsApp.
            </p>
            <WhatsAppLink
              href="https://wa.me/2349037621612?text=Hi%2C%20I%27d%20like%20to%20subscribe%20to%20your%20weekly%20AI%20tips"
              source="blog_page"
              className="mt-6 inline-block rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-3 text-sm font-semibold text-white transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
            >
              Subscribe via WhatsApp
            </WhatsAppLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
