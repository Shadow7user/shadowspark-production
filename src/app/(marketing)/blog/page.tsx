import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | AI & Tech Insights | ShadowSpark Technologies",
  description:
    "Practical guides on AI automation, chatbot implementation, and business digitization for Nigerian SMBs.",
};

const posts = [
  {
    slug: "whatsapp-chatbot-roi-calculator",
    title:
      "5 Signs Your Business Needs a WhatsApp Chatbot (ROI Calculator Included)",
    excerpt:
      "Calculate exactly how much a chatbot would save your business in support costs and lost sales.",
    date: "2025-01-28",
    readTime: "8 min",
    category: "AI Automation",
  },
  {
    slug: "website-speed-nigerian-users",
    title: "Why Your Website Loads Slow for Nigerian Users (And How to Fix It)",
    excerpt:
      "Optimize for 3G networks and see 40% higher conversion rates with these proven techniques.",
    date: "2025-01-25",
    readTime: "6 min",
    category: "Web Development",
  },
  {
    slug: "business-automation-mistakes",
    title: "7 Automation Mistakes Costing Nigerian Businesses ₦500K+ Annually",
    excerpt:
      "Avoid these common pitfalls when implementing automation in your business operations.",
    date: "2025-01-22",
    readTime: "10 min",
    category: "Business Automation",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Insights & Guides</h1>
            <p className="text-xl text-muted-foreground">
              Practical advice on AI automation, web development, and business
              digitization for Nigerian SMBs.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-8 border border-border rounded-2xl bg-card/50 backdrop-blur hover:border-cyan-500/30 transition-colors group"
              >
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="px-3 py-1 border border-border rounded-full text-xs">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  Read More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center text-muted-foreground">
            More articles coming soon. Subscribe to our newsletter to get
            notified.
          </div>
        </div>
      </section>
    </div>
  );
}
