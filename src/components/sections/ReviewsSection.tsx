import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string | null;
  source: string;
  created_at: string;
};

const ACCENT = "#B9CF02";
const STAR_ON = "#F5B301";
const STAR_OFF = "#D9D9D9";

function Star({ size = 20, color = STAR_ON }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  );
}

function AverageStars({ value, size = 22 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = (color: string) => (
    <div style={{ display: "flex", whiteSpace: "nowrap" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} color={color} />
      ))}
    </div>
  );
  return (
    <div style={{ position: "relative", display: "inline-flex" }} aria-hidden="true">
      {row(STAR_OFF)}
      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, overflow: "hidden" }}>
        {row(STAR_ON)}
      </div>
    </div>
  );
}

function RatingStars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div style={{ display: "flex" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} color={n <= value ? STAR_ON : STAR_OFF} />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rating: 0, comment: "" });
  const [hoverStar, setHoverStar] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hp, setHp] = useState("");

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const avg = useMemo(
    () => (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0),
    [reviews]
  );

  async function submit() {
    if (hp) return;
    if (!form.name.trim() || form.rating < 1) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("reviews").insert({
      name: form.name.trim(),
      rating: form.rating,
      comment: form.comment.trim() || null,
      source: "website",
      approved: true,
    });
    if (error) {
      setStatus("error");
      return;
    }
    setForm({ name: "", rating: 0, comment: "" });
    await load();
    setStatus("sent");
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1000px] px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Reviews</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
          What our clients say.
        </h2>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-4xl font-bold leading-none text-neutral-900">
            {avg ? avg.toFixed(1) : "—"}
            <span className="text-xl text-neutral-500">/5</span>
          </span>
          <div className="flex flex-col gap-1">
            <AverageStars value={avg} />
            <span className="text-sm text-neutral-500">
              Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {loading && <p className="text-sm text-neutral-500">Loading reviews...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-sm text-neutral-500">Be the first to leave a review.</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between">
                <RatingStars value={r.rating} />
                {r.source !== "website" && (
                  <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                    via {r.source}
                  </span>
                )}
              </div>
              {r.comment && (
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-800">{r.comment}</p>
              )}
              <p className="mt-3 text-sm font-semibold text-neutral-900">{r.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
          <h3 className="text-xl font-semibold text-neutral-900">Leave a review</h3>
          {status === "sent" ? (
            <p className="mt-4 text-[15px] text-neutral-800">
              Thank you. Your review is now live.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900">Your rating</label>
                <div className="mt-1 flex" onMouseLeave={() => setHoverStar(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHoverStar(n)}
                      onClick={() => setForm({ ...form, rating: n })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star size={28} color={n <= (hoverStar || form.rating) ? STAR_ON : STAR_OFF} />
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                maxLength={100}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-[15px] outline-none focus:border-neutral-900"
              />
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Tell us about your experience"
                rows={4}
                maxLength={2000}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-[15px] outline-none focus:border-neutral-900"
              />
              <input
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              {status === "error" && (
                <p className="text-sm text-red-600">Please add your name and a star rating.</p>
              )}
              <button
                onClick={submit}
                disabled={status === "sending"}
                className="inline-flex h-[48px] items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white disabled:opacity-60 transition-colors hover:bg-[#5a3a14]"
                style={{ background: "#7a4f1e" }}
              >
                {status === "sending" ? "Submitting..." : "Submit review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
