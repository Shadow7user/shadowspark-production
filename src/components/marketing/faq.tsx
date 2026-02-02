import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How long does it take to build a chatbot?",
    a: "2-4 weeks from kickoff to launch. Week 1: requirements. Week 2-3: development. Week 4: testing and deployment.",
  },
  {
    q: "Do you work with businesses outside Lagos?",
    a: "Yes. We work remotely with clients across Nigeria (Port Harcourt, Abuja, Kano). All communication via WhatsApp, Zoom, and email.",
  },
  {
    q: "What if I need changes after launch?",
    a: "First 6 months: unlimited bug fixes free. Feature changes: ₦50K-200K depending on complexity. Monthly retainer: ₦60K-150K.",
  },
  {
    q: "Can you integrate with my existing systems?",
    a: "Yes. We integrate with most Nigerian platforms: Paystack, Flutterwave, Jumia, Konga APIs. Custom integrations quoted separately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Bank transfer, Paystack (cards, USSD, bank transfer). 40% deposit to start, 60% on delivery. Flexible payment plans for enterprise.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="multiple" className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
