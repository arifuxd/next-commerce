export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="h-56 animate-pulse rounded-3xl bg-white/10" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-72 animate-pulse rounded-2xl bg-white/10" />
        ))}
      </div>
    </main>
  );
}
