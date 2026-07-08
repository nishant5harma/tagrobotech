"use client";

import { useEffect, useState } from "react";
import { Save, Settings } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  getFooterSettings,
  getSiteBrandingSettings,
  updateFooterSettings,
  updateSiteBrandingSettings,
  type FooterLinkItem,
  type FooterSettings,
  type SiteBrandingSettings,
} from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

const defaultBranding: SiteBrandingSettings = {
  site_name: "Tag RoBo Tech",
  default_title: "Tag RoBo Tech | Pioneers of Enterprise Asset Tracking",
  default_description:
    "Tag RoBo Tech pioneered enterprise asset tracking in India — RFID, IoT, BLE, and robotics solutions for assets, inventory, fleet, and more.",
  favicon_media_id: null,
};

const defaultFooter: FooterSettings = {
  logo_media_id: null,
  about_text:
    "We have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, remote sites etc. almost everything that needs to be tracked!",
  quick_links: [],
  support_links: [],
  legal_links: [],
  social_links: [],
  contact: {
    head_office: "",
    rnd_centre: "",
    email: "",
    sales_phone: "",
    partner_phone: "",
  },
};

function LinkListEditor({
  title,
  links,
  onChange,
}: {
  title: string;
  links: FooterLinkItem[];
  onChange: (links: FooterLinkItem[]) => void;
}) {
  function updateLink(index: number, key: keyof FooterLinkItem, value: string) {
    onChange(links.map((link, i) => (i === index ? { ...link, [key]: value } : link)));
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={() => onChange([...links, { label: "", href: "" }])}
          className="text-xs font-medium text-[var(--orange)] transition hover:underline"
        >
          Add link
        </button>
      </div>
      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={`${title}-${index}`} className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={link.label}
              onChange={(e) => updateLink(index, "label", e.target.value)}
              placeholder="Label"
              className={inputClass}
            />
            <input
              value={link.href}
              onChange={(e) => updateLink(index, "href", e.target.value)}
              placeholder="/about or https://..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:text-foreground"
            >
              Remove
            </button>
          </div>
        ))}
        {links.length === 0 ? <p className="text-sm text-muted">No links added yet.</p> : null}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [branding, setBranding] = useState<SiteBrandingSettings>(defaultBranding);
  const [footer, setFooter] = useState<FooterSettings>(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [savingFooter, setSavingFooter] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    Promise.all([getSiteBrandingSettings(token), getFooterSettings(token)])
      .then(([brandingResult, footerResult]) => {
        setBranding(brandingResult.settings);
        setFooter(footerResult.settings);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  async function saveBranding() {
    const token = getStoredToken();
    if (!token) return;
    setSavingBranding(true);
    setError("");
    setMessage("");
    try {
      const result = await updateSiteBrandingSettings(token, branding);
      setBranding(result.settings);
      setMessage("Branding settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save branding settings");
    } finally {
      setSavingBranding(false);
    }
  }

  async function saveFooter() {
    const token = getStoredToken();
    if (!token) return;
    setSavingFooter(true);
    setError("");
    setMessage("");
    try {
      const result = await updateFooterSettings(token, footer);
      setFooter(result.settings);
      setMessage("Footer settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save footer settings");
    } finally {
      setSavingFooter(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)]/30 border-t-[var(--orange)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Settings className="h-5 w-5 text-[var(--orange)]" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Site settings</h1>
        </div>
        <p className="text-sm text-muted">
          Manage global SEO defaults, favicon, footer logo, footer contact details, and footer links.
        </p>
      </div>

      {message ? (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-[var(--error-border)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error-text)]">
          {error}
        </p>
      ) : null}

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-foreground">Branding & default SEO</h2>
          <p className="mt-1 text-sm text-muted">
            Used for the global favicon and as the default metadata when a page does not override it.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Site name</label>
            <input
              value={branding.site_name}
              onChange={(e) => setBranding((prev) => ({ ...prev, site_name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Default title</label>
            <input
              value={branding.default_title}
              onChange={(e) =>
                setBranding((prev) => ({ ...prev, default_title: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Default description</label>
          <textarea
            value={branding.default_description}
            onChange={(e) =>
              setBranding((prev) => ({ ...prev, default_description: e.target.value }))
            }
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        <MediaPicker
          label="Favicon"
          accept="image"
          value={branding.favicon_media_id}
          onChange={(id) => setBranding((prev) => ({ ...prev, favicon_media_id: id }))}
        />

        <button
          type="button"
          onClick={saveBranding}
          disabled={savingBranding}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-[#252847]"
        >
          <Save className="h-4 w-4" />
          {savingBranding ? "Saving..." : "Save branding"}
        </button>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-foreground">Footer</h2>
          <p className="mt-1 text-sm text-muted">
            This controls the footer logo, about text, contact details, social links, and all footer link columns.
          </p>
        </div>

        <MediaPicker
          label="Footer logo"
          accept="image"
          value={footer.logo_media_id}
          onChange={(id) => setFooter((prev) => ({ ...prev, logo_media_id: id }))}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Footer about text</label>
          <textarea
            value={footer.about_text}
            onChange={(e) => setFooter((prev) => ({ ...prev, about_text: e.target.value }))}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Head office</label>
            <textarea
              value={footer.contact.head_office}
              onChange={(e) =>
                setFooter((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, head_office: e.target.value },
                }))
              }
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">R&amp;D centre</label>
            <textarea
              value={footer.contact.rnd_centre}
              onChange={(e) =>
                setFooter((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, rnd_centre: e.target.value },
                }))
              }
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Footer email</label>
            <input
              value={footer.contact.email}
              onChange={(e) =>
                setFooter((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Sales phone</label>
            <input
              value={footer.contact.sales_phone}
              onChange={(e) =>
                setFooter((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, sales_phone: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Partner phone</label>
            <input
              value={footer.contact.partner_phone}
              onChange={(e) =>
                setFooter((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, partner_phone: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
        </div>

        <LinkListEditor
          title="Quick links"
          links={footer.quick_links}
          onChange={(quick_links) => setFooter((prev) => ({ ...prev, quick_links }))}
        />
        <LinkListEditor
          title="Support links"
          links={footer.support_links}
          onChange={(support_links) => setFooter((prev) => ({ ...prev, support_links }))}
        />
        <LinkListEditor
          title="Legal links"
          links={footer.legal_links}
          onChange={(legal_links) => setFooter((prev) => ({ ...prev, legal_links }))}
        />
        <LinkListEditor
          title="Social links"
          links={footer.social_links}
          onChange={(social_links) => setFooter((prev) => ({ ...prev, social_links }))}
        />

        <button
          type="button"
          onClick={saveFooter}
          disabled={savingFooter}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-[#252847]"
        >
          <Save className="h-4 w-4" />
          {savingFooter ? "Saving..." : "Save footer"}
        </button>
      </section>
    </div>
  );
}
