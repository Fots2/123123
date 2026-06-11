import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Heart,
  MessageCircleHeart,
  PartyPopper,
  Sparkles,
  UtensilsCrossed,
  ClipboardCopy,
  Music2,
} from "lucide-react";

const foodOptions = [
  { label: "Суши", emoji: "🍣" },
  { label: "Пицца", emoji: "🍕" },
  { label: "Паста", emoji: "🍝" },
  { label: "Бургер", emoji: "🍔" },
  { label: "Сладенькое", emoji: "🍰" },
  { label: "Салат", emoji: "🥗" },
];

const STORAGE_KEY = "date_invite_pastel_draft_v4";

export default function App() {
  const [stage, setStage] = useState("intro");
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [selectedFood, setSelectedFood] = useState("Суши");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState(
    "Хочу провести с тобой очень тёплый и красивый вечер ❤️"
  );
  const [copied, setCopied] = useState(false);
  const [savedResult, setSavedResult] = useState("");
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.selectedFood) setSelectedFood(saved.selectedFood);
        if (saved.date) setDate(saved.date);
        if (saved.time) setTime(saved.time);
        if (saved.message) setMessage(saved.message);
        if (saved.resultSaved) setResultSaved(true);
        if (saved.savedResult) setSavedResult(saved.savedResult);
      }
    } catch {
      // ignore read errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selectedFood, date, time, message, resultSaved, savedResult })
      );
    } catch {
      // ignore write errors
    }
  }, [selectedFood, date, time, message, resultSaved, savedResult]);

  const prettyDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const inviteText = useMemo(() => {
    return [
      `🍽 Еда: ${selectedFood}`,
      `📅 Дата: ${prettyDate}`,
      `⏰ Время: ${time || "—"}`,
      `💃 в конце свидания обязательно танцуем`,
      "",
      
    ].join("\n");
  }, [selectedFood, prettyDate, time, message]);

  const savedSummary = useMemo(() => {
    return [selectedFood, prettyDate, time || "—"].join(" • ");
  }, [selectedFood, prettyDate, time]);

  const saveResult = async () => {
    setResultSaved(true);
    setSavedResult(savedSummary);
    try {
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const moveNoButton = () => {
    const maxX = 260;
    const maxY = 180;
    setNoPos({
      x: (Math.random() * maxX * 2) - maxX,
      y: (Math.random() * maxY * 2) - maxY,
    });
    setNoScale(0.96 + Math.random() * 0.16);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-violet-100 text-rose-900">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300"
            initial={{ y: 0, x: 0, opacity: 0.2 }}
            animate={{
              y: [0, -24, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.2, 0.55, 0.2],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
            style={{ left: `${(i * 8) % 100}%`, top: `${(i * 11) % 100}%` }}
          >
            <Heart size={18 + (i % 3) * 5} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -28, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
            >
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-600">
                <MessageCircleHeart size={30} />
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700">
                <Sparkles size={16} />
                приглашение для моей рыбки
              </div>

              <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-rose-700">
                Ты делаешь обычные дни светлее, и мне очень хочется позвать тебя на уютный вечер.
              </p>

              <button
                onClick={() => setStage("question")}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
              >
                Открыть приглашение
                <Heart size={16} fill="currentColor" />
              </button>
            </motion.section>
          )}

          {stage === "question" && (
            <motion.section
              key="question"
              initial={{ opacity: 0, y: 26, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 0.96, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="mx-auto w-full max-w-7xl rounded-[2.75rem] border border-white/70 bg-white/75 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <div className="mx-auto flex min-h-[78vh] w-full max-w-5xl flex-col justify-center space-y-8 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pink-100 shadow-inner">
                  <Heart size={34} className="text-pink-600" fill="currentColor" />
                </div>

                <div>
                  <h2 className="text-4xl font-semibold text-rose-800 sm:text-5xl">
                    Как насчёт провести один красивый вечер вместе? 🌹
                  </h2>
                </div>

                <div className="relative mx-auto flex min-h-[48vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-rose-50 via-pink-50 to-violet-100 p-8 shadow-inner sm:p-10">
                  <div className="absolute left-1/2 top-8 -translate-x-1/2 text-sm font-medium text-rose-500">
                    Выбери ответ
                  </div>

                  <button
                    onClick={() => setStage("details")}
                    className="absolute left-[34%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 px-12 py-6 text-2xl font-semibold text-white shadow-xl transition-transform hover:scale-105 active:scale-95 sm:px-14 sm:py-7"
                  >
                    Да
                  </button>

                  <motion.button
                    type="button"
                    onMouseEnter={moveNoButton}
                    onMouseMove={moveNoButton}
                    onClick={moveNoButton}
                    animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="absolute left-[66%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-200 bg-white px-12 py-6 text-2xl font-semibold text-rose-500 shadow-md sm:px-14 sm:py-7"
                    style={{ willChange: "transform" }}
                  >
                    Нет
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

          {stage === "details" && (
            <motion.section
              key="details"
              initial={{ opacity: 0, y: 24, scale: 0.985, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, scale: 0.97, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="w-full rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-lg sm:p-8">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700">
                    <Sparkles size={16} />
                    Соберём наше идеальное свидание ✨
                  </div>

                  <p className="mt-4 max-w-xl text-base leading-7 text-rose-600 sm:text-lg">
                    Выбери то, что тебе хочется.
                  </p>

                  <div className="mt-8 grid gap-6">
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">
                        <UtensilsCrossed size={16} />
                        Еда
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {foodOptions.map((food) => {
                          const active = selectedFood === food.label;
                          return (
                            <button
                              key={food.label}
                              onClick={() => setSelectedFood(food.label)}
                              className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                                active
                                  ? "border-rose-300 bg-rose-100 shadow-md"
                                  : "border-white/80 bg-white/90 hover:border-rose-200"
                              }`}
                            >
                              <div className="text-2xl">{food.emoji}</div>
                              <div className="mt-2 text-sm font-medium text-rose-800">
                                {food.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700">
                          <CalendarDays size={16} />
                          Дата
                        </div>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-transparent text-base text-rose-800 outline-none"
                        />
                      </label>

                      <label className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700">
                          <Clock3 size={16} />
                          Время
                        </div>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-transparent text-base text-rose-800 outline-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/80 bg-gradient-to-br from-rose-100 via-pink-100 to-violet-100 p-6 shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
                    <Heart size={16} fill="currentColor" />
                    красивая карточка
                  </div>

                  <div className="rounded-[1.75rem] bg-white/80 p-6 shadow-inner">
                    <h3 className="text-2xl font-semibold text-rose-800">Приглашение на свидание</h3>
                    <p className="mt-2 text-sm leading-6 text-rose-600">
                      Всё самое нежное уже собрано в одну карточку.
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-rose-800">
                      <div className="rounded-2xl bg-rose-50 p-4">
                        <div className="text-rose-600">Еда</div>
                        <div className="mt-1 text-lg font-medium">{selectedFood}</div>
                      </div>

                      <div className="rounded-2xl bg-rose-50 p-4">
                        <div className="text-rose-600">Дата и время</div>
                        <div className="mt-1 text-lg font-medium">
                          {prettyDate} {time ? `• ${time}` : ""}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-rose-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-rose-600">
                          <Music2 size={16} />
                          
                        </div>
                        <motion.div
                          animate={{ rotate: [0, -4, 0, 4, 0], y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="font-medium text-rose-800"
                        >
                          В конце свидания обязательно танцуем 💃🕺
                        </motion.div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSavedResult(savedSummary);
                        setResultSaved(true);
                        setStage("done");
                      }}
                      className="mt-6 w-full rounded-2xl bg-rose-500 px-5 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                    >
                      Жду этот вечер ✨
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {stage === "done" && (
            <motion.section
              key="done"
              initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="mx-auto w-full max-w-3xl rounded-[2.5rem] border border-white/70 bg-gradient-to-br from-rose-100 via-pink-100 to-violet-100 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
            >
              <motion.div
                animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-white/85 text-rose-600 shadow-lg"
              >
                <Heart size={34} fill="currentColor" />
              </motion.div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
                <PartyPopper size={16} />
                ну вот и всё
              </div>

              <h2 className="mt-5 text-4xl font-semibold text-rose-800">
                Это будет прекрасный вечер ❤️
              </h2>

              <motion.div
                animate={{ rotate: [0, -6, 0, 6, 0], y: [0, -4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-rose-600 shadow-md"
              >
                <Music2 size={16} />
                И да — танец в конце свидания обязателен 💃🕺
              </motion.div>

              <div className="mt-8 rounded-2xl bg-white/75 p-4 text-sm text-rose-600 shadow-sm">
                {resultSaved
                  ? "Ответ сохранён. Можешь скопировать текст приглашения и написать мне ❤️."
                  : "Нажми подтвердить, чтобы сохранить ответ."}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={saveResult}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-600 shadow-lg transition hover:scale-[1.02]"
                >
                  <ClipboardCopy size={16} />
                  {copied ? "Скопировано" : "Скопировать текст"}
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-rose-400">
                <Heart size={18} fill="currentColor" />
                <Heart size={18} fill="currentColor" />
                <Heart size={18} fill="currentColor" />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}