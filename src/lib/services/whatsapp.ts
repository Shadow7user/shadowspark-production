/**
 * WhatsApp Business API Service
 * Handles sending/receiving WhatsApp messages via Meta Graph API
 */

import { ClaudeService } from "./claude";

const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_API_VERSION = "v18.0";
const WHATSAPP_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

export class WhatsAppService {
  private static instance: WhatsAppService;
  private claudeService: ClaudeService;

  private constructor() {
    this.claudeService = new ClaudeService();
  }

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  /**
   * Verify webhook token from Meta
   */
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === "subscribe" && token === verifyToken) {
      console.log("✅ WhatsApp webhook verified successfully");
      return challenge;
    }

    console.error("❌ WhatsWebhook verification failed");
    return null;
  }

  /**
   * Process incoming WhatsApp message
   */
  async processIncomingMessage(
    from: string,
    messageBody: string,
    messageId: string,
  ): Promise<string> {
    console.log(
      `📨 Processing WhatsApp message from ${from}: ${messageBody.substring(0, 50)}...`,
    );

    try {
      // Generate AI response using Claude
      const botResponse = await this.claudeService.generateResponse(
        messageBody,
        from,
      );

      // Log conversation for analytics
      console.log(`🤖 ClawBot response generated for ${from}`);

      return botResponse;
    } catch (error) {
      console.error("Error processing WhatsApp message:", error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Send text message to WhatsApp user
   */
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      const url = `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE_ID}/messages`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: { body: message },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ WhatsApp send error:", errorData);
        return false;
      }

      const result = await response.json();
      console.log(`✅ Message sent to ${to}: ${result.messages[0].id}`);
      return true;
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      return false;
    }
  }

  /**
   * Send template message (for initiating conversations)
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
  ): Promise<boolean> {
    try {
      const url = `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE_ID}/messages`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en_US" },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ WhatsApp template error:", errorData);
        return false;
      }

      const result = await response.json();
      console.log(`✅ Template sent to ${to}: ${result.messages[0].id}`);
      return true;
    } catch (error) {
      console.error("Error sending template:", error);
      return false;
    }
  }

  /**
   * Get user phone number info
   */
  async getPhoneNumberInfo(phoneNumberId: string): Promise<any> {
    try {
      const url = `${WHATSAPP_BASE_URL}/${phoneNumberId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to get phone number info");
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting phone info:", error);
      return null;
    }
  }

  /**
   * Fallback response when AI fails
   */
  private getFallbackResponse(): string {
    return `Hi! 👋 I'm ClawBot, AI assistant for ShadowSpark Technologies.

I apologize, but I encountered a temporary issue. Please try again or:

📧 Email us: architect@shadowspark-technologies.com
🌐 Visit: https://shadowspark-tech.org

We're here to help!`;
  }
}

export const whatsappService = WhatsAppService.getInstance();
