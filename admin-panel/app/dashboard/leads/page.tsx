"use client";

export default function LeadsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Leads</h1>
        <p className="mt-1 text-sm text-muted">Contact form submissions and inquiries.</p>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No leads yet</p>
        <p className="mt-2 text-sm text-muted">
          Leads from your website contact forms will appear here.
        </p>
      </div>
    </div>
  );
}
