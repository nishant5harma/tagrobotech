"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  assetManagementSolutionSectionToPayload,
  normalizeAssetManagementSolutionSectionData,
  type AssetManagementSolutionSectionData,
  type AssetSolutionFeature,
  type AssetSolutionTab,
} from "@/lib/asset-management-solution-section";

type AssetManagementSolutionSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function AssetManagementSolutionSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: AssetManagementSolutionSectionEditorProps) {
  const [data, setData] = useState<AssetManagementSolutionSectionData>(() =>
    normalizeAssetManagementSolutionSectionData(initialData)
  );
  const [openTabIndex, setOpenTabIndex] = useState<number | null>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof AssetManagementSolutionSectionData>(
    key: K,
    value: AssetManagementSolutionSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateTab(index: number, patch: Partial<AssetSolutionTab>) {
    setData((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab, tabIndex) =>
        tabIndex === index ? { ...tab, ...patch } : tab
      ),
    }));
  }

  function updateTabButton(index: number, field: "text" | "link", value: string) {
    setData((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab, tabIndex) =>
        tabIndex === index ? { ...tab, cta_button: { ...tab.cta_button, [field]: value } } : tab
      ),
    }));
  }

  function updateFeature(tabIndex: number, featureIndex: number, patch: Partial<AssetSolutionFeature>) {
    setData((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab, index) => {
        if (index !== tabIndex) return tab;
        return {
          ...tab,
          features: tab.features.map((feature, fIndex) =>
            fIndex === featureIndex ? { ...feature, ...patch } : feature
          ),
        };
      }),
    }));
  }

  function addFeature(tabIndex: number) {
    setData((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab, index) =>
        index === tabIndex
          ? { ...tab, features: [...tab.features, { title: "", description: "" }] }
          : tab
      ),
    }));
  }

  function removeFeature(tabIndex: number, featureIndex: number) {
    setData((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab, index) =>
        index === tabIndex
          ? { ...tab, features: tab.features.filter((_, fIndex) => fIndex !== featureIndex) }
          : tab
      ),
    }));
  }

  function addTab() {
    setData((prev) => ({
      ...prev,
      tabs: [
        ...prev.tabs,
        {
          id: `tab-${prev.tabs.length + 1}`,
          label: "New Tab",
          panel_heading: "New Tab Heading",
          panel_description: "",
          features: [{ title: "Feature title", description: "" }],
          cta_button: { text: "Complete control", link: "/contact" },
          image_media_id: null,
          image_src: "/assets-images/laptop.png",
          image_alt: "Dashboard preview",
        },
      ],
    }));
    setOpenTabIndex(data.tabs.length);
  }

  function removeTab(index: number) {
    setData((prev) => ({
      ...prev,
      tabs: prev.tabs.filter((_, tabIndex) => tabIndex !== index),
    }));
    setOpenTabIndex(null);
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      await onSave(assetManagementSolutionSectionToPayload(data), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => onIsActiveChange(e.target.checked)}
          className="rounded border-border"
        />
        Section visible on page
      </label>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Section header</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading
            </label>
            <input
              value={data.heading}
              onChange={(e) => updateField("heading", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading accent (orange)
            </label>
            <input
              value={data.heading_accent}
              onChange={(e) => updateField("heading_accent", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Tabs ({data.tabs.length})
        </legend>

        {data.tabs.map((tab, index) => {
          const isOpen = openTabIndex === index;

          return (
            <div key={`${tab.id}-${index}`} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenTabIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="font-medium text-foreground">
                  {index + 1}. {tab.label}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted" />
                )}
              </button>

              {isOpen ? (
                <div className="space-y-4 border-t border-border px-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Tab label
                      </label>
                      <input
                        value={tab.label}
                        onChange={(e) => updateTab(index, { label: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Tab ID
                      </label>
                      <input
                        value={tab.id}
                        onChange={(e) => updateTab(index, { id: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Panel heading
                    </label>
                    <input
                      value={tab.panel_heading}
                      onChange={(e) => updateTab(index, { panel_heading: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Panel description
                    </label>
                    <textarea
                      value={tab.panel_description}
                      onChange={(e) => updateTab(index, { panel_description: e.target.value })}
                      rows={3}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Accordion features</p>
                    {tab.features.map((feature, featureIndex) => (
                      <div
                        key={`${feature.title}-${featureIndex}`}
                        className="space-y-2 rounded-xl border border-border p-3"
                      >
                        <input
                          value={feature.title}
                          onChange={(e) =>
                            updateFeature(index, featureIndex, { title: e.target.value })
                          }
                          placeholder="Feature title"
                          className={inputClass}
                        />
                        <textarea
                          value={feature.description}
                          onChange={(e) =>
                            updateFeature(index, featureIndex, { description: e.target.value })
                          }
                          placeholder="Feature description"
                          rows={2}
                          className={`${inputClass} resize-y`}
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index, featureIndex)}
                          className="inline-flex items-center gap-1.5 text-sm text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove feature
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(index)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--orange)]"
                    >
                      <Plus className="h-4 w-4" />
                      Add feature
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        CTA text
                      </label>
                      <input
                        value={tab.cta_button.text}
                        onChange={(e) => updateTabButton(index, "text", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        CTA link
                      </label>
                      <input
                        value={tab.cta_button.link}
                        onChange={(e) => updateTabButton(index, "link", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <MediaPicker
                    label="Dashboard image (optional)"
                    value={tab.image_media_id}
                    onChange={(mediaId) => updateTab(index, { image_media_id: mediaId })}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Fallback image path
                      </label>
                      <input
                        value={tab.image_src}
                        onChange={(e) => updateTab(index, { image_src: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Image alt text
                      </label>
                      <input
                        value={tab.image_alt}
                        onChange={(e) => updateTab(index, { image_alt: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTab(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove tab
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addTab}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--orange)]"
        >
          <Plus className="h-4 w-4" />
          Add tab
        </button>
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save section"}
      </button>
    </div>
  );
}
