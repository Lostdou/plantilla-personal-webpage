import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { SiMyanimelist, SiTwitch, SiX, SiYoutube } from "react-icons/si";
import Panel from "./Panel";
import { useHomeTheme } from "../../theme/HomeThemeContext";
import { themes } from "../../theme/themes";
import { getAge } from "../../lib/age";

// ---------- profile ----------

function ProfileRow({ bullet, label, value }: { bullet: string; label: string; value: ReactNode }) {
  return (
    <div className="flex gap-1 items-center">
      <p className="text-(--home-accent-soft)">{bullet}</p>
      <p className="text-(--home-accent-soft)">{label}</p>
      <p className="text-(--home-text)">{value}</p>
    </div>
  );
}

function ProfileCard() {
  const { theme } = useHomeTheme();
  const hue = theme.images.avatarBorderHue;
  return (
    <Panel className="p-1.5 hidden md:flex items-center gap-1.5 overflow-hidden">
      <div className="relative flex size-18">
        <img
          src="/assets/home/profile-frame.webp"
          alt="Profile Frame"
          className="absolute inset-0 w-full h-full object-contain z-12 select-none pointer-events-none"
          style={{ filter: hue === "white" ? "brightness(0) invert(1)" : `hue-rotate(${hue})` }}
        />
        <img
          src={theme.images.avatar}
          alt="Profile Picture"
          className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-sm z-10 select-none pointer-events-none"
          style={{
            objectFit: theme.images.avatarStyle?.objectFit ?? "contain",
            objectPosition: theme.images.avatarStyle?.objectPosition ?? "center",
          }}
        />
      </div>
      <div className="*:text-[12px]">
        <ProfileRow bullet="-" label="name:" value="yourname" />
        <ProfileRow bullet="+" label="age:" value={getAge()} />
        <ProfileRow bullet="-" label="hobby:" value="games" />
        <ProfileRow bullet="+" label="prns:" value="any" />
      </div>
    </Panel>
  );
}

// ---------- navigation ----------

type NavItem = { to: string; label: string; image: string; dataHoverY: string; imageClassName: string };

const NAV: NavItem[] = [
  { to: "/about", label: "about", image: "/assets/home/navigation/about.webp", dataHoverY: "-55", imageClassName: "size-30 -right-1 top-0 group-hover:translate-y-[-55%]" },
  { to: "/blog", label: "blog", image: "/assets/home/navigation/blog.webp", dataHoverY: "37", imageClassName: "size-21 right-1.5 -top-15 group-hover:translate-y-[37%]" },
  { to: "/medialog", label: "medialog", image: "/assets/home/navigation/medialog.webp", dataHoverY: "37", imageClassName: "size-21 right-1.5 -top-15 group-hover:translate-y-[37%]" },
  { to: "/medialog/stats", label: "status", image: "/assets/home/navigation/stats.webp", dataHoverY: "37", imageClassName: "size-21 right-1.5 -top-15 group-hover:translate-y-[37%]" },
  { to: "/danbooru", label: "danbooru", image: "/assets/home/navigation/danbooru.webp", dataHoverY: "20", imageClassName: "size-24 right-1.5 -top-15 group-hover:translate-y-[20%]" },
  { to: "/resources", label: "resources", image: "/assets/home/navigation/resources.webp", dataHoverY: "60", imageClassName: "size-32 right-1.5 -top-15 group-hover:translate-y-[25%]" },
];

const NeocitiesIcon = ({ size }: { size: number }) => (
  <img src="/assets/home/navigation/neocities.webp" alt="" width={size} height={size} className="object-contain" />
);

const SOCIALS = [
  { href: "https://www.youtube.com/@yourname", label: "YouTube", Icon: SiYoutube },
  { href: "https://www.twitch.tv/yourname", label: "Twitch", Icon: SiTwitch },
  { href: "https://x.com/yourname", label: "X", Icon: SiX },
  { href: "https://myanimelist.net/profile/yourname", label: "MyAnimeList", Icon: SiMyanimelist },
  { href: "https://neocities.org/site/yourname", label: "Neocities", Icon: NeocitiesIcon },
];

function NavSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-(--home-primary)">
      <h1 className="text-(--home-text) pl-1.5 border-b border-(--home-accent)/30 border-dotted blue-stripe-bg text-[8px] font-pixel uppercase">{title}</h1>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function DesktopNavLink({ to, label, image, imageClassName, dataHoverY }: NavItem) {
  return (
    <Link
      to={to}
      className="text-(--home-accent-soft) bg-linear-to-t from-(--home-accent)/15 via-transparent to-(--home-accent)/5 hover:text-(--home-text-hover) hover:underline group relative overflow-hidden pl-2 border-b border-dotted last:border-none border-(--home-accent)/30"
    >
      {label}
      <img
        src={image}
        data-hover-y={dataHoverY}
        style={{ "--hover-y": `${dataHoverY}%` } as React.CSSProperties}
        className={`absolute opacity-0 translate-y-full group-hover:opacity-85 transition-all duration-125 ease-in-out select-none pointer-events-none ${imageClassName}`}
      />
    </Link>
  );
}

function Navigation() {
  const { pathname } = useLocation();
  return (
    <>
      {/* Mobile: tile grid */}
      <div className="flex flex-col gap-1.5 lowercase md:hidden">
        <section className="overflow-hidden border border-(--home-accent) bg-(--home-primary)/95">
          <div className="blue-stripe-bg flex items-center justify-between border-b border-(--home-accent)/40 px-2 py-1">
            <h2 className="font-pixel text-[8px] uppercase text-(--home-text)">navigation</h2>
          </div>
          <nav aria-label="Main navigation" className="grid grid-cols-2 gap-1 p-1.5 min-[430px]:grid-cols-3">
            {NAV.map((item) => {
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex min-h-16 items-end overflow-hidden border px-2 py-1.5 transition active:scale-[0.98] ${
                    active
                      ? "border-(--home-text-highlight) bg-(--home-accent)/30 text-(--home-text-highlight)"
                      : "border-(--home-accent)/55 bg-linear-to-br from-(--home-primary-dark)/80 via-(--home-primary) to-(--home-accent)/20 text-(--home-accent-soft)"
                  }`}
                >
                  <img src={item.image} alt="" className="pointer-events-none absolute -bottom-3 -right-2 w-22 object-contain opacity-70 transition group-active:scale-105" />
                  <span className="relative z-10 max-w-[75%] font-pixel text-[8px] leading-tight drop-shadow-[1px_1px_0_var(--home-primary-dark)]">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </section>
      </div>

      {/* Desktop: link list + socials */}
      <div className="hidden flex-col gap-1.5 overflow-hidden lowercase *:border *:border-(--home-accent) md:flex">
        <NavSection title="yourname">
          {NAV.map((item) => (
            <DesktopNavLink key={item.to} {...item} />
          ))}
        </NavSection>
        <NavSection title="off-site">
          <div className="grid grid-cols-6 gap-0.3 p-0.3 *:flex *:size-7.5 *:items-center *:justify-center *:hover:opacity-60">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
                <Icon size={22} color="var(--home-text)" />
              </a>
            ))}
          </div>
        </NavSection>
      </div>
    </>
  );
}

// ---------- theme picker ----------

function ThemeSelect() {
  const { theme, setThemeId } = useHomeTheme();
  return (
    <Panel className="p-1.5">
      <div className="relative">
        <select
          value={theme.id}
          onChange={(e) => setThemeId(e.target.value)}
          className="w-full appearance-none bg-(--home-primary-dark)/40 border border-(--home-accent)/50 text-(--home-text) text-[12px] leading-none h-7 px-1.5 pr-5 hover:border-(--home-accent) transition-colors"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-(--home-text)/40" />
      </div>
    </Panel>
  );
}

export default function Sidebar() {
  return (
    <div className="space-y-1.5">
      <ProfileCard />
      <Navigation />
      <ThemeSelect />
    </div>
  );
}
