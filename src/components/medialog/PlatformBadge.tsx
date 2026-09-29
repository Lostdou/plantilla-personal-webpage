import type { ReactNode } from "react";
import { Gamepad2, Monitor } from "lucide-react";
import { FaPlaystation, FaSteam } from "react-icons/fa";

export function formatProgress({
  progress,
  progressTotal,
  unit,
}: {
  progress?: number | null;
  progressTotal?: number | null;
  unit: "ep" | "ch";
}) {
  if (progress == null) return null;
  const label = unit === "ch" ? "cap" : unit;
  return progressTotal ? `${progress}/${progressTotal} ${label}` : `${progress} ${label}`;
}

/** "36h34m" -> 36.57 hours */
export function parseDurationHours(value?: string | null): number {
  if (!value) return 0;
  const h = value.match(/(\d+)h/);
  const m = value.match(/(\d+)m/);
  return (h ? Number(h[1]) : 0) + (m ? Number(m[1]) : 0) / 60;
}

type PlatformStyle = { icon: ReactNode; label: string; bg: string; color?: string };

const ps = <FaPlaystation size={12} />;
const platforms: Record<string, PlatformStyle> = {
  ps5: { icon: ps, label: "PS5", bg: "#fff", color: "#000" },
  ps4: { icon: ps, label: "PS4", bg: "#006fcd" },
  ps3: { icon: ps, label: "PS3", bg: "#006fcd" },
  ps2: { icon: ps, label: "PS2", bg: "#006fcd" },
  ps1: { icon: ps, label: "PS1", bg: "#006fcd" },
  psp: { icon: ps, label: "PSP", bg: "#006fcd" },
  "ps vita": { icon: ps, label: "VITA", bg: "#006fcd" },
  steam: { icon: <FaSteam size={12} />, label: "Steam", bg: "#2a475e" },
  pc: { icon: <Monitor size={12} />, label: "PC", bg: "#3b315f" },
};

export default function PlatformBadge({ value, compact = false }: { value?: string | null; compact?: boolean }) {
  if (!value || value === "-") return <span>-</span>;
  const p = platforms[value.toLowerCase().trim()];
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-flex size-[19px] items-center justify-center rounded-sm border border-gray-400"
        style={{ backgroundColor: p?.bg ?? "#6b7280", color: p?.color ?? "#fff" }}
      >
        {p?.icon ?? <Gamepad2 size={10} />}
      </span>
      {!compact && (p?.label ?? value)}
    </span>
  );
}
