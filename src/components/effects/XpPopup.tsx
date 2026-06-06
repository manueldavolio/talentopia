"use client";

export function XpPopup({ amount, show }: { amount: number; show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100]">
      <div className="animate-bounce-in text-center">
        <p className="text-6xl font-black text-yellow-300 drop-shadow-lg">+{amount} XP</p>
        <p className="text-2xl mt-2">🎉 Grande!</p>
      </div>
    </div>
  );
}
