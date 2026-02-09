/**
 * WhatsApp Business API Service
 * Handles sending messages via Meta's WhatsApp Business API
 */

const WHATSAPP_API_VERSION = "v18.0";
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID!;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_ID}/messages`;

/**
 * Send text message via WhatsApp Business API
 */
export class WhatsAppService {
  /**
   * Send a text message to a WhatsApp user
   */
  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      // Format phone number (remove + if present)
      const formattedPhone = to.replace(/\+/g, "");

      const response = await fetch(WHATSAPP_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "text",
          text: {
            body: message,
            preview_url: false,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ WhatsApp API error:", error);
        return false;
      }

      const result = await response.json();
      console.log(
        `✅ WhatsApp message sent successfully: ${result.messages[0].id}`,
      );
      return true;
    } catch (error) {
      console.error("❌ WhatsApp send message error:", error);
      return false;
    }
  }

  /**
   * Send a template message (for automated responses)
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
    components: any[],
  ): Promise<boolean> {
    try {
      const formattedPhone = to.replace(/\+/g, "");

      const response = await fetch(WHATSAPP_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "en_US",
            },
            components,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ WhatsApp template error:", error);
        return false;
      }

      const result = await response.json();
      console.log(`✅ WhatsApp template sent: ${result.messages[0].id}`);
      return true;
    } catch (error) {
      console.error("❌ WhatsApp template send error:", error);
      return false;
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(WHATSAPP_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("❌ Mark as read error:", error);
      return false;
    }
  }
}
