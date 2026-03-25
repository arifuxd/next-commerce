interface MediaSectionProps {
  imageUrl: string | null;
  title: string;
}

export function MediaSection({ imageUrl, title }: MediaSectionProps) {
  return (
    <section className="grid gap-5 rounded-3xl border border-slate-200 bg-white px-6 py-8 md:grid-cols-2 md:px-10">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-100 via-white to-amber-100 p-5">
        <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-white/60 bg-white/70 p-4 text-center text-sm text-slate-600">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full max-h-[320px] w-full rounded-lg object-cover" />
          ) : (
            <p>à¦ªà§à¦°à§‹à¦¡à¦¾à¦•à§à¦Ÿà§‡à¦° à¦ªà§à¦°à¦¿à¦­à¦¿à¦‰ à¦›à¦¬à¦¿ à¦¬à¦¾ à¦­à¦¿à¦¡à¦¿à¦“ à¦à¦–à¦¾à¦¨à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤</p>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase text-sky-700">à¦­à¦¿à¦œà§à¦¯à§à§Ÿà¦¾à¦² à¦“à§Ÿà¦¾à¦•à¦¥à§à¦°à§</p>
        <h2 className="mt-3 text-3xl font-black text-slate-900">à¦†à¦ªà¦¨à¦¿ à¦•à§€ à¦•à¦¿à¦¨à¦›à§‡à¦¨, à¦¤à¦¾ à¦ªà¦°à¦¿à¦·à§à¦•à¦¾à¦°à¦­à¦¾à¦¬à§‡ à¦¦à§‡à¦–à§à¦¨</h2>
        <p className="mt-4 text-sm text-slate-600 md:text-base">
          à¦à¦‡ à¦ªà§à¦°à§‹à¦¡à¦¾à¦•à§à¦Ÿ à¦¤à¦¾à§Žà¦•à§à¦·à¦£à¦¿à¦• à¦•à¦¾à¦œà§‡ à¦²à¦¾à¦—à¦¾à¦¨à§‹à¦° à¦œà¦¨à§à¦¯ à¦¤à§ˆà¦°à¦¿à¥¤ à¦ªà§à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦…à¦‚à¦¶ à¦à¦®à¦¨à¦­à¦¾à¦¬à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦†à¦ªà¦¨à¦¿ à¦¦à§à¦°à§à¦¤ à¦¬à¦¾à¦¸à§à¦¤à¦¬à¦¾à§Ÿà¦¨ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨ à¦à¦¬à¦‚ à¦•à¦® à¦ªà¦°à§€à¦•à§à¦·à¦¾-à¦¨à¦¿à¦°à§€à¦•à§à¦·à¦¾à§Ÿ à¦­à¦¾à¦²à§‹ à¦«à¦² à¦ªà¦¾à¦¨à¥¤
        </p>
      </div>
    </section>
  );
}

