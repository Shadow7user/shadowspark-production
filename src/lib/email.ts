import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendInvoiceEmail(params: {
  to: string;
  invoiceNumber: string;
  amount: number;
  paymentUrl: string;
  pdfBuffer: Buffer;
}) {
  try {
    await resend.emails.send({
      from: "ShadowSpark Technologies <invoices@shadowspark-tech.org>",
      to: params.to,
      subject: `Invoice ${params.invoiceNumber} - ₦${params.amount.toLocaleString()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Invoice from ShadowSpark Technologies</h2>
          <p>Invoice Number: <strong>${params.invoiceNumber}</strong></p>
          <p>Amount Due: <strong>₦${params.amount.toLocaleString()}</strong></p>
          <p>Due Date: <strong>${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong></p>
          
          <a href="${params.paymentUrl}" 
             style="display: inline-block; background: linear-gradient(90deg, #00B8FF, #BD00FF); 
                    color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; 
                    margin: 20px 0;">
            Pay Invoice Now
          </a>
          
          <p>Or copy this link: <a href="${params.paymentUrl}">${params.paymentUrl}</a></p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Questions? Reply to this email or call us at +234 XXX XXX XXXX
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${params.invoiceNumber}.pdf`,
          content: params.pdfBuffer,
        },
      ],
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
