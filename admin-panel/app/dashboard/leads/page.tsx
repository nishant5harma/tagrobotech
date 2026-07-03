"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Check, Mail, Trash2, Users } from "lucide-react";
import {
  deleteLead,
  getLeads,
  updateLeadStatus,
  type LeadRow,
} from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status: string) {
  if (status === "new") return "bg-emerald-500/10 text-emerald-700";
  if (status === "read") return "bg-sky-500/10 text-sky-700";
  return "bg-neutral-500/10 text-neutral-600";
}

function formTypeLabel(formType: string) {
  return formType === "newsletter" ? "Newsletter" : "Contact";
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadLeads() {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const data = await getLeads(token, {
      status: statusFilter === "all" ? undefined : statusFilter,
      form_type: typeFilter === "all" ? undefined : typeFilter,
    });
    setLeads(data.leads);
  }

  useEffect(() => {
    loadLeads()
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load leads"))
      .finally(() => setLoading(false));
  }, [router, statusFilter, typeFilter]);

  async function handleStatusChange(id: string, status: LeadRow["status"]) {
    const token = getStoredToken();
    if (!token) return;

    setBusyId(id);
    setError("");

    try {
      await updateLeadStatus(token, id, status);
      await loadLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    const token = getStoredToken();
    if (!token) return;
    if (!window.confirm("Delete this lead permanently?")) return;

    setBusyId(id);
    setError("");

    try {
      await deleteLead(token, id);
      await loadLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lead");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Leads</h1>
        <p className="mt-1 text-sm text-muted">Contact form submissions and inquiries.</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--orange)]" />
            <h2 className="font-semibold text-foreground">All Leads</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="login-input rounded-lg border border-[var(--form-border)] bg-[var(--input-bg)] px-3 py-2 text-xs"
            >
              <option value="all">All types</option>
              <option value="contact">Contact</option>
              <option value="newsletter">Newsletter</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="login-input rounded-lg border border-[var(--form-border)] bg-[var(--input-bg)] px-3 py-2 text-xs"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
            <span className="text-sm text-muted">{leads.length} shown</span>
          </div>
        </div>

        {error ? <p className="px-6 py-4 text-sm text-[var(--error-text)]">{error}</p> : null}

        {loading ? (
          <p className="px-6 py-8 text-sm text-muted">Loading leads...</p>
        ) : leads.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Mail className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-4 text-sm font-medium text-foreground">No leads yet</p>
            <p className="mt-2 text-sm text-muted">
              Leads from your website contact forms will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Received</th>
                  <th className="px-6 py-3.5 font-medium">Type</th>
                  <th className="px-6 py-3.5 font-medium">Contact</th>
                  <th className="px-6 py-3.5 font-medium">Message</th>
                  <th className="px-6 py-3.5 font-medium">Source</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border align-top">
                    <td className="px-6 py-4 text-muted">{formatDate(lead.created_at)}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-foreground">
                        {formTypeLabel(lead.form_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{lead.name || "—"}</p>
                      <a href={`mailto:${lead.email}`} className="mt-1 block text-[var(--orange)] hover:underline">
                        {lead.email}
                      </a>
                      {lead.phone ? <p className="mt-1 text-muted">{lead.phone}</p> : null}
                    </td>
                    <td className="max-w-xs px-6 py-4 text-muted">
                      <p className="line-clamp-4 whitespace-pre-wrap">{lead.message || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      <p>{lead.source_label || "—"}</p>
                      {lead.source_page ? <p className="mt-1 text-xs">{lead.source_page}</p> : null}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {lead.status !== "read" ? (
                          <button
                            type="button"
                            disabled={busyId === lead.id}
                            onClick={() => handleStatusChange(lead.id, "read")}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground transition hover:bg-[var(--surface-muted)] disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Read
                          </button>
                        ) : null}
                        {lead.status !== "archived" ? (
                          <button
                            type="button"
                            disabled={busyId === lead.id}
                            onClick={() => handleStatusChange(lead.id, "archived")}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground transition hover:bg-[var(--surface-muted)] disabled:opacity-50"
                          >
                            <Archive className="h-3.5 w-3.5" />
                            Archive
                          </button>
                        ) : null}
                        <button
                          type="button"
                          disabled={busyId === lead.id}
                          onClick={() => handleDelete(lead.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
