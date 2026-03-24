export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
        <div className="h-72 animate-pulse rounded-2xl bg-white/10" />
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-80 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-80 animate-pulse rounded-2xl bg-white/10" />
        </div>
      </div>
    </main>
  );
}
