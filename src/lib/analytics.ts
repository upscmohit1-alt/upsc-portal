export type SubjectScore = {
  subject: string;
  accuracy: number;
};

export type StudentAnalytics = {
  streakDays: number;
  last28Days: boolean[];
  subjectScores: SubjectScore[];
};

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function stringToSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

export function getStudentAnalytics(userId: string): StudentAnalytics {
  const random = seededRandom(stringToSeed(userId));
  const last28Days = Array.from({ length: 28 }, () => random() > 0.38);

  let streakDays = 0;
  for (let i = last28Days.length - 1; i >= 0; i -= 1) {
    if (!last28Days[i]) break;
    streakDays += 1;
  }

  const subjectScores: SubjectScore[] = [
    { subject: "Polity", accuracy: Math.round(72 + random() * 18) },
    { subject: "Economy", accuracy: Math.round(55 + random() * 25) },
    { subject: "Environment", accuracy: Math.round(48 + random() * 32) },
    { subject: "History", accuracy: Math.round(45 + random() * 30) },
    { subject: "Art & Culture", accuracy: Math.round(30 + random() * 25) },
    { subject: "Science & Tech", accuracy: Math.round(52 + random() * 28) },
  ];

  return {
    streakDays,
    last28Days,
    subjectScores,
  };
}
