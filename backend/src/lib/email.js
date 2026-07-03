import { Resend } from "resend";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendLeadNotificationEmail(lead) {
  const resend = getResendClient();
  const to = process.env.LEADS_NOTIFY_EMAIL?.trim();

  if (!resend || !to) {
    console.warn("Lead email skipped: RESEND_API_KEY or LEADS_NOTIFY_EMAIL is not configured");
    return { sent: false, reason: "not_configured" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "Tag RoBo Tech <onboarding@resend.dev>";
  const formLabel = lead.form_type === "newsletter" ? "Newsletter signup" : "Contact inquiry";
  const subject = `[Tag RoBo Tech] New ${formLabel} from ${lead.name || lead.email}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f2744;">
      <h2 style="margin: 0 0 16px;">New website lead</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Type</td><td>${escapeHtml(formLabel)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Name</td><td>${escapeHtml(lead.name || "—")}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td>${escapeHtml(lead.email)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Phone</td><td>${escapeHtml(lead.phone || "—")}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Source</td><td>${escapeHtml(lead.source_label || "—")}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Page</td><td>${escapeHtml(lead.source_page || "—")}</td></tr>
      </table>
      <h3 style="margin: 24px 0 8px;">Message</h3>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(lead.message || "—")}</p>
    </div>
  `;

  const text = [
    "New website lead",
    "",
    `Type: ${formLabel}`,
    `Name: ${lead.name || "—"}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "—"}`,
    `Source: ${lead.source_label || "—"}`,
    `Page: ${lead.source_page || "—"}`,
    "",
    "Message:",
    lead.message || "—",
  ].join("\n");

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: lead.email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Resend lead email error:", error);
    return { sent: false, reason: error.message || "send_failed" };
  }

  return { sent: true, id: data?.id ?? null };
}
