"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AVATARS } from "@/lib/constants";
import { createPlayer, loadPlayer, savePlayer } from "@/lib/player";
import { usePlayer } from "@/context/PlayerContext";
import { GameButton } from "@/components/ui/GameButton";

export default function LoginPage() {
  const router = useRouter();
  const { setPlayer } = usePlayer();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleStart = () => {
    if (name.trim().length < 2) return;
    const existing = loadPlayer();
    const player =
      existing?.name === name.trim()
        ? { ...existing, avatar }
        : createPlayer(name, avatar);
    if (existing?.name === name.trim()) {
      savePlayer(player);
    }
    setPlayer(player);
    router.push("/");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white/10 border border-white/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-6xl">⚡</span>
          <h1 className="text-3xl font-black mt-2 bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
            Benvenuto in Talentopia!
          </h1>
          <p className="text-white/70 mt-2">Inserisci il tuo nome da giocatore</p>
        </div>

        <label className="block text-sm font-bold mb-2">Nome giocatore</label>
        <input
          type="text"
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Es. MarcoPro"
          className="w-full rounded-2xl bg-black/30 border border-white/20 px-4 py-3 text-lg font-bold focus:outline-none focus:border-yellow-400"
        />

        <p className="mt-6 text-sm font-bold mb-2">Scegli avatar</p>
        <div className="grid grid-cols-8 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`text-2xl rounded-xl p-2 transition ${
                avatar === a ? "bg-yellow-400 scale-110" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <GameButton
            onClick={handleStart}
            disabled={name.trim().length < 2}
            size="lg"
            className="w-full"
          >
            🚀 Entra in Talentopia
          </GameButton>
        </div>
      </div>
    </div>
  );
}
