"use client";

import { GameButton } from "@/components/ui/GameButton";
import { VersusScoreboard } from "@/components/versus/VersusScoreboard";
import type { VersusMatchResult, VersusPlayerStats } from "@/types";

interface VersusResultProps {
  result: VersusMatchResult;
  funnyPhrase: string;
  player1Stats: VersusPlayerStats;
  player2Stats: VersusPlayerStats;
  onPlayAgain: () => void;
}

export function VersusResult({
  result,
  funnyPhrase,
  player1Stats,
  player2Stats,
  onPlayAgain,
}: VersusResultProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      <div className="rounded-3xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/40 p-8">
        {result.isDraw ? (
          <>
            <span className="text-5xl">🤝</span>
            <h2 className="text-3xl font-black mt-4">Pareggio!</h2>
          </>
        ) : (
          <>
            <span className="text-5xl">🏆</span>
            <h2 className="text-3xl font-black mt-4">Vincitore</h2>
            <p className="text-2xl font-black text-yellow-300 mt-2">
              {result.winnerName}
            </p>
          </>
        )}
        <p className="text-lg mt-4 italic text-white/80">&ldquo;{funnyPhrase}&rdquo;</p>
      </div>

      <VersusScoreboard
        player1Name={result.player1Name}
        player2Name={result.player2Name}
        player1={player1Stats}
        player2={player2Stats}
      />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-black/20 p-3">
          <p className="text-white/60">{result.player1Name}</p>
          <p className="font-bold">{result.player1Correct} corrette</p>
          <p className="font-bold">{result.player1Penalties} rigori</p>
        </div>
        <div className="rounded-2xl bg-black/20 p-3">
          <p className="text-white/60">{result.player2Name}</p>
          <p className="font-bold">{result.player2Correct} corrette</p>
          <p className="font-bold">{result.player2Penalties} rigori</p>
        </div>
      </div>

      {result.tiebreakUsed && (
        <p className="text-sm text-cyan-300">Deciso con spareggio / rigore decisivo</p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <GameButton size="lg" onClick={onPlayAgain}>
          Nuova sfida ⚔️
        </GameButton>
        <GameButton href="/" variant="secondary" size="lg">
          Torna home
        </GameButton>
      </div>
    </div>
  );
}
