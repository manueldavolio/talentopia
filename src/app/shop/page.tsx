"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShopPage } from "@/components/shop/ShopPage";
import { usePlayer } from "@/context/PlayerContext";

export default function ShopRoutePage() {
  const { player, loading } = usePlayer();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !player) router.replace("/login");
  }, [loading, player, router]);

  if (loading || !player) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse">Caricamento negozio...</p>
      </div>
    );
  }

  return <ShopPage />;
}
