/**
 * Claude AI Service for ClawBot
 * Handles AI-powered responses using Anthropic Claude
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

/**
 * ShadowSpark ClawBot System Prompt
 */
const SYSTEM_PROMPT = `You are ClawBot, the official AI assistant for ShadowSpark Technologies, a premium AI automation agency based in Port Harcourt, Nigeria.

Your personality:
- Friendly, professional, and helpful
- Knowledgeable about AI, automation, and digital solutions
- Nigerian-market aware (understand Naira pricing, local context)

About ShadowSpark:
- We build custom AI-powered WhatsApp chatbots and automation tools
- We create custom business platforms and web applications
- We automate business processes to save time and reduce costs

Core Services:
1. WhatsApp Business Suite (₦350,000 - ₦600,000)
   - 24/7 AI chatbot for customer support
   - Order tracking and notifications
   - Lead capture and qualification
   - Appointment booking

2. Custom Business Platforms (₦450,000 - ₦1,200,000)
   - Customer portals and dashboards
   - Inventory and order management
   - Employee management systems
   - E-commerce platforms

3. Process Automation (₦200,000 - ₦800,000)
   - Workflow automation
   - Document processing
   - Reporting and analytics
   - Integration with existing systems

Response Guidelines:
- Keep responses concise and conversational
- Use emojis sparingly but effectively
- Always offer to help them take the next step
- For sales inquiries, suggest booking a free audit
- For technical questions, provide helpful answers
- If you don't know something, offer to connect them with a human

Always end with a clear call-to-action that helps move them forward.`;

export class ClaudeService {
  /**
   * Generate AI response for user message
   */
  async generateResponse(
    userMessage: string,
    userPhone: string,
  ): Promise<string> {
    try {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      const botResponse =
        response.content[0].type === "text"
          ? response.content[0].text
          : "I apologize, but I had trouble generating a response. Please try again.";

      console.log(
        `🤖 Claude response generated: ${botResponse.substring(0, 100)}...`,
      );

      return botResponse;
    } catch (error) {
      console.error("❌ Claude API error:", error);

      // Fallback responses if AI fails
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Fallback responses when AI is unavailable
   */
  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("how much")
    ) {
      return `Hi! 👋 I'm ClawBot, AI assistant for ShadowSpark Technologies.

Our pricing varies by project complexity:

📱 WhatsApp Business Suite: ₦350K - ₦600K
💻 Custom Platforms: ₦450K - ₦1.2M
⚙️ Process Automation: ₦200K - ₦800K

For a detailed quote, book your free audit:
🔗 https://shadowspark-tech.org/free-audit

Would you like me to connect you with our team?`;
    }

    if (
      message.includes("contact") ||
      message.includes("speak") ||
      message.includes("talk")
    ) {
      return `📞 Ready to chat with our team?

✨ Book your free 30-minute consultation:
🔗 https://shadowspark-tech.org/free-audit

We're available:
- 📧 Email: architect@shadowspark-technologies.com
- 📱 WhatsApp: Direct message me here!

What would you like to discuss?`;
    }

    if (message.includes("service") || message.includes("what do you do")) {
      return `🏢 ShadowSpark Technologies - We Build AI-Powered Solutions!

Our core services:

1️⃣ WhatsApp AI Chatbots
   - 24/7 customer support
   - Order tracking
   - Lead capture

2️⃣ Custom Business Software
   - Dashboards & portals
   - Inventory systems
   - E-commerce platforms

3️⃣ Process Automation
   - Workflow optimization
   - Document processing
   - Analytics & reporting

🚀 Ready to transform your business?
Book a free audit: https://shadowspark-tech.org/free-audit`;
    }

    return `Hi there! 👋 I'm ClawBot, AI assistant for ShadowSpark Technologies.

I didn't quite catch that, but I'm here to help! 

✨ What I can do:
- Answer questions about our services
- Provide pricing information
- Help you book a consultation
- Assist with general inquiries

📞 Book your free audit:
🔗 https://shadowspark-tech.org/free-audit

How can I help you today?`;
  }
}
