import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import "./not-found.css";

// A tiny visual-novel style 404: click to advance the dialogue.

const BASE = "/assets/not-found/";
const BACKGROUND = "background.webp";
const MUSIC = "music.mp3";
const S = {
  normal: "sprites/meiya-normal.webp",
  hehe: "sprites/meiya-hehe.webp",
  angry: "sprites/meiya-angry.webp",
  angry2: "sprites/meiya-angry-2.webp",
  shy: "sprites/meiya-shy.webp",
  shy2: "sprites/meiya-shy-2.webp",
};

const MEIYA = " 【 Meyia 】";
const YOU = " 【 You 】";
const MEIYA_COLOR = "#b9d3eb";
const YOU_COLOR = "#ffd966";

type Line = { name: string; text: string; color: string; sprite?: string; face?: string; choices?: { text: string; to: string }[] };

const script: Line[] = [
  { name: MEIYA, text: "Who are you?", color: MEIYA_COLOR, sprite: S.angry },
  { name: MEIYA, text: "And what are you doing in Takeru's room?", color: MEIYA_COLOR, sprite: S.angry2 },
  { name: MEIYA, text: "Are you one of those stalkers everyone keeps talking about?", color: MEIYA_COLOR, sprite: S.angry2 },
  { name: MEIYA, text: "I didn't think I'd have to use my Mugen Kidou this soon.", color: MEIYA_COLOR, sprite: S.angry },
  { name: YOU, text: "C-C-CALM DOWN! I'M NOT A STALKER!", color: YOU_COLOR, sprite: S.angry },
  { name: YOU, text: "I was just walking around and ended up coming in here by accident, I swear!", color: YOU_COLOR, sprite: S.angry2 },
  { name: MEIYA, text: "Ahh, I see...", color: MEIYA_COLOR, sprite: S.shy },
  { name: MEIYA, text: "So, you're one of those otaku everyone keeps talking about, right?", color: MEIYA_COLOR, sprite: S.normal },
  { name: YOU, text: "What?", color: YOU_COLOR, sprite: S.normal },
  { name: YOU, text: "Yeah... maybe I am.", color: YOU_COLOR, sprite: S.normal },
  { name: YOU, text: "BUT WHAT DOES THAT HAVE TO DO WITH ANYTHING?", color: YOU_COLOR, sprite: S.shy },
  { name: MEIYA, text: "Well, forgive my manners.", color: MEIYA_COLOR, sprite: S.shy2 },
  { name: YOU, text: "O-okay... no problem.", color: YOU_COLOR, sprite: S.normal },
  { name: YOU, text: "Anyway, I think I should get going.", color: YOU_COLOR, sprite: S.normal },
  { name: MEIYA, text: "Ah, of course... you should come back someday.", color: MEIYA_COLOR, sprite: S.normal },
  { name: MEIYA, text: "Takeru would love to meet you.", color: MEIYA_COLOR, sprite: S.normal },
  { name: MEIYA, text: "You could even play Valgern-On with him.", color: MEIYA_COLOR, sprite: S.normal },
  { name: MEIYA, text: "But I highly doubt you'd win.", color: MEIYA_COLOR, sprite: S.hehe },
  { name: YOU, text: "Maybe someday!", color: YOU_COLOR, sprite: S.normal, choices: [{ text: "Leave...", to: "/" }] },
];

