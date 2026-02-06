"use client";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          budget: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Let&apos;s Build Something Great
            </h1>
            <p className="text-xl text-muted-foreground">
              Tell us about your project. We&apos;ll respond within 24 hours
              with a tailored proposal.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <select
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  <option value="">Select Service *</option>
                  <option value="chatbots">AI Chatbots</option>
                  <option value="websites">Website Development</option>
                  <option value="automation">Business Automation</option>
                  <option value="mobile">Mobile Apps</option>
                  <option value="ios">iOS Apps</option>
                  <option value="seo">SEO Services</option>
                  <option value="consulting">Tech Consulting</option>
                </select>
                <select
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  <option value="">Budget Range</option>
                  <option value="under-500k">Under ₦500K</option>
                  <option value="500k-1m">₦500K - ₦1M</option>
                  <option value="1m-2m">₦1M - ₦2M</option>
                  <option value="over-2m">Over ₦2M</option>
                </select>
                <textarea
                  placeholder="Tell us about your project *"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                />
                {status === "success" && (
                  <div className="p-4 border border-green-500/30 bg-green-500/10 rounded-lg text-green-400">
                    Message sent! We&apos;ll respond within 24 hours.
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400">
                    Failed to send. Please try again or email us directly.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Prefer to talk? Book a free 30-minute audit call and
                  we&apos;ll show you exactly how AI can transform your
                  business.
                </p>
                <a
                  href="https://calendly.com/morontomornica7/audit"
                  className="inline-block px-8 py-4 border border-cyan-500/30 rounded-xl font-semibold hover:bg-cyan-500/10 transition-colors"
                >
                  Book Audit Call
                </a>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-cyan-400 mt-1" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <a
                      href="mailto:architect@shadowspark-technologies.com"
                      className="text-muted-foreground hover:text-cyan-400"
                    >
                      architect@shadowspark-technologies.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-muted-foreground">
                      +234 803 123 4567
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-cyan-400 mt-1" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground">
                      Port Harcourt, Rivers State, Nigeria
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-border rounded-2xl bg-card/50">
                <h3 className="font-semibold mb-3">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  We respond to all inquiries within 24 hours (business days).
                  For urgent requests, book an audit call for same-day response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
