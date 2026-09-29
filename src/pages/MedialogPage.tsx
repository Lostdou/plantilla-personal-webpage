import { useMemo, useState, type ReactNode, type MouseEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Clock, Trophy } from "lucide-react";
import PlatformBadge, { formatProgress } from "../components/medialog/PlatformBadge";
import { games, type Game } from "../data/games";
import { movies, series, type WatchItem } from "../data/movies";
import { useAnimanga, type Animanga } from "../lib/api";
import { dateKey } from "../lib/dates";

// ---------- config ----------

const TABS = ["games", "anime", "manga", "movies", "series"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = { games: "Jogos", anime: "Anime", manga: "Manga", movies: "Filmes", series: "Series" };

type AlphaTheme = { headerBg: string; headerText: string; linkText: string; hoverBg: string; hoverText: string; titleText: string };
type TabAssets = { wallpaper: string; banner: string; gradient: string; fallback: string; alphaList: AlphaTheme };

const TAB_ASSETS: Record<Tab, TabAssets> = {
  games: {
    wallpaper: "/assets/medialog/games-wallpaper.webp",
    banner: "/assets/medialog/games-banner.webp",
    gradient: "linear-gradient(to bottom, #7b72a8, #7b72a8, #494578)",
    fallback: "#7b72a8",
    alphaList: { headerBg: "#b6aedc", headerText: "#353067", linkText: "#443e87", hoverBg: "#6b63a4", hoverText: "#ffffff", titleText: "#443e87" },
  },
  anime: {
    wallpaper: "/assets/medialog/anime-wallpaper.webp",
    banner: "/assets/medialog/anime-banner.webp",
    gradient: "linear-gradient(to bottom, #f08ab3, #d84f8a, #a82f68)",
    fallback: "#d84f8a",
    alphaList: { headerBg: "#f7b6cf", headerText: "#8f285e", linkText: "#b42f72", hoverBg: "#d84f8a", hoverText: "#ffffff", titleText: "#a82f68" },
  },
  manga: {
    wallpaper: "/assets/medialog/manga-wallpaper.webp",
    banner: "/assets/medialog/manga-banner.webp",
    gradient: "linear-gradient(to bottom, #9ca3af, #5f6673, #303744)",
    fallback: "#3f4652",
    alphaList: { headerBg: "#cfd4dc", headerText: "#303744", linkText: "#3f4652", hoverBg: "#5f6673", hoverText: "#ffffff", titleText: "#303744" },
  },
  movies: {
    wallpaper: "/assets/medialog/movies-wallpaper.webp",
    banner: "/assets/medialog/movies-banner.webp",
    gradient: "linear-gradient(to bottom, #b45f5f, #8f3f3f, #5c2626)",
    fallback: "#8f3f3f",
    alphaList: { headerBg: "#d9a3a3", headerText: "#5c2626", linkText: "#8f3f3f", hoverBg: "#b45f5f", hoverText: "#ffffff", titleText: "#5c2626" },
  },
  series: {
    wallpaper: "/assets/medialog/series-wallpaper.webp",
    banner: "/assets/medialog/series-banner.webp",
    gradient: "linear-gradient(to bottom, #5f8fb4, #3f6b8f, #26445c)",
    fallback: "#3f6b8f",
    alphaList: { headerBg: "#a3c3d9", headerText: "#26445c", linkText: "#3f6b8f", hoverBg: "#5f8fb4", hoverText: "#ffffff", titleText: "#26445c" },
  },
};

type ViewMode = "alpha" | "grid";
const VIEW_MODES: { mode: ViewMode; label: string }[] = [
  { mode: "alpha", label: "A-Z" },
  { mode: "grid", label: "Grade" },
];

// ---------- layout ----------

function Footer({ gradient, itemCount }: { gradient: string; itemCount: number }) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-0.5 text-[8px] font-pixel text-white shrink-0" style={{ background: gradient }}>
      <span className="shrink-0">{itemCount} itens</span>
    </div>
  );
}

