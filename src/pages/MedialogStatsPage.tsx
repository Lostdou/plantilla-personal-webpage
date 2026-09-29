import { useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import PlatformBadge, { parseDurationHours } from "../components/medialog/PlatformBadge";
import { games, type Game } from "../data/games";
import { useMedialogStats } from "../lib/api";
import { parseDate } from "../lib/dates";
import "./medialog-stats.css";

// ---------- small UI pieces ----------

function StatRow({ label, value, accent }: { label: string; value: ReactNode; accent?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#333]/10 last:border-b-0">
      <span className="text-[#444] text-[13px]">{label}</span>
      <span className="text-[13px] font-semibold" style={{ color: accent || "#111" }}>
        {value}
      </span>
    </div>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[#666] text-[13px] md:text-[15px] font-semibold mb-2 uppercase tracking-widest">{children}</h3>;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-center font-['Space_Grotesk',sans-serif] text-[22px] font-bold italic tracking-tight text-[#1a1a1a] md:text-[28px]">{children}</h2>;
}

function Card({ children }: { children: ReactNode }) {
  return <div className="w-full p-3 md:p-4 border border-[#888]/20 bg-[#f5f5f5]">{children}</div>;
}

const PALETTE = ["#2a7a6a", "#c75450", "#d49a3a", "#4a7aa8", "#8a4a7a", "#6a8a4a", "#b8633e", "#5a6a7a", "#9a6a8a", "#7a7a3a"];
const ACCENT = "#2a7a6a";
const METRIC_COLOR = "#7fe3cf";

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

// ---------- per-year line chart (hand-rolled SVG) ----------

function YearLineChart({ data, label }: { data: { year: string; count: number }[]; label: string }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.count));
  if (max === 0) return null;

  const W = 720, H = 230, padX = 34, padTop = 22, padBottom = 38;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;
  const top = Math.max(1, Math.ceil(max / 5) * 5);

  const points = data.map((d, i) => ({ ...d, x: padX + i * step, y: padTop + (1 - d.count / top) * innerH }));
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = [`${points[0].x},${padTop + innerH}`, line, `${points[points.length - 1].x},${padTop + innerH}`].join(" ");
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((top / 4) * i)).reverse();

  return (
    <div className="w-full font-mono">
      <div className="w-full overflow-hidden">
        <div className="relative w-full bg-white" style={{ height: H }}>
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
            {ticks.map((t) => {
              const y = padTop + (1 - t / top) * innerH;
              return (
                <g key={t}>
                  <line x1={padX} x2={W - padX} y1={y} y2={y} stroke="#d9dde4" strokeDasharray={t === 0 ? "0" : "4 4"} />
                  <text x={padX - 9} y={y + 4} textAnchor="end" className="fill-[#777] text-[10px]">
                    {t}
                  </text>
                </g>
              );
            })}
            <polygon points={area} fill={ACCENT} opacity="0.13" />
            <polyline points={line} fill="none" stroke={ACCENT} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            {points.map((p) => (
              <g key={p.year}>
                <line x1={p.x} x2={p.x} y1={p.y} y2={padTop + innerH} stroke="#c8cdd6" strokeDasharray="3 5" />
                <text x={p.x} y={H - 15} textAnchor="middle" className="fill-[#555] text-[11px] font-semibold">
                  {p.year}
                </text>
                <text x={p.x} y={Math.max(12, p.y - 10)} textAnchor="middle" className="fill-[#13427c] text-[12px] font-bold">
                  {p.count}
                </text>
                <circle cx={p.x} cy={p.y} r="5" fill={ACCENT} stroke="#fff" strokeWidth="2" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ---------- tooltip ----------

function Tooltip({ label, children, position = "top", className = "" }: { label: string; children: ReactNode; position?: "top" | "bottom"; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const update = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ top: position === "top" ? r.top : r.bottom, left: r.left + r.width / 2 });
  };
  return (
    <span ref={ref} onMouseEnter={update} onMouseMove={update} onMouseLeave={() => setPos(null)} className={`relative inline-flex ${className}`}>
      {children}
      {pos &&
        createPortal(
          <span
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              transform: position === "top" ? "translate(-50%, calc(-100% - 4px))" : "translate(-50%, 4px)",
            }}
            className="whitespace-nowrap bg-[#1a1a1a] text-white px-2 py-1 z-50 pointer-events-none text-[12px]"
          >
            {label}
          </span>,
          document.body,
        )}
    </span>
  );
}

// ---------- gantt timeline ----------

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function finishedYears(list: Game[]) {
  const years = new Set<number>();
  for (const g of list) {
    if (!g.finished) continue;
    const y = parseDate(g.finished).getFullYear();
    if (!Number.isNaN(y)) years.add(y);
  }
  return [...years].sort((a, b) => a - b);
}

type GanttItem = {
  name: string;
  startPct: number;
  widthPct: number;
  startedBeforeYear: boolean;
  started: string;
  finished: string;
  days: number;
  lane: number;
};

function buildGantt(list: Game[], year: number) {
  const yearStart = new Date(year, 0, 1).getTime();
  const yearLen = new Date(year, 11, 31, 23, 59, 59).getTime() - yearStart;

  const items = list
    .filter((g) => g.started && g.finished && parseDate(g.finished).getFullYear() === year)
    .map((g) => {
      const s = parseDate(g.started!).getTime();
      const f = parseDate(g.finished!).getTime();
      const clamped = Math.max(s, yearStart);
      return {
        name: g.name,
        startPct: ((clamped - yearStart) / yearLen) * 100,
        widthPct: Math.max(((f - clamped) / yearLen) * 100, 0.6),
        startedBeforeYear: s < yearStart,
        started: g.started!,
        finished: g.finished!,
        days: Math.max(1, Math.round((f - s) / (1000 * 60 * 60 * 24))),
      };
    })
    .sort((a, b) => a.startPct - b.startPct);

  // Greedy lane packing.
  const GAP = 0.3;
  const laneEnds: number[] = [];
  const placed: GanttItem[] = items.map((it) => {
    const end = it.startPct + it.widthPct;
    let lane = laneEnds.findIndex((e) => it.startPct >= e + GAP);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else laneEnds[lane] = end;
    return { ...it, lane };
  });

  return { year, items: placed, laneCount: laneEnds.length };
}

function GanttChart({ gantt, years, onSelectYear }: { gantt: ReturnType<typeof buildGantt>; years: number[]; onSelectYear: (y: number) => void }) {
  const LANE_H = 28, LANE_GAP = 4;
  const height = gantt.laneCount * LANE_H + Math.max(0, gantt.laneCount - 1) * LANE_GAP;
  return (
    <div className="font-mono">
      {years.length > 1 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => onSelectYear(y)}
              className={`px-2 py-px border text-[11px] transition-colors duration-200 ${
                y === gantt.year ? "bg-[#2a7a6a] text-white border-[#2a7a6a]" : "bg-white text-[#666] border-[#ccc] hover:bg-[#eee]"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="min-w-150 pb-3">
          <div className="grid grid-cols-12 mb-1 text-[10px] text-[#888] select-none">
            {MONTHS.map((m, i) => (
              <span key={i} className="text-center">
                {m}
              </span>
            ))}
          </div>
          <div className="relative w-full transition-[height] duration-300 ease-out" style={{ height }}>
            <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={i < 11 ? "border-r border-[#ddd]" : ""} />
              ))}
            </div>
            <div key={gantt.year} className="medialog-gantt-year relative">
              {Array.from({ length: gantt.laneCount }).map((_, lane) => (
                <div key={lane} className="absolute w-full" style={{ height: LANE_H, top: lane * (LANE_H + LANE_GAP) }}>
                  {gantt.items
                    .filter((it) => it.lane === lane)
                    .map((it, i) => (
                      <div key={i} className="absolute h-full transition-[left,width] duration-300 ease-out" style={{ left: `${it.startPct}%`, width: `${it.widthPct}%` }}>
                        <Tooltip
                          label={`${it.startedBeforeYear ? "- " : ""}${it.name} - ${it.started} - ${it.finished} (${it.days}d)`}
                          className="block w-full h-full"
                        >
                          <div className="h-full w-full transition-opacity duration-200" style={{ backgroundColor: colorFor(it.name) }} />
                        </Tooltip>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- layout ----------

const ASSETS = { wallpaper: "/assets/medialog-stats/wallpaper.webp", banner: "/assets/medialog-stats/banner.webp" };

function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen justify-center bg-[#f0f0f0] bg-cover bg-fixed font-['Space_Grotesk',sans-serif] text-[#111]"
      style={{ backgroundImage: `url(${ASSETS.wallpaper})` }}
    >
      <div className="relative flex min-h-screen w-full flex-col bg-[#fafafa] px-3 py-1 shadow-[0_0_60px_40px_rgba(250,250,250,0.8)] md:mx-auto md:max-w-220">
        <div className="relative z-10 flex flex-col space-y-4 pb-4">
          <div className="flex m-0! text-[8px] font-pixel">
            <Link to="/" className="text-[#2a7a6a] hover:text-[#2a7a6a]/50 shrink-0">
              {"< "} inicio
            </Link>
          </div>
          <img src={ASSETS.banner} className="w-full object-cover object-top h-40 md:h-75 shrink-0" />
          {children}
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#e5e5e5] ${className}`} />;
}

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full p-3 md:p-4 border border-[#888]/20 bg-[#f5f5f5] ${className}`}>
      <Skeleton className="h-full w-full" />
    </div>
  );
}

function AnimangaSkeleton() {
  return (
    <>
      <SkeletonCard className="h-24" />
      <SkeletonCard className="h-20" />
      <SkeletonCard className="h-24" />
      <SkeletonCard className="h-56" />
    </>
  );
}

type CoverItem = { name: string; cover: string; metric: ReactNode; subtitle?: ReactNode };

function CoverRow({ items }: { items: CoverItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {items.map((it, i) => (
        <div key={`${it.name}-${i}`} className="relative aspect-264/352 overflow-hidden group bg-[#e5e7eb]">
          <img src={it.cover} alt={it.name} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-1.5">
            <p className="text-white text-[11px] font-bold leading-tight line-clamp-2">{it.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold" style={{ color: METRIC_COLOR }}>
                {it.metric}
              </span>
              {it.subtitle && <span className="text-white/90">{it.subtitle}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- game stats ----------

function daysBetween(start: string | null, end: string | null) {
  if (!start || !end) return null;
  return Math.round((parseDate(end).getTime() - parseDate(start).getTime()) / 864e5);
}

function computeGameStats(list: Game[]) {
  const total = list.length;
  const finished = list.filter((g) => g.finished);
  const playing = list.filter((g) => !g.finished);
  const totalHours = list.map((g) => parseDurationHours(g.duration)).reduce((a, b) => a + b, 0);
  const avgHours = total > 0 ? totalHours / total : 0;
  const completionDays = finished.map((g) => daysBetween(g.started, g.finished)).filter((d): d is number => d !== null && d >= 0);
  const avgDays = completionDays.length > 0 ? completionDays.reduce((a, b) => a + b, 0) / completionDays.length : 0;
  const platforms = new Set(list.map((g) => g.platform)).size;

  const topGamesByHours = list
    .map((g) => ({ name: g.name, cover: g.cover, playedOn: g.playedOn, hours: Math.round(parseDurationHours(g.duration) * 10) / 10 }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10);

  const lastGamesFinished = list
    .filter((g) => !!g.finished)
    .sort((a, b) => parseDate(b.finished!).getTime() - parseDate(a.finished!).getTime())
    .slice(0, 10)
    .map(({ name, cover, playedOn, finished }) => ({ name, cover, playedOn, finished: finished! }));

  const perYear = new Map<string, number>();
  for (const g of finished) {
    const y = String(parseDate(g.finished!).getFullYear());
    perYear.set(y, (perYear.get(y) ?? 0) + 1);
  }
  const finishedPerYear = [...perYear.entries()].sort(([a], [b]) => Number(a) - Number(b)).map(([year, count]) => ({ year, count }));

  return {
    summary: {
      total,
      finished: finished.length,
      currentlyPlaying: playing.length,
      totalHours: Math.round(totalHours),
      avgHoursPerGame: Math.round(avgHours * 10) / 10,
      avgCompletionDays: Math.round(avgDays),
      platforms,
    },
    topGamesByHours,
    lastGamesFinished,
    finishedPerYear,
  };
}

// ---------- page ----------

export default function MedialogStatsPage() {
  const { stats } = useMedialogStats();
  const { summary, topGamesByHours, lastGamesFinished, finishedPerYear } = useMemo(() => computeGameStats(games), []);
  const years = useMemo(() => finishedYears(games), []);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const year = selectedYear ?? years[years.length - 1] ?? null;
  const gantt = useMemo(() => (year !== null ? buildGantt(games, year) : null), [year]);

  const topCovers = topGamesByHours.map((g) => ({
    name: g.name,
    cover: g.cover,
    metric: `${g.hours}h`,
    subtitle: <PlatformBadge value={g.playedOn || "-"} compact />,
  }));
  const lastCovers = lastGamesFinished.map((g) => ({
    name: g.name,
    cover: g.cover,
    metric: g.finished,
    subtitle: <PlatformBadge value={g.playedOn || "-"} compact />,
  }));

  const animangaTotal = stats?.animangaTypes.reduce((a, t) => a + t.value, 0) ?? 0;
  const grandTotal = summary.total + animangaTotal;

  return (
    <StatsLayout>
      <SectionTitle>Estatisticas de Jogos</SectionTitle>

      <Card>
        <CardTitle>Biblioteca</CardTitle>
        <StatRow label="Concluidos" value={summary.finished} />
        {summary.currentlyPlaying > 0 && <StatRow label="Jogando Atualmente" value={summary.currentlyPlaying} />}
        <StatRow label="Plataformas" value={summary.platforms} />
      </Card>

      <Card>
        <CardTitle>Tempo</CardTitle>
        <StatRow label="Horas Totais" value={`${summary.totalHours}h`} />
        <StatRow label="Media de Horas/Jogo" value={`${summary.avgHoursPerGame}h`} />
        <StatRow label="Media de Dias para Concluir" value={`${summary.avgCompletionDays}d`} />
      </Card>

      <Card>
        <CardTitle>Top 10 Jogos por Horas</CardTitle>
        <CoverRow items={topCovers} />
      </Card>

      <Card>
        <CardTitle>Ultimos 10 Jogos Concluidos</CardTitle>
        <CoverRow items={lastCovers} />
      </Card>

      {finishedPerYear.length > 0 && (
        <Card>
          <CardTitle>Jogos Concluidos por Ano</CardTitle>
          <YearLineChart data={finishedPerYear} label="Jogos concluidos por ano" />
        </Card>
      )}

      {gantt && gantt.items.length > 0 && (
        <Card>
          <CardTitle>{`Linha do Tempo de Atividade ${gantt.year}`}</CardTitle>
          <GanttChart gantt={gantt} years={years} onSelectYear={setSelectedYear} />
        </Card>
      )}

      <div className="pt-4 mt-2">
        <SectionTitle>Estatisticas de Animanga</SectionTitle>
      </div>

      {stats ? (
        <>
          <Card>
            <CardTitle>Biblioteca</CardTitle>
            {stats.animangaTypes.map((t) => (
              <StatRow key={t.name} label={t.name} value={t.value} />
            ))}
            {stats.animangaSummary.watching > 0 && <StatRow label="Assistindo" value={stats.animangaSummary.watching} />}
            {stats.animangaSummary.reading > 0 && <StatRow label="Lendo" value={stats.animangaSummary.reading} />}
          </Card>
          <Card>
            <CardTitle>Progresso</CardTitle>
            <StatRow label="Total de Episodios" value={stats.animangaSummary.totalEpisodes} />
            <StatRow label="Total de Capitulos" value={stats.animangaSummary.totalChapters} />
            <StatRow label="Animes Completos" value={stats.animangaSummary.animeCompleted} />
            <StatRow label="Mangas Completos" value={stats.animangaSummary.mangaCompleted} />
          </Card>
          {stats.animangaFinishedPerYear.length > 0 && (
            <Card>
              <CardTitle>Concluidos por Ano</CardTitle>
              <YearLineChart data={stats.animangaFinishedPerYear} label="Animanga concluidos por ano" />
            </Card>
          )}
        </>
      ) : (
        <AnimangaSkeleton />
      )}

      <div className="text-center pt-1 px-2 text-[13px] italic text-[#2a7a6a]">
        <span>Total: {grandTotal} itens registrados</span>
      </div>
    </StatsLayout>
  );
}