const textboxStyle: CSSProperties = {
  backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0) 100%)",
  backgroundPosition: "center, bottom left",
  backgroundRepeat: "no-repeat, no-repeat",
  backgroundSize: "cover, contain",
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState("");
  const [showCaret, setShowCaret] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const typer = useRef<number | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const musicStarted = useRef(false);
  const line = script[index];
  const isLast = index === script.length - 1;

  // Typewriter effect.
  useEffect(() => {
    setShown("");
    setShowCaret(false);
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      setShown(line.text.slice(0, n));
      if (n >= line.text.length) {
        window.clearInterval(id);
        typer.current = null;
        if (!isLast) setShowCaret(true);
      }
    }, 30);
    typer.current = id;
    return () => window.clearInterval(id);
  }, [index, line.text, isLast]);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    el.currentTime = 0;
    return () => {
      el.pause();
      el.currentTime = 0;
    };
  }, []);

  const startMusic = () => {
    if (musicStarted.current) return;
    const el = audio.current;
    if (!el) return;
    musicStarted.current = true;
    el.play().catch(() => {
      musicStarted.current = false;
    });
  };

  const advance = () => {
    startMusic();
    if (typer.current !== null) {
      // Skip typing.
      window.clearInterval(typer.current);
      typer.current = null;
      setShown(line.text);
      if (!isLast) setShowCaret(true);
      return;
    }
    if (isLast) {
      if (line.choices) setShowChoices(true);
      return;
    }
    setShowCaret(false);
    setIndex((i) => i + 1);
  };

  return (
    <div
      className="relative flex w-full touch-manipulation justify-center overflow-hidden bg-black bg-cover bg-center bg-no-repeat font-[Montserrat,sans-serif]"
      onClick={advance}
      style={{ backgroundImage: `url(${BASE}${BACKGROUND})`, height: "100dvh", minHeight: "100vh" }}
    >
      <audio ref={audio} src={`${BASE}${MUSIC}`} preload="auto" />

      <div className="flex justify-center items-center">
        {line.sprite && (
          <img
            draggable={false}
            src={`${BASE}${line.sprite}`}
            alt=""
            className="absolute bottom-[-54dvh] h-[clamp(46rem,145dvh,125rem)] w-auto max-w-none -translate-x-1/2 object-contain object-bottom select-none sm:bottom-[-62dvh] sm:h-[clamp(56rem,162dvh,125rem)] md:bottom-[-85dvh] left-[25%] md:left-[40%] md:h-[min(125rem,185dvh)]"
          />
        )}
      </div>

      <div className={`fixed inset-0 z-10000 items-center justify-center bg-black/50 ${showChoices ? "flex" : "hidden"}`} onClick={(e) => e.stopPropagation()}>
        <ul className="list-none p-0">
          {line.choices?.map((c) => (
            <li key={c.text} className="text-center text-[clamp(1.25rem,6dvw,2rem)] [text-shadow:2px_2px_black]">
              <a
                href={c.to}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(c.to);
                }}
                className="inline-block w-[min(80vw,52.5rem)] border-2 border-x-0 border-solid border-white bg-white/26 p-[clamp(0.75rem,3dvw,1.25rem)] text-[clamp(1.25rem,6dvw,2rem)] text-white no-underline hover:bg-[#3c0b76]/26"
              >
                {c.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="absolute bottom-0 z-999 h-[clamp(13rem,32dvh,20rem)] w-full select-none bg-cover text-[clamp(1rem,4.4dvw,2.8rem)] leading-tight **:m-0 md:text-[clamp(1.6rem,4dvh,2.8rem)]"
        style={{ aspectRatio: "6 / 1", ...textboxStyle }}
      >
        {line.face && (
          <div className="fixed bottom-0 left-0 z-1 w-[23%] -translate-x-10 object-contain drop-shadow-[0px_0px_5px_grey]">
            <img draggable={false} src={`${BASE}${line.face}`} alt="" className="block h-auto w-full" />
          </div>
        )}
        <div className="w-full px-[clamp(1rem,4dvw,2rem)] py-[clamp(0.875rem,2.6dvh,1.5rem)] font-bold font-[ms_gothic,sans-serif] text-white [text-shadow:2px_2px_black] md:float-right md:w-[87%] md:p-[2vh]">
          <h3 className="mb-[clamp(0.5rem,1.8dvh,1.875rem)] text-[0.9em] leading-none [text-shadow:2px_2px_black] md:-mt-5" style={{ color: line.color }}>
            {line.name}
          </h3>
          <p className="max-w-[34em] leading-snug" style={{ color: line.color }}>
            {shown}
          </p>
          <div
            className={`absolute right-[2vh] bottom-[1.25vh] h-auto w-[5vh] fill-white text-white [transition:opacity_500ms_ease] animate-notfound-caret ${
              showCaret ? "opacity-100" : "opacity-0"
            }`}
          >
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}
