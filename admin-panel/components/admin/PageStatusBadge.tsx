export default function PageStatusBadge({ status }: { status: string }) {
  const published = status === "published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-800/40"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-800/40"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      {status}
    </span>
  );
}
