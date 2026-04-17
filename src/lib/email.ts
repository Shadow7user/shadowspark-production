import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendWelcomeEmail(email: string, businessName: string, demoSlug: string) {
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY is missing. Skipping welcome email.');
    return null;
  }

  // Support Vercel deployments and custom cloud run URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://shadowspark-tech.org';
  const demoUrl = `${baseUrl.replace(/\/$/, '')}/demo/${demoSlug}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; max-w: 600px; margin: 0 auto; padding: 20px; background-color: #0A0A0A; color: #E4E4E7; border: 1px solid #27272A; border-radius: 12px;">
      <div style="margin-bottom: 30px;">
        <span style="display: inline-block; background-color: #00E5FF; padding: 4px 12px; border-radius: 9999px; color: #000; font-family: monospace; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em;">
          ShadowSpark Intelligence
        </span>
      </div>
      <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 900; margin-bottom: 16px; letter-spacing: -0.02em;">System Audit Provisioned.</h1>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #A1A1AA;">
        Your tailored environment for <strong>${businessName || 'your business'}</strong> is live. The cloud crawler is extracting your site's intelligence map as you read this.
      </p>
      
      <div style="background-color: #18181B; border: 1px solid #27272A; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
        <p style="font-family: monospace; font-size: 12px; color: #00E5FF; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 10px 0;">Target Slug:</p>
        <p style="color: #FFFFFF; margin: 0; font-family: monospace; font-size: 14px;">${demoSlug}</p>
      </div>

      <a href="${demoUrl}" style="display: inline-block; background-color: #00E5FF; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.1em;">
        Access Dedicated Surface
      </a>

      <p style="font-size: 13px; line-height: 1.6; margin-top: 40px; color: #71717A;">
        The system will await your command. If you encounter any friction, reply directly to this frequency.
        <br><br>
        — The ShadowSpark Pipeline
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'ShadowSpark Operations <ops@shadowspark-tech.org>',
      to: [email],
      subject: `[ShadowSpark] Your Intelligence Surface is Ready`,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send welcome email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[Email] Exception during welcome email send:', error);
    return null;
  }
}

