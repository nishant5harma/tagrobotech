const FORM_TYPES = new Set(["contact", "newsletter"]);
const LEAD_STATUSES = new Set(["new", "read", "archived"]);

export function sanitizeLeadText(value, maxLen = 5000) {
  if (value == null) return null;
  const str = String(value).trim();
  if (!str) return null;
  return str.slice(0, maxLen);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLeadInput(body = {}) {
  const formType = FORM_TYPES.has(body.form_type) ? body.form_type : "contact";
  const email = sanitizeLeadText(body.email, 255);

  if (!email || !isValidEmail(email)) {
    return { error: "A valid email is required" };
  }

  const name = sanitizeLeadText(body.name, 255);
  const phone = sanitizeLeadText(body.phone, 50);
  const message = sanitizeLeadText(body.message, 10000);
  const sourcePage = sanitizeLeadText(body.source_page, 255);
  const sourceLabel = sanitizeLeadText(body.source_label, 255);

  if (formType === "contact") {
    if (!name) return { error: "Name is required" };
    if (!phone) return { error: "Phone is required" };
    if (!message) return { error: "Message is required" };
  }

  return {
    data: {
      form_type: formType,
      name: name ?? null,
      email,
      phone: phone ?? null,
      message:
        formType === "newsletter"
          ? message ?? "Newsletter subscription request"
          : message,
      source_page: sourcePage ?? null,
      source_label: sourceLabel ?? null,
    },
  };
}

export function parseLeadRow(row) {
  if (!row) return row;

  let metadata = row.metadata;
  if (typeof metadata === "string") {
    try {
      metadata = JSON.parse(metadata);
    } catch {
      metadata = null;
    }
  }

  return {
    ...row,
    metadata,
  };
}

export function isValidLeadStatus(status) {
  return LEAD_STATUSES.has(status);
}
