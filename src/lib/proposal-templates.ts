// Pre-built proposal templates for common Nigerian B2B services
// Use these to quickly generate proposals for seeded leads

export interface ProposalTemplate {
  id: string;
  name: string;
  industry: string[];
  description: string;
  baseAmount: number;
  timeline: string;
  deliverables: string[];
  painPoints: string[]; // Keywords to match against prospect.painPoint
}

export const proposalTemplates: ProposalTemplate[] = [
  {
    id: "whatsapp-chatbot",
    name: "WhatsApp AI Chatbot",
    industry: ["E-commerce", "Fashion", "Retail", "Beauty"],
    description: `Transform your WhatsApp customer support with an AI-powered chatbot that:

• Answers FAQs instantly 24/7 (product info, prices, availability)
• Captures leads and qualifies customers automatically
• Processes orders and sends order confirmations
• Integrates with your existing inventory system
• Reduces support staff workload by 70%

Built on Meta's official WhatsApp Business API with natural Nigerian communication style.`,
    baseAmount: 450000,
    timeline: "2-3 weeks",
    deliverables: [
      "Custom WhatsApp Business API integration",
      "AI chatbot trained on your products/FAQs",
      "Order capture and confirmation system",
      "Admin dashboard for conversation monitoring",
      "30 days post-launch support and training",
    ],
    painPoints: [
      "whatsapp",
      "chat",
      "support",
      "customer service",
      "questions",
      "overwhelmed",
    ],
  },
  {
    id: "logistics-automation",
    name: "Logistics Automation Dashboard",
    industry: ["Logistics", "Delivery", "Transportation", "Courier"],
    description: `End-to-end logistics management system that eliminates manual tracking:

• Real-time GPS tracking for all deliveries
• Automated customer notifications (WhatsApp/SMS)
• Driver mobile app for delivery updates
• Central dashboard for dispatch management
• Automated invoicing and payment reconciliation
• Analytics and route optimization insights

No more Excel spreadsheets or manual phone calls to customers.`,
    baseAmount: 950000,
    timeline: "4-6 weeks",
    deliverables: [
      "Custom logistics management web dashboard",
      "Driver mobile app (Android + iOS)",
      "WhatsApp/SMS customer notification system",
      "Real-time GPS tracking integration",
      "Analytics and reporting module",
      "60 days post-launch support",
    ],
    painPoints: [
      "tracking",
      "manual",
      "excel",
      "delivery",
      "logistics",
      "dispatch",
      "route",
    ],
  },
  {
    id: "business-website-seo",
    name: "Professional Website + SEO",
    industry: [
      "Real Estate",
      "Professional Services",
      "Law",
      "Consulting",
      "Healthcare",
    ],
    description: `Professional web presence that generates leads while you sleep:

• Modern, mobile-first website design
• SEO-optimized for Lagos/Nigeria searches
• Property/Service listing with filters
• Lead capture forms with WhatsApp integration
• Google Business Profile optimization
• Content strategy for local search dominance

Stop losing leads to competitors who rank on Google.`,
    baseAmount: 850000,
    timeline: "3-4 weeks",
    deliverables: [
      "Custom responsive website (10-15 pages)",
      "SEO optimization for 20 target keywords",
      "Google Business Profile setup and optimization",
      "WhatsApp Business integration",
      "Contact forms with email notifications",
      "3 months SEO maintenance included",
    ],
    painPoints: [
      "website",
      "web presence",
      "google",
      "seo",
      "online",
      "leads",
      "rank",
    ],
  },
  {
    id: "booking-system",
    name: "Appointment Booking System",
    industry: ["Beauty", "Wellness", "Healthcare", "Salon", "Spa", "Clinic"],
    description: `Eliminate no-shows and booking chaos with automated scheduling:

• Online booking with real-time availability
• Automated SMS/WhatsApp reminders (reduce no-shows by 60%)
• Staff calendar management
• Client database with visit history
• Integrated payment deposits
• Analytics on peak hours and popular services

Let customers book 24/7 while you focus on service.`,
    baseAmount: 650000,
    timeline: "2-3 weeks",
    deliverables: [
      "Custom booking website/widget",
      "Staff calendar and scheduling system",
      "Automated reminder system (WhatsApp + SMS)",
      "Client management database",
      "Paystack integration for deposits",
      "Admin dashboard and analytics",
      "45 days post-launch support",
    ],
    painPoints: [
      "booking",
      "appointment",
      "no-show",
      "schedule",
      "calendar",
      "busy",
    ],
  },
  {
    id: "ordering-system",
    name: "Online Ordering & Delivery System",
    industry: ["Restaurant", "Food", "Catering", "Kitchen", "Bakery"],
    description: `Complete digital ordering solution for modern Nigerian restaurants:

• Branded ordering website/app
• Menu management with photos and variants
• Integrated delivery tracking
• Kitchen display system for order management
• Multi-location support
• Loyalty program and promotions
• Analytics on popular items and peak times

Compete with the big apps while keeping 100% of your revenue.`,
    baseAmount: 1200000,
    timeline: "4-5 weeks",
    deliverables: [
      "Custom ordering website (PWA - works like app)",
      "Admin dashboard for menu and order management",
      "Kitchen display system",
      "Delivery rider mobile app",
      "Paystack payment integration",
      "WhatsApp order notifications",
      "Customer loyalty system",
      "60 days post-launch support",
    ],
    painPoints: [
      "order",
      "ordering",
      "phone",
      "delivery",
      "kitchen",
      "menu",
      "food",
    ],
  },
  {
    id: "inventory-pos",
    name: "Inventory & POS System",
    industry: ["Retail", "Pharmacy", "Supermarket", "Store", "Shop"],
    description: `Take control of your stock and sales with modern inventory management:

• Real-time inventory tracking across locations
• POS system with barcode scanning
• Low stock alerts and reorder automation
• Sales analytics and profit margins
• Supplier management
• Staff access controls and audit trails

Never lose a sale to stockouts or oversell again.`,
    baseAmount: 750000,
    timeline: "3-4 weeks",
    deliverables: [
      "Cloud-based inventory management system",
      "POS application (works offline)",
      "Barcode scanning support",
      "Multi-location inventory sync",
      "Sales and profit reporting",
      "Supplier order management",
      "Staff training (2 sessions)",
      "45 days support",
    ],
    painPoints: ["inventory", "stock", "pos", "sales", "track", "store"],
  },
];

// Find matching templates based on prospect industry and pain point
export function findMatchingTemplates(
  industry: string,
  painPoint: string,
): ProposalTemplate[] {
  const industryLower = industry.toLowerCase();
  const painPointLower = painPoint.toLowerCase();

  return proposalTemplates
    .map((template) => {
      let score = 0;

      // Check industry match
      if (
        template.industry.some((i) => industryLower.includes(i.toLowerCase()))
      ) {
        score += 10;
      }

      // Check pain point keyword match
      const matchedKeywords = template.painPoints.filter((kw) =>
        painPointLower.includes(kw),
      );
      score += matchedKeywords.length * 5;

      return { template, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ template }) => template);
}

// Generate proposal data from template for a specific prospect
export function generateProposalFromTemplate(
  template: ProposalTemplate,
  prospectCompany: string,
  customAmount?: number,
): {
  title: string;
  description: string;
  amount: number;
  timeline: string;
  deliverables: string[];
} {
  return {
    title: `${template.name} for ${prospectCompany}`,
    description: template.description,
    amount: customAmount || template.baseAmount,
    timeline: template.timeline,
    deliverables: template.deliverables,
  };
}
