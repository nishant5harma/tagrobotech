export type LeadFormType = "contact" | "newsletter";

export type SubmitLeadPayload = {
  form_type?: LeadFormType;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  source_page?: string;
  source_label?: string;
};

export async function submitLead(payload: SubmitLeadPayload): Promise<{ message: string }> {
  const response = await fetch("/api/public/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit form");
  }

  return data as { message: string };
}
