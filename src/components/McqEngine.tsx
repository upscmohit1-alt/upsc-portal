"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type McqQuestion = {
  topic: string;
  stem: string;
  statements?: string[];
  ask?: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: McqQuestion[] = [
  {
    topic: "Economy",
    stem: "With reference to Liquidity Adjustment Facility (LAF) of RBI, consider the following statements:",
    statements: [
      "Banks can borrow from RBI by pledging government securities as collateral.",
      "Repo rate is the rate at which RBI borrows from commercial banks.",
      "Standing Deposit Facility (SDF) replaced reverse repo as floor rate in 2022.",
    ],
    ask: "Which of the statements given above is/are correct?",
    options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
    answer: 2,
    explanation:
      "1 is correct, 2 is incorrect, and 3 is correct. Repo is rate for banks borrowing from RBI, and SDF became the floor rate in 2022.",
  },
  {
    topic: "Polity",
    stem: 'Regarding discretionary powers of a Governor in India, consider the following statements:',
    statements: [
      "Governor can reserve a bill for the consideration of the President.",
      "Governor must always act on aid and advice of Council of Ministers.",
      "Governor can send messages to either House of State Legislature.",
    ],
    ask: "Which of the above are correct?",
    options: ["1 only", "1 and 3 only", "2 and 3 only", "1, 2 and 3"],
    answer: 1,
    explanation: "1 and 3 are correct. 2 is not universally correct due constitutional discretion in specific situations.",
  },
  {
    topic: "Environment",
    stem: "Which of the following best explains India's Nationally Determined Contributions (NDCs) under the Paris Agreement?",
    options: [
      "They are legally binding emission caps enforced by UNFCCC tribunal",
      "They are nationally decided climate commitments updated periodically",
      "They are annual targets fixed by IPCC",
      "They apply only to developed countries",
    ],
    answer: 1,
    explanation:
      "NDCs are nationally determined commitments submitted by each country and revised over time with greater ambition.",
  },
  {
    topic: "Science & Tech",
    stem: "The Crew Escape System tested for Gaganyaan is primarily intended to:",
    options: [
      "Improve rocket payload capacity",
      "Enable orbital docking",
      "Safely separate crew module during launch emergency",
      "Reduce mission fuel consumption",
    ],
    answer: 2,
    explanation:
      "The crew escape system protects astronauts by quickly pulling the crew module away during a launch abort.",
  },
  {
    topic: "International Relations",
    stem: "A key point of contention in India-EU FTA digital chapter has been:",
    options: ["Agricultural MSP", "Data flows and e-commerce rules", "Nuclear liability", "Fisheries quotas only"],
    answer: 1,
    explanation:
      "Digital trade negotiations focus on data governance, cross-border flows, and regulatory flexibility.",
  },
  {
    topic: "Polity",
    stem: "Article 200 of the Indian Constitution primarily deals with:",
    options: [
      "Powers of Rajya Sabha over Money Bills",
      "Governor's assent to state bills",
      "Emergency proclamation process",
      "Dissolution of Panchayats",
    ],
    answer: 1,
    explanation:
      "Article 200 describes the Governor's options regarding bills passed by state legislature.",
  },
  {
    topic: "Economy",
    stem: "Open Market Operations (OMOs) by RBI involve:",
    options: [
      "Buying and selling government securities",
      "Changing income tax rates",
      "Direct transfer to households",
      "Fixing MSP for crops",
    ],
    answer: 0,
    explanation:
      "Through OMO, RBI buys/sells government securities to manage system liquidity.",
  },
  {
    topic: "History",
    stem: "Which movement is correctly paired with its immediate trigger?",
    options: [
      "Quit India Movement - Partition of Bengal",
      "Non-Cooperation Movement - Jallianwala Bagh and Khilafat",
      "Civil Disobedience - Simon Commission appointment",
      "Swadeshi Movement - Rowlatt Act",
    ],
    answer: 1,
    explanation:
      "Non-Cooperation gained momentum from outrage over Jallianwala Bagh and the Khilafat issue.",
  },
  {
    topic: "Geography",
    stem: "The Indian monsoon is most strongly influenced by:",
    options: [
      "Uniform global temperature",
      "Land-sea thermal contrast and ITCZ shifts",
      "Only Himalayan snowfall",
      "Only El Nino every year",
    ],
    answer: 1,
    explanation:
      "Seasonal differential heating and ITCZ movement drive monsoon circulation; other factors modulate it.",
  },
  {
    topic: "Ethics",
    stem: "In public administration, 'integrity' is best understood as:",
    options: [
      "Personal loyalty to superiors",
      "Strict rule-following without context",
      "Consistency of values, actions, and public interest",
      "Maximizing departmental publicity",
    ],
    answer: 2,
    explanation:
      "Integrity reflects principled consistency, honesty, and alignment with constitutional/public values.",
  },
];

