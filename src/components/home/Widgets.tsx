import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Panel from "./Panel";
import { useHomeTheme } from "../../theme/HomeThemeContext";
import { latestPosts } from "../../lib/blog";
import { homeButtons } from "../../data/resources";
import { games } from "../../data/games";
import { movies, series } from "../../data/movies";
import { useAnimanga, type Animanga } from "../../lib/api";
import { dateKey } from "../../lib/dates";

// ---------- welcome ----------

export function Welcome() {
  return (
    <div className="bg-(--home-primary)/90 p-1 px-2 overflow-hidden">
      <h1 className="text-(--home-text-highlight) text-center font-times italic">BEM-VINDO! ようこそ！ WELCOME!</h1>
      <hr className="text-(--home-accent-text)/50 border-dotted my-1" />
      <div className="space-y-2 *:text-(--home-text) *:leading-tight *:text-[13px]">
        <p>Oi! você encontrou meu site, que bom te ver por aqui! aqui você vai encontrar informações sobre mim, meus hobbies, projetos e mais.</p>
        <p>meus hobbies incluem não sair do quarto, programar, jogar video game, assistir anime, ler mangá e ouvir música.</p>
        <p>
          a ideia desse site é ser algo mais pessoal, obviamente, então já que reflete meus interesses, pode ter algum conteúdo{" "}
          <span className="text-(--home-accent-text)">NSFW</span> por aqui. se você não curte isso, sinta-se à vontade pra sair.
        </p>
      </div>
    </div>
  );
}

// ---------- latest blog posts ----------

