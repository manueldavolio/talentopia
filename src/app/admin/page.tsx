"use client";

import { useCallback, useEffect, useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { CATEGORIES } from "@/data/categories";
import type { CategorySlug, Difficulty, Question } from "@/types";

const ADMIN_KEY = "quiz-arena-admin-secret";

function adminHeaders(secret: string): HeadersInit {
  return { "Content-Type": "application/json", "x-admin-secret": secret };
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [stored, setStored] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<CategorySlug>("matematica");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [csvText, setCsvText] = useState("");
  const [xmlText, setXmlText] = useState("");
  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A" as Question["correctOption"],
    explanation: "",
    difficulty: "media" as Difficulty,
    topic: "generale",
  });

  useEffect(() => {
    const s = sessionStorage.getItem(ADMIN_KEY) || "";
    setStored(s);
    setSecret(s);
  }, []);

  const refreshCounts = useCallback(async (sec: string) => {
    const res = await fetch("/api/admin/questions", {
      headers: { "x-admin-secret": sec },
    });
    if (res.ok) {
      const data = await res.json();
      setCounts(data.counts);
    }
  }, []);

  const loadQuestions = useCallback(
    async (sec: string, slug: CategorySlug) => {
      const res = await fetch(
        `/api/admin/questions?category=${slug}&page=1&limit=30`,
        { headers: { "x-admin-secret": sec } }
      );
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setTotal(data.total);
      }
    },
    []
  );

  useEffect(() => {
    if (!stored) return;
    refreshCounts(stored);
    loadQuestions(stored, category);
  }, [stored, category, refreshCounts, loadQuestions]);

  const login = () => {
    sessionStorage.setItem(ADMIN_KEY, secret);
    setStored(secret);
    refreshCounts(secret);
  };

  const generate = async (count: number) => {
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: adminHeaders(stored),
      body: JSON.stringify({ action: "generate", categorySlug: category, count }),
    });
    const data = await res.json();
    setMessage(
      res.ok
        ? `Generate ${data.generated} domande. Totale: ${data.total}`
        : data.error
    );
    refreshCounts(stored);
    loadQuestions(stored, category);
  };

  const addQuestion = async () => {
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: adminHeaders(stored),
      body: JSON.stringify({ action: "add", categorySlug: category, ...form }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Aggiunta. Totale: ${data.total}` : data.error);
    loadQuestions(stored, category);
    refreshCounts(stored);
  };

  const importCsv = async () => {
    const lines = csvText.trim().split("\n").filter(Boolean);
    const rows = lines.map((line) => line.split(";").map((c) => c.trim()));
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: adminHeaders(stored),
      body: JSON.stringify({
        action: "import_csv",
        categorySlug: category,
        rows,
      }),
    });
    const data = await res.json();
    setMessage(
      res.ok ? `Importate ${data.imported}. Totale: ${data.total}` : data.error
    );
    refreshCounts(stored);
    loadQuestions(stored, category);
  };

  const importXml = async () => {
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: adminHeaders(stored),
      body: JSON.stringify({
        action: "import_xml",
        categorySlug: "patente",
        xml: xmlText,
      }),
    });
    const data = await res.json();
    setMessage(
      res.ok ? `Importate ${data.imported} da XML. Totale: ${data.total}` : data.error
    );
    refreshCounts(stored);
    loadQuestions(stored, "patente");
  };

  const deleteQuestion = async (id: string) => {
    const res = await fetch(
      `/api/admin/questions?category=${category}&id=${id}`,
      { method: "DELETE", headers: { "x-admin-secret": stored } }
    );
    if (res.ok) {
      setMessage("Domanda eliminata");
      loadQuestions(stored, category);
      refreshCounts(stored);
    }
  };

  if (!stored) {
    return (
      <div className="max-w-md mx-auto space-y-4 py-12">
        <h1 className="text-3xl font-black">Admin Talentopia</h1>
        <p className="text-white/70 text-sm">
          Inserisci la chiave admin (variabile ADMIN_SECRET, default dev).
        </p>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full rounded-xl bg-white/10 px-4 py-3 border border-white/20"
          placeholder="Chiave admin"
        />
        <GameButton onClick={login} size="lg">
          Accedi
        </GameButton>
      </div>
    );
  }

  const grandTotal = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-black">Pannello Admin</h1>
        <GameButton href="/" variant="secondary">
          Home
        </GameButton>
      </div>

      {message && (
        <p className="rounded-xl bg-green-500/20 border border-green-400/50 px-4 py-2 text-sm">
          {message}
        </p>
      )}

      <section className="rounded-2xl bg-white/10 p-6 border border-white/20">
        <h2 className="text-xl font-black mb-4">Domande per materia</h2>
        <p className="text-sm text-white/70 mb-4">
          Totale banca: <strong>{grandTotal}</strong> domande
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.slug}
              className="rounded-xl bg-black/30 px-4 py-3 flex justify-between"
            >
              <span>
                {c.icon} {c.name}
              </span>
              <span className="font-bold text-yellow-300">
                {counts[c.slug] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white/10 p-6 border border-white/20 space-y-4">
        <h2 className="text-xl font-black">Gestione categoria</h2>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategorySlug)}
          className="rounded-xl bg-white/10 px-4 py-2 border border-white/20"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          <GameButton onClick={() => generate(100)}>+100</GameButton>
          <GameButton onClick={() => generate(500)}>+500</GameButton>
          <GameButton onClick={() => generate(1000)}>+1000</GameButton>
        </div>
        <p className="text-sm text-white/60">
          Mostrate {questions.length} di {total} domande in banca
        </p>
      </section>

      <section className="rounded-2xl bg-white/10 p-6 border border-white/20 space-y-3">
        <h2 className="text-xl font-black">Aggiungi domanda</h2>
        <textarea
          placeholder="Domanda"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="w-full rounded-xl bg-white/10 px-4 py-2 border border-white/20 min-h-[60px]"
        />
        {(["optionA", "optionB", "optionC", "optionD"] as const).map((k, i) => (
          <input
            key={k}
            placeholder={`Opzione ${String.fromCharCode(65 + i)}`}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="w-full rounded-xl bg-white/10 px-4 py-2 border border-white/20"
          />
        ))}
        <div className="flex flex-wrap gap-2">
          <select
            value={form.correctOption}
            onChange={(e) =>
              setForm({
                ...form,
                correctOption: e.target.value as Question["correctOption"],
              })
            }
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            {["A", "B", "C", "D"].map((l) => (
              <option key={l} value={l}>
                Corretta: {l}
              </option>
            ))}
          </select>
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({ ...form, difficulty: e.target.value as Difficulty })
            }
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            <option value="facile">Facile</option>
            <option value="media">Media</option>
            <option value="difficile">Difficile</option>
          </select>
          <input
            placeholder="Topic"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            className="rounded-xl bg-white/10 px-4 py-2 border border-white/20"
          />
        </div>
        <GameButton onClick={addQuestion}>Salva domanda</GameButton>
      </section>

      <section className="rounded-2xl bg-white/10 p-6 border border-white/20 space-y-3">
        <h2 className="text-xl font-black">Import CSV</h2>
        <p className="text-xs text-white/60">
          Separatore ; — colonne base: domanda;A;B;C;D;corretta;spiegazione;difficoltà;topic
          {category === "patente" && (
            <> · patente esteso: ;subject;esempio_reale;curiosità;trucco</>
          )}
        </p>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full rounded-xl bg-white/10 px-4 py-2 border border-white/20 min-h-[120px] font-mono text-sm"
          placeholder="Quanto fa 2+2?;3;4;5;6;B;..."
        />
        <GameButton onClick={importCsv}>Importa CSV</GameButton>
      </section>

      {category === "patente" && (
        <section className="rounded-2xl bg-orange-500/10 p-6 border border-orange-400/30 space-y-3">
          <h2 className="text-xl font-black">Import XML ministeriale (Patente)</h2>
          <p className="text-xs text-white/60">
            Struttura predisposta per banca domande ufficiale. Template in{" "}
            <code className="text-orange-200">data/patente-import-template.xml</code>
          </p>
          <textarea
            value={xmlText}
            onChange={(e) => setXmlText(e.target.value)}
            className="w-full rounded-xl bg-white/10 px-4 py-2 border border-white/20 min-h-[160px] font-mono text-xs"
            placeholder="&lt;bancaPatente&gt;..."
          />
          <GameButton onClick={importXml}>Importa XML</GameButton>
        </section>
      )}

      <section className="rounded-2xl bg-white/10 p-6 border border-white/20">
        <h2 className="text-xl font-black mb-4">Ultime domande</h2>
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {questions.map((q) => (
            <li
              key={q.id}
              className="rounded-xl bg-black/30 p-4 text-sm flex justify-between gap-4"
            >
              <div>
                <p className="font-bold line-clamp-2">{q.question}</p>
                <p className="text-white/50 mt-1">
                  {q.topic} · {q.difficulty}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteQuestion(q.id)}
                className="text-red-400 font-bold shrink-0"
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