export default function McqEngine({ compact = false }: { compact?: boolean }) {
  const total = questions.length;
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(total).fill(null));
  const [submitted, setSubmitted] = useState<boolean[]>(Array(total).fill(false));
  const [reviewLater, setReviewLater] = useState<boolean[]>(Array(total).fill(false));
  const [showAnalysis, setShowAnalysis] = useState(false);

  const active = questions[current];
  const selected = selectedAnswers[current];
  const checked = submitted[current];

  const attemptedCount = submitted.filter(Boolean).length;
  const correctCount = submitted.reduce((count, isSubmitted, index) => {
    if (!isSubmitted) return count;
    return selectedAnswers[index] === questions[index].answer ? count + 1 : count;
  }, 0);
  const progress = (attemptedCount / total) * 100;
  const dots = useMemo(() => Array.from({ length: total }), [total]);
  const allSubmitted = attemptedCount === total;

  const goToNext = () => {
    if (current < total - 1) {
      setCurrent((v) => v + 1);
      return;
    }
    if (allSubmitted) setShowAnalysis(true);
  };

  const triggerCorrectBurst = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 40,
        spread: 55,
        startVelocity: 32,
        origin: { y: 0.62 },
        scalar: 0.8,
        colors: ["#1a6b3a", "#47b97a", "#9ddab8"],
      });
    } catch {
      // Silently ignore if library fails to load.
    }
  };

  if (showAnalysis) {
    return (
      <section className={compact ? "" : "mb-8"}>
        {!compact ? (
          <div className="mb-5 flex items-end justify-between border-b-2 border-blackish pb-2.5">
            <h2 className="font-serif text-xl font-bold text-blackish">Detailed Analysis</h2>
            <span className="text-xs font-semibold tracking-wide text-red">
              Score: {correctCount}/{total}
            </span>
          </div>
        ) : null}
        <div className="rounded-md border border-white/20 bg-white/40 p-8 shadow-xl backdrop-blur-md">
          <p className="mb-4 text-sm text-mid">
            Attempted: {attemptedCount}/{total} · Correct: {correctCount} · Review Later flagged:{" "}
            {reviewLater.filter(Boolean).length}
          </p>
          <div className="space-y-3">
            {questions.map((q, index) => {
              const wasSubmitted = submitted[index];
              const picked = selectedAnswers[index];
              const correct = wasSubmitted && picked === q.answer;
              return (
                <div key={`${q.topic}-${index}`} className="rounded border border-white/20 bg-white/35 p-3 shadow-xl backdrop-blur-md">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                    Q{index + 1} · {q.topic}
                  </p>
                  <p className="mb-2 font-serif text-sm font-semibold text-blackish">{q.stem}</p>
                  <p className={`text-xs font-semibold ${correct ? "text-green" : "text-red"}`}>
                    {wasSubmitted ? (correct ? "Correct" : "Incorrect") : "Not Submitted"}
                    {reviewLater[index] ? " · Marked Review Later" : ""}
                  </p>
                  <p className="mt-1 text-xs text-mid">Explanation: {q.explanation}</p>
                </div>
              );
            })}
          </div>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setCurrent(0);
              setSelectedAnswers(Array(total).fill(null));
              setSubmitted(Array(total).fill(false));
              setReviewLater(Array(total).fill(false));
              setShowAnalysis(false);
            }}
          >
            Restart Quiz
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={compact ? "" : "mb-8"}>
      {!compact ? (
        <div className="mb-5 flex items-end justify-between border-b-2 border-blackish pb-2.5">
          <h2 className="font-serif text-xl font-bold text-blackish">Daily MCQ Practice</h2>
          <a className="text-xs font-semibold tracking-wide text-red" href="#">
            Full MCQ bank →
          </a>
        </div>
      ) : (
        <div className="mb-3 flex items-center justify-between border-b border-borderTone pb-2">
          <h3 className="font-serif text-lg font-bold text-blackish">MCQ Practice</h3>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-red">Live</span>
        </div>
      )}
      <div className="overflow-hidden rounded-md border border-white/20 bg-white/40 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between bg-blackish px-5 py-3.5">
          <div>
            <h3 className="font-serif text-[15px] font-bold text-white">Today&apos;s 10 Questions — 13 April 2025</h3>
            <p className="text-[11px] text-white/55">Current Affairs + Static — Mixed topics</p>
          </div>
          <div className="rounded bg-white/10 px-3 py-1.5 text-sm font-bold text-white">
            {correctCount} / {total}
          </div>
        </div>
        <div className="h-1 bg-white/10">
          <div className="h-full bg-saffron transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="p-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
            Question {current + 1} of {total} · {active.topic}
          </p>
          <p className="mb-3 font-serif text-base font-semibold leading-[1.7] text-blackish">{active.stem}</p>
          {active.statements ? (
            <ol className="mb-3 ml-5 list-decimal space-y-1 text-sm leading-[1.7] text-mid">
              {active.statements.map((statement) => (
                <li key={statement}>{statement}</li>
              ))}
            </ol>
          ) : null}
          {active.ask ? <p className="mb-5 text-sm font-semibold text-blackish">{active.ask}</p> : null}
          <div className="mb-5 space-y-2">
            {active.options.map((opt, index) => {
              const state = checked
                ? index === active.answer
                  ? "correct"
                  : index === selected
                    ? "wrong"
                    : "plain"
                : index === selected
                  ? "selected"
                  : "plain";
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (checked) return;
                    setSelectedAnswers((prev) => {
                      const next = [...prev];
                      next[current] = index;
                      return next;
                    });
                  }}
                  className={`flex w-full items-start gap-2.5 rounded border px-3.5 py-3 text-left text-[13.5px] ${
                    state === "correct"
                      ? "scale-105 border-green bg-greenLight shadow-[0_0_0_1px_rgba(26,107,58,0.35),0_0_22px_rgba(26,107,58,0.2)]"
                      : state === "wrong"
                        ? "scale-105 border-red bg-redLight shadow-[0_0_0_1px_rgba(192,57,43,0.28),0_0_18px_rgba(192,57,43,0.16)]"
                        : state === "selected"
                          ? "scale-105 border-blue bg-blueLight shadow-[0_0_0_1px_rgba(26,79,138,0.3),0_0_18px_rgba(26,79,138,0.16)]"
                          : "border-borderTone bg-bgSoft hover:border-blackish hover:bg-[#f6f0e6]"
                  }`}
                  style={{ transition: "transform 180ms ease, box-shadow 220ms ease, border-color 180ms ease, background-color 180ms ease" }}
                >
                  <span className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full border border-borderTone text-[11px] font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {checked && (
            <div className="mb-4 rounded-r border-l-[3px] border-green bg-bg2 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-green">Explanation</p>
              <p className="text-sm text-mid">{active.explanation}</p>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            {!checked ? (
              <Button onClick={() => {
                if (selected === null) return;
                const isCorrect = selected === active.answer;
                if (isCorrect) {
                  void triggerCorrectBurst();
                }
                setSubmitted((prev) => {
                  const next = [...prev];
                  next[current] = true;
                  return next;
                });
              }}>
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={goToNext}
              >
                {current === total - 1 ? "View Detailed Analysis →" : "Next Question →"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setReviewLater((prev) => {
                  const next = [...prev];
                  next[current] = !next[current];
                  return next;
                });
                if (!checked) goToNext();
              }}
            >
              {reviewLater[current] ? "Remove Review Later" : "Review Later"}
            </Button>
            <span className="ml-auto text-xs text-muted">
              {checked ? `${selected === active.answer ? "Correct" : "Incorrect"} attempt` : ""}
            </span>
          </div>
          <div className="mt-5 flex justify-center gap-1.5">
            {dots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === current
                    ? "scale-125 bg-blackish"
                    : submitted[index]
                      ? selectedAnswers[index] === questions[index].answer
                        ? "bg-green"
                        : "bg-red"
                      : reviewLater[index]
                        ? "bg-saffron"
                        : "bg-[#ede9e2]"
                }`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
