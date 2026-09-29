import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { BalancedMasonryGrid, Frame } from "@masonry-grid/react";
import { apiUrl, useApi } from "../lib/api";
import "./danbooru.css";

type Favorite = {
  id: number;
  kind: "image" | "video";
  thumbUrl: string;
  fullUrl: string;
  postUrl: string;
  width: number;
  height: number;
  characters?: string;
  artist?: string;
};

const FRAME_WIDTH = 160;
const GAP = 4;

const gradientText = "bg-clip-text text-transparent bg-linear-to-b from-white to-[#7BB984] gradient-text-stroke";
const gradientTextPurple = "bg-clip-text text-transparent bg-linear-to-b from-white to-[#9C91D5]";

function FavoritesGrid({ favorites, onOpen }: { favorites: Favorite[]; onOpen: (i: number) => void }) {
  return (
    <div className="p-1">
      <BalancedMasonryGrid frameWidth={FRAME_WIDTH} gap={GAP}>
        {favorites.map((f, i) => (
          <Frame
            key={f.id}
            as="button"
            type="button"
            width={f.width}
            height={f.height}
            onClick={() => onOpen(i)}
            className="relative border border-transparent hover:border-white transition-colors"
            aria-label={f.characters || `post ${f.id}`}
          >
            <img src={apiUrl(f.thumbUrl)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover select-none" />
            {f.kind === "video" && (
              <span className="absolute right-1 top-1 rounded-full bg-black/60 p-1">
                <Play className="size-3 text-white" fill="white" />
              </span>
            )}
          </Frame>
        ))}
      </BalancedMasonryGrid>
    </div>
  );
}

const SKELETON_RATIOS: [number, number][] = [
  [3, 4], [4, 3], [1, 1], [2, 3], [16, 9], [3, 4], [1, 1], [4, 5], [3, 2], [2, 3], [4, 3], [3, 4],
];

function GridSkeleton() {
  return (
    <div className="p-1">
      <BalancedMasonryGrid frameWidth={FRAME_WIDTH} gap={GAP}>
        {SKELETON_RATIOS.map(([w, h], i) => (
          <Frame key={i} width={w} height={h} className="animate-pulse bg-white/10" />
        ))}
      </BalancedMasonryGrid>
    </div>
  );
}

function NavButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute ${prev ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-black/50 text-white/70 transition-colors hover:bg-black/70 hover:text-white`}
      aria-label={prev ? "Previous" : "Next"}
    >
      {prev ? <ChevronLeft className="size-6" /> : <ChevronRight className="size-6" />}
    </button>
  );
}

function Lightbox(props: {
  favorite: Favorite;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const { favorite, hasPrevious, hasNext, onPrevious, onNext, onClose } = props;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrevious) onPrevious();
      else if (e.key === "ArrowRight" && hasNext) onNext();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasPrevious, hasNext, onPrevious, onNext, onClose]);

  const src = apiUrl(favorite.fullUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      {hasPrevious && <NavButton direction="prev" onClick={onPrevious} />}
      <div className="flex max-h-[90vh] max-w-[80vw] flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {favorite.kind === "video" ? (
          <video key={src} src={src} controls autoPlay loop playsInline className="max-h-[82vh] max-w-[80vw]" />
        ) : (
          <img key={src} src={src} alt="" className="max-h-[82vh] max-w-[80vw] object-contain select-none" />
        )}
        <a href={favorite.postUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] font-normal text-white/70 hover:text-white hover:underline">
          {favorite.artist ? `${favorite.artist} · ` : ""}view on Danbooru
        </a>
      </div>
      {hasNext && <NavButton direction="next" onClick={onNext} />}
    </div>
  );
}

function Warning() {
  return (
    <div className="hidden md:flex gap-3 items-center">
      <img src="/assets/danbooru/portrait.webp" alt="" className="w-43 select-none" />
      <div className="message-box px-3 py-2 border-2 border-[#3d775d]/80 w-full mt-4 flex flex-col gap-1 text-[17px]">
        <span className={`block pl-4 text-[20px] font-black ${gradientText}`}>Kosugi</span>
        <span className={`block ${gradientText}`}>I should warn you first...</span>
        <span className={`block ${gradientText}`}>
          This page contains <span className={`font-bold ${gradientTextPurple}`}>sexual and explicit content</span>.
        </span>
        <span className={`block ${gradientText}`}>If you are not 18 years old or older, you should leave now!</span>
      </div>
    </div>
  );
}

const EMPTY: Favorite[] = [];

function useFavorites() {
  const { data, loading, error } = useApi<Favorite[]>("/danbooru/favorites");
  return { favorites: data ?? EMPTY, loading, error };
}

export default function DanbooruPage() {
  const { favorites, loading, error } = useFavorites();
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : Math.max(0, i - 1))), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : Math.min(favorites.length - 1, i + 1))), [favorites.length]);
  const current = index === null ? null : favorites[index];

  return (
    <div
      className="relative font-[MotoyaLMaru] font-bold min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/danbooru/background.webp)" }}
    >
      <img src="/assets/danbooru/character.webp" alt="" className="fixed bottom-0 left-10 w-20 md:w-85 select-none pointer-events-none" />
      <div className="relative text-[13px] text-black pl-1 max-w-230 mx-auto pb-2">
        <Link to="/" className={`inline-block px-2 pt-1 hover:underline ${gradientText}`}>
          {"< home"}
        </Link>
        <h1 className={`text-[32px] text-center font-black ${gradientText}`}>YourName's Danbooru</h1>
        <Warning />
        <div className="mt-2 flex flex-col backdrop-blur-sm border-2 border-black/25 bg-black/30">
          {loading && <GridSkeleton />}
          {!loading && error && <p className={`py-6 text-center text-[18px] ${gradientText}`}>couldn't load the favorites...</p>}
          {!loading && !error && favorites.length === 0 && <p className={`py-6 text-center text-[18px] ${gradientText}`}>no favorites yet...</p>}
          {!loading && !error && favorites.length > 0 && <FavoritesGrid favorites={favorites} onOpen={setIndex} />}
        </div>
      </div>
      {current && index !== null && (
        <Lightbox
          favorite={current}
          hasPrevious={index > 0}
          hasNext={index < favorites.length - 1}
          onPrevious={prev}
          onNext={next}
          onClose={close}
        />
      )}
    </div>
  );
}
