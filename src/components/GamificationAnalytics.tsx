"use client";

import { useEffect, useMemo, useState } from "react";
import type { StudentAnalytics } from "@/lib/analytics";

function scoreTone(score: number) {
  if (score >= 75) return "bg-green";
  if (score >= 55) return "bg-saffron";
  return "bg-red";
}

export default function GamificationAnalytics() {
  const [data, setData] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/me", {
          headers: { "x-user-id": "student-current-session" },
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed analytics fetch");
        const payload = (await response.json()) as StudentAnalytics;
        setData(payload);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    void loadAnalytics();
  }, []);

  const fallbackDays = useMemo(() => Array.from({ length: 28 }, () => false), []);
  const streakDays = data?.streakDays ?? 0;
  const days = data?.last28Days ?? fallbackDays;
  const subjects = data?.subjectScores ?? [];

  return (
    <div className="overflow-hidden rounded border border-white/20 bg-white/40 shadow-xl backdrop-blur-md">
      <div className="border-b border-borderTone bg-bg2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        Gamification & Analytics
      </div>
      <div className="p-4">
        <div className="mb-4 rounded border border-borderTone/70 bg-bgSoft/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Streak Tracker</p>
          <p className="mt-1 text-sm font-semibold text-blackish">
            {loading ? "Loading..." : `${streakDays} day streak`}
          </p>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {days.map((done, index) => (
              <div
                key={index}
                className={`h-4 rounded-sm border ${
                  done ? "border-green/50 bg-green/70" : "border-borderTone bg-[#efe7da]"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-mid">Daily 10 MCQs completion over last 28 days.</p>
        </div>

        <div className="rounded border border-borderTone/70 bg-bgSoft/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Subject-Wise Heatmap</p>
          <div className="mt-2 space-y-2.5">
            {loading ? (
              <p className="text-xs text-mid">Loading subject performance...</p>
            ) : (
              subjects.map((item) => (
                <div key={item.subject}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-blackish">{item.subject}</span>
                    <span className="font-semibold text-mid">{item.accuracy}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded bg-[#e5ddce]">
                    <div
                      className={`h-full ${scoreTone(item.accuracy)}`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="mt-2 text-[11px] text-mid">Identify weak subjects quickly and prioritize revision.</p>
        </div>
      </div>
    </div>
  );
}