function Banner({ assets }: { assets: TabAssets }) {
  return (
    <div
      className="relative w-full h-40 md:h-75 bg-cover bg-center shrink-0 overflow-hidden"
      style={{ backgroundColor: assets.fallback, backgroundImage: `url(${assets.banner})` }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
        <h1 className="text-white text-[28px] md:text-[36px] font-bold tracking-wide m-0 leading-none">Medialog</h1>
        <p className="text-white/60 text-[12px] mt-1">games, anime, manga & mais</p>
      </div>
    </div>
  );
}

function TabBar({ gradient, selectedTab }: { gradient: string; selectedTab: Tab }) {
  return (
    <div
      className="flex flex-wrap items-center justify-center text-white text-[13px] sm:text-[15px] py-0.5 gap-1 sm:gap-0 shrink-0 tracking-normal"
      style={{ background: gradient }}
    >
      {TABS.map((tab, i) => (
        <span key={tab} className="contents">
          {i > 0 && <img src="/assets/medialog/separator.gif" className="mx-1 sm:mx-2 h-7 select-none opacity-70" />}
          <Link
            to={`/medialog/${tab}`}
            className={`font-bold uppercase transition-colors duration-150 ${selectedTab === tab ? "text-black/70" : "text-white hover:text-black/50"}`}
          >
            {TAB_LABELS[tab]}
          </Link>
        </span>
      ))}
    </div>
  );
}

function ViewModeDropdown({ viewMode, onChange }: { viewMode: ViewMode; onChange: (m: ViewMode) => void }) {
  const [open, setOpen] = useState(false);
  const label = VIEW_MODES.find((v) => v.mode === viewMode)?.label ?? VIEW_MODES[0].label;
  return (
    <div
      className="relative"
      onBlur={(e) => {
        const next = e.relatedTarget;
        if (!(next instanceof Node) || !e.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button onClick={() => setOpen((o) => !o)} className="text-[#ffef8a] hover:text-[#e6c449]">
        [ver: {label}]
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 min-w-18 border border-white/30 bg-black/70 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          {VIEW_MODES.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => {
                onChange(mode);
                setOpen(false);
              }}
              className={`block w-full px-2 py-1 text-left ${viewMode === mode ? "text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TopBar({ gradient, viewMode, onViewModeChange }: { gradient: string; viewMode: ViewMode; onViewModeChange: (m: ViewMode) => void }) {
  return (
    <div className="flex items-center justify-between px-1 py-0.5 text-[8px] font-pixel shrink-0" style={{ background: gradient }}>
      <Link to="/" className="text-white/90 no-underline hover:text-white/50">
        {"< inicio"}
      </Link>
      <div className="flex items-center gap-2">
        <ViewModeDropdown viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
}

function MedialogLayout(props: {
  assets: TabAssets;
  selectedTab: Tab;
  itemCount: number;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  children: ReactNode;
}) {
  const { assets } = props;
  return (
    <div
      className="flex min-h-screen justify-center bg-[#c6ccd6] bg-cover bg-fixed font-[Arial,Verdana,sans-serif]"
      style={{ backgroundImage: `url(${assets.wallpaper})` }}
    >
      <div className="relative w-full min-h-screen bg-white flex flex-col md:max-w-220 md:mx-auto md:shadow-[0_2px_20px_rgba(0,0,0,0.1)]">
        <TopBar gradient={assets.gradient} viewMode={props.viewMode} onViewModeChange={props.onViewModeChange} />
        <Banner assets={assets} />
        <TabBar gradient={assets.gradient} selectedTab={props.selectedTab} />
        <div className="flex-1 min-h-0 overflow-y-auto medialog-scroll">
          <div className="p-3 pb-2 text-black">{props.children}</div>
        </div>
        <Footer gradient={assets.gradient} itemCount={props.itemCount} />
      </div>
    </div>
  );
}

// ---------- views ----------

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function groupByLetter<T>(items: T[], getName: (i: T) => string) {
  const groups: Record<string, T[]> = {};
  const sorted = [...items].sort((a, b) => getName(a).localeCompare(getName(b)));
  for (const item of sorted) {
    const first = getName(item).charAt(0).toUpperCase();
    const key = /[A-Z]/.test(first) ? first : "#";
    (groups[key] ??= []).push(item);
  }
  return groups;
}

function AlphaList<T>({
  items,
  loading,
  getName,
  getImage,
  theme,
  renderInfo,
}: {
  items: T[];
  loading?: boolean;
  getName: (i: T) => string;
  getImage: (i: T) => string;
  theme: AlphaTheme;
  renderInfo: (i: T) => ReactNode;
}) {
  const groups = groupByLetter(items, getName);
  const [hovered, setHovered] = useState<T | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
  const keyOf = (i: T) => `${getName(i)}-${getImage(i)}`;

  const letters = groups["#"]?.length > 0 ? ["#", ...LETTERS] : LETTERS;
  const per = Math.ceil(letters.length / 3);
  const columns = [letters.slice(0, per), letters.slice(per, per * 2), letters.slice(per * 2)];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-0">
        {columns.map((col, ci) => (
          <div key={ci}>
            {col.map((letter) => (
              <div key={letter} className="mb-2">
                <h2
                  className="mb-1 py-0 text-center font-serif text-[12px] font-bold tracking-[2px]"
                  style={{ backgroundColor: theme.headerBg, color: theme.headerText }}
                >
                  {letter}
                </h2>
                <div className="flex flex-col">
                  {loading ? (
                    <div className="h-5 mx-1 my-0.5 bg-[#e5e7eb] animate-pulse rounded-sm" />
                  ) : (
                    (groups[letter] || []).map((item) => (
                      <span
                        key={keyOf(item)}
                        className="block text-[14px] py-1 px-1 truncate animate-[fadeIn_0.2s_ease-out]"
                        style={{ color: theme.linkText }}
                        onMouseEnter={(e) => {
                          setHovered(item);
                          e.currentTarget.style.backgroundColor = theme.hoverBg;
                          e.currentTarget.style.color = theme.hoverText;
                        }}
                        onMouseLeave={(e) => {
                          setHovered(null);
                          e.currentTarget.style.backgroundColor = "";
                          e.currentTarget.style.color = theme.linkText;
                        }}
                        onMouseMove={onMove}
                      >
                        {getName(item)}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {hovered && (
        <div
          className="fixed z-50 pointer-events-none border border-[#c8cdd6] bg-white backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex max-w-[320px]"
          style={{ left: pos.x + 16, top: pos.y + 16 }}
        >
          <img src={getImage(hovered)} className="w-15 aspect-300/450 shrink-0 object-cover bg-[#e5e7eb]" />
          <div className="p-2 flex flex-col justify-center gap-1 min-w-0">
            <p className="text-[13px] font-bold leading-tight wrap-break-word" style={{ color: theme.titleText }}>
              {getName(hovered)}
            </p>
            <div className="text-[11px] text-[#666] leading-snug">{renderInfo(hovered)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const SKELETON_COUNT = 48;

function CoverGrid<T>({
  items,
  loading,
  getName,
  getImage,
  getDate,
  renderOverlay,
}: {
  items: T[];
  loading?: boolean;
  getName: (i: T) => string;
  getImage: (i: T) => string;
  getDate: (i: T) => string | undefined;
  renderOverlay?: (i: T) => ReactNode;
}) {
  const keyOf = (i: T) => `${getName(i)}-${getDate(i) ?? ""}-${getImage(i)}`;
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="aspect-300/450 bg-[#e5e7eb] animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {items.map((item) => (
          <div key={keyOf(item)} className="relative aspect-300/450 overflow-hidden group">
            <img src={getImage(item)} alt={getName(item)} className="w-full h-full object-cover bg-[#e5e7eb]" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-1.5">
                {renderOverlay ? renderOverlay(item) : <p className="text-white text-[11px] font-bold leading-tight line-clamp-3">{getName(item)}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- per-tab content ----------

const animangaProgress = (a: Animanga) =>
  formatProgress({ progress: a.progress, progressTotal: a.progressTotal, unit: a.type === "Anime" ? "ep" : "ch" });

function AnimangaInfo(a: Animanga) {
  const progress = animangaProgress(a);
  return (
    <>
      <p>{a.type}</p>
      {progress && <p>{progress}</p>}
      {!!a.score && <p>★ {a.score}/10</p>}
      {a.date && <p>{a.date}</p>}
    </>
  );
}

function AnimangaOverlay(a: Animanga) {
  const progress = animangaProgress(a);
  return (
    <>
      <p className="text-white text-[11px] font-bold leading-tight line-clamp-2">{a.name}</p>
      <div className="flex flex-wrap gap-x-2 text-[10px] text-white/70">
        {progress && <span>{progress}</span>}
        {!!a.score && <span>★ {a.score}/10</span>}
      </div>
      {a.date && <p className="text-[10px] text-white/70">{a.date}</p>}
    </>
  );
}

function AnimangaView({ data, viewMode, loading, theme }: { data: Animanga[]; viewMode: ViewMode; loading: boolean; theme: AlphaTheme }) {
  return viewMode === "grid" ? (
    <CoverGrid items={data} loading={loading} getName={(a) => a.name} getImage={(a) => a.img} getDate={(a) => a.date} renderOverlay={AnimangaOverlay} />
  ) : (
    <AlphaList items={data} loading={loading} getName={(a) => a.name} getImage={(a) => a.img} theme={theme} renderInfo={AnimangaInfo} />
  );
}

function GamesView({ data, viewMode, theme }: { data: Game[]; viewMode: ViewMode; theme: AlphaTheme }) {
  return viewMode === "grid" ? (
    <CoverGrid
      items={data}
      getName={(g) => g.name}
      getImage={(g) => g.cover}
      getDate={(g) => g.finished ?? undefined}
      renderOverlay={(g) => (
        <>
          <p className="text-white text-[11px] font-bold leading-tight line-clamp-2">{g.name}</p>
          <div className="flex flex-wrap gap-1">
            <PlatformBadge value={g.playedOn || g.platform || "-"} compact />
            {g.isPlatined && (
              <span className="flex h-5 items-center gap-1 rounded bg-black/40 px-1.5">
                <Trophy size={10} className="text-yellow-400" />
              </span>
            )}
            {g.duration && (
              <span className="flex h-5 items-center gap-1 rounded bg-black/40 px-1.5">
                <Clock size={10} className="text-white/70" />
                <span className="text-[10px] tabular-nums text-white/70">{g.duration}</span>
              </span>
            )}
          </div>
          <p className="text-[10px] text-white/70">{g.finished ?? "Jogando"}</p>
        </>
      )}
    />
  ) : (
    <AlphaList
      items={data}
      getName={(g) => g.name}
      getImage={(g) => g.cover}
      theme={theme}
      renderInfo={(g) => (
        <>
          <p>{g.duration}</p>
          <p>{g.finished ?? "Em andamento"}</p>
          <p>{g.platform}</p>
        </>
      )}
    />
  );
}

function WatchView({ data, viewMode, theme }: { data: WatchItem[]; viewMode: ViewMode; theme: AlphaTheme }) {
  return viewMode === "grid" ? (
    <CoverGrid
      items={data}
      getName={(m) => m.name}
      getImage={(m) => m.img}
      getDate={(m) => m.date}
      renderOverlay={(m) => (
        <>
          <p className="text-white text-[11px] font-bold leading-tight line-clamp-2">{m.name}</p>
          {m.date && <p className="text-[10px] text-white/70">{m.date}</p>}
        </>
      )}
    />
  ) : (
    <AlphaList items={data} getName={(m) => m.name} getImage={(m) => m.img} theme={theme} renderInfo={(m) => (m.date ? <p>{m.date}</p> : null)} />
  );
}

// ---------- sorting ----------

/** Newest first; items without a date go last. */
function sortByDateDesc<T>(items: T[], getDate: (i: T) => string | undefined) {
  return [...items].sort((a, b) => {
    const da = getDate(a);
    const db = getDate(b);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return dateKey(db) - dateKey(da);
  });
}

function sortForView<T extends { date?: string }>(items: T[], mode: ViewMode) {
  return mode === "grid" ? sortByDateDesc(items, (i) => i.date) : items;
}

/** Grid: in-progress games first (by start date), then finished (by finish date). */
function sortGames(items: Game[], mode: ViewMode) {
  if (mode !== "grid") return items;
  const playing: Game[] = [];
  const finished: Game[] = [];
  for (const g of items) (g.finished ? finished : playing).push(g);
  return [...sortByDateDesc(playing, (g) => g.started ?? undefined), ...sortByDateDesc(finished, (g) => g.finished ?? undefined)];
}

const WATCH_DATA = { movies, series };
const ANIMANGA_TYPES = { anime: ["Anime"], manga: ["Manga", "Manwha"] };

const isTab = (v: string | undefined): v is Tab => TABS.some((t) => t === v);

export default function MedialogPage() {
  const { tab: param } = useParams();
  const valid = isTab(param);
  const tab: Tab = valid ? param : "games";
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const assets = TAB_ASSETS[tab];
  const isAnimanga = tab === "anime" || tab === "manga";
  const animanga = useAnimanga({ enabled: isAnimanga });

  const data = useMemo(() => {
    switch (tab) {
      case "games":
        return sortGames(games, viewMode);
      case "movies":
      case "series":
        return sortForView(WATCH_DATA[tab], viewMode);
      case "anime":
      case "manga": {
        const types = ANIMANGA_TYPES[tab];
        return sortForView(
          animanga.data.filter((a) => types.includes(a.type)),
          viewMode,
        );
      }
    }
  }, [tab, viewMode, animanga.data]);

  if (!valid) return <Navigate to="/notfound" replace />;

  return (
    <MedialogLayout assets={assets} selectedTab={tab} itemCount={data.length} viewMode={viewMode} onViewModeChange={setViewMode}>
      {tab === "games" && <GamesView data={data as Game[]} viewMode={viewMode} theme={assets.alphaList} />}
      {isAnimanga && <AnimangaView data={data as Animanga[]} viewMode={viewMode} loading={animanga.loading} theme={assets.alphaList} />}
      {(tab === "movies" || tab === "series") && <WatchView data={data as WatchItem[]} viewMode={viewMode} theme={assets.alphaList} />}
    </MedialogLayout>
  );
}