export function LatestPosts() {
  const slots = Array.from({ length: 3 }, (_, i) => latestPosts[i] ?? null);
  return (
    <div className="bg-(--home-primary)/90 flex flex-col">
      <div className="h-full flex flex-col gap-1 text-[12px]">
        {slots.map((post, i) => {
          const caption = (
            <div className="w-full bg-(--home-primary-dark) border-t border-(--home-accent) text-(--home-text) px-1 flex justify-between font-pixel text-[8px]">
              <span className={post ? undefined : "opacity-0"}>{post?.title ?? "placeholder"}</span>
              <span className={post ? undefined : "opacity-0"}>{post?.date ?? "00/00/0000"}</span>
            </div>
          );
          const cls = "flex-1 flex items-end bg-cover bg-center border border-(--home-accent) hover:brightness-75 relative";
          return post ? (
            <Link key={post.slug} to={`/blog/${post.slug}`} className={cls} style={post.banner ? { backgroundImage: `url(${post.banner})` } : undefined}>
              {caption}
            </Link>
          ) : (
            <div key={`placeholder-${i}`} className={cls}>
              {caption}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- cat album ----------

const CAT_PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => `/assets/home/cat/photo-0${n}.webp`);
const MEOWS = [1, 2, 3, 4].map((n) => `/assets/home/cat/meow-${n}.mp3`);

export function CatAlbum() {
  const [photo, setPhoto] = useState(() => Math.floor(Math.random() * CAT_PHOTOS.length));
  const [meow, setMeow] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhoto((p) => (p + 1) % CAT_PHOTOS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const playMeow = useCallback(() => {
    new Audio(MEOWS[meow]).play();
    setMeow((m) => (m + 1) % MEOWS.length);
  }, [meow]);

  return (
    <Panel title="My cat's album" className="flex flex-col relative group">
      <img
        src="/assets/home/cat/head.webp"
        onClick={playMeow}
        className="hoverable size-16 absolute -right-4 -top-3 hover:scale-110 active:scale-105 z-15 transition-transform duration-100"
      />
      <div className="flex-1 overflow-hidden">
        <img src={CAT_PHOTOS[photo]} className="h-full w-full object-cover" />
      </div>
    </Panel>
  );
}

// ---------- goals ----------

const GOALS = [
  { text: "Apresentar artigo", done: true },
  { text: "Terminar faculdade", done: false },
  { text: "Construir um projeto web legal", done: true },
  { text: "Zerar pelo menos 30 jogos", done: true },
  { text: "Procrastinar menos", done: false },
  { text: "Comer mais saudavel", done: false },
  { text: "Conseguir um emprego", done: true },
];
const doneCount = GOALS.filter((g) => g.done).length;

export function Goals() {
  const { theme } = useHomeTheme();
  return (
    <Panel
      title="2026 Goals"
      titleVariant="striped"
      titleAside={
        <span className="text-[10px] text-(--home-accent-text) font-[Noto_Sans]">
          {doneCount}/{GOALS.length}
        </span>
      }
      className="flex flex-col overflow-hidden"
    >
      <div className="flex-1 flex flex-col bg-(--home-primary-dark)/50 relative overflow-hidden group">
        <div className="absolute -right-27 -bottom-115 z-20 opacity-25">
          {theme.images.decGoalsHover && (
            <img
              src={theme.images.decGoalsHover}
              alt=""
              className="left-0 top-0 w-120 z-10 h-full object-contain pointer-events-none select-none absolute hidden group-hover:block"
            />
          )}
          <img src={theme.images.decGoals} alt="" className="left-0 top-0 w-120 h-full object-contain pointer-events-none select-none" />
        </div>
        <ul className="flex-1 flex flex-col px-1.5 py-1 gap-0.5">
          {GOALS.map((g, i) => (
            <li key={i} className={`flex items-center gap-1.5 text-[11px] py-0.5 font-[Noto_Sans] ${g.done ? "text-(--home-goal-done)/70" : "text-(--home-text)"}`}>
              <span
                className={`w-3 h-3 shrink-0 border flex items-center justify-center text-[8px] ${
                  g.done ? "border-(--home-goal-done)/50 text-(--home-goal-done)" : "border-(--home-accent)/30"
                }`}
              >
                {g.done && "X"}
              </span>
              <span className={g.done ? "line-through text-[8px] font-pixel" : "text-[8px] font-pixel"}>{g.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

// ---------- medialog recents ----------

const RECENTS_LIMIT = 12;

type Recent = { kind: string; type: string; name: string; cover: string; date: string };

function buildRecents(animanga: Animanga[]): Recent[] {
  return [
    ...games.filter((g) => !!g.finished).map((g) => ({ kind: "game", type: "games", name: g.name, cover: g.cover, date: g.finished! })),
    ...animanga.filter((a) => !!a.date).map((a) => ({ kind: "animanga", type: a.type.toLowerCase(), name: a.name, cover: a.img, date: a.date! })),
    ...movies.filter((m) => !!m.date).map((m) => ({ kind: "movie", type: "movies", name: m.name, cover: m.img, date: m.date! })),
    ...series.filter((s) => !!s.date).map((s) => ({ kind: "series", type: "series", name: s.name, cover: s.img, date: s.date! })),
  ]
    .sort((a, b) => dateKey(b.date) - dateKey(a.date))
    .slice(0, RECENTS_LIMIT);
}

export function MedialogRecents() {
  const { data, loading } = useAnimanga();
  const recents = useMemo(() => buildRecents(data), [data]);
  const cells = Array.from({ length: 6 }, (_, i) => ({ key: i, item: loading ? null : (recents[i] ?? null) }));

  return (
    <div className="flex flex-col min-w-0 overflow-hidden">
      <h1 className="border border-(--home-accent) mb-0.5 bg-(--home-primary-dark) text-(--home-text) px-1.5 shrink-0 text-[8px] font-pixel">Medialog Recents</h1>
      <Link to="/medialog" className="grid grid-cols-3 auto-rows-fr gap-1 flex-1 min-h-0 overflow-hidden select-none">
        {cells.map(({ key, item }) =>
          item ? (
            <div key={key} className="relative overflow-hidden border border-(--home-accent) bg-(--home-primary-dark)/50 group/cover">
              <img
                src={item.cover}
                alt={item.name}
                className="absolute inset-0 w-full h-full"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
              <div className="absolute inset-0 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-150">
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-0.5">
                  <p className="text-[8px] font-pixel text-white truncate leading-tight">{item.name}</p>
                </div>
              </div>
            </div>
          ) : (
            <div key={key} className="border border-(--home-accent)/40 bg-(--home-accent)/10" />
          ),
        )}
      </Link>
    </div>
  );
}

// ---------- 88x31 buttons ----------

export function ButtonWidget() {
  return (
    <Panel
      title={
        <>
          Button <span className="opacity-30">88x31</span>
        </>
      }
      className="flex flex-col overflow-hidden min-w-0"
    >
      <div className="flex-1 min-h-0 bg-(--home-primary-dark)/50 px-1.5 py-2">
        <div className="flex h-full min-h-0 flex-col items-center justify-center gap-2 text-center">
          <div className="flex w-[88px] flex-col gap-1">
            {homeButtons.map((b) => (
              <a key={b.filename} href={b.src} download={b.filename} className="block h-[31px] w-[88px] overflow-hidden transition hover:brightness-50">
                <img src={b.src} alt="YourName 88x31 button" width={88} height={31} className="block h-full w-full" />
              </a>
            ))}
          </div>
          <div className="space-y-0.5 text-[11px] leading-tight text-(--home-text)">
            <p>click the button to download</p>
            <p>feel free to add it!</p>
            <p>if you do, please lmk :)</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
