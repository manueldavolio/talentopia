import type { PracticalExercise } from "@/data/courses/match-analyst";

interface PracticalExerciseProps {
  exercise: PracticalExercise;
}

export function PracticalExercise({ exercise }: PracticalExerciseProps) {
  return (
    <section className="rounded-2xl bg-cyan-500/10 border border-cyan-400/30 p-6">
      <h3 className="text-lg font-black flex items-center gap-2">
        🏋️ Esercizio pratico
      </h3>
      <p className="mt-2 font-bold text-cyan-200">{exercise.title}</p>
      <p className="mt-2 text-white/85">{exercise.instructions}</p>
    </section>
  );
}
