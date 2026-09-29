import type { CSSProperties } from "react";
import { useHomeTheme } from "../../theme/HomeThemeContext";

type ImgStyle = Pick<CSSProperties, "objectFit" | "objectPosition">;

export function Wallpaper() {
  const { theme } = useHomeTheme();
  const { wallpaper, wallpaperStyle } = theme.images;
  const isColor = wallpaper.startsWith("#") || wallpaper.startsWith("rgb");
  const style: CSSProperties = isColor
    ? { backgroundColor: wallpaper }
    : {
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: wallpaperStyle?.objectFit as CSSProperties["backgroundSize"],
        backgroundPosition: wallpaperStyle?.objectPosition as CSSProperties["backgroundPosition"],
      };
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 bg-cover bg-center bg-no-repeat" style={style}>
      <div className="w-full h-full bg-(--home-primary-dark)/35" />
    </div>
  );
}

export function SiteBanner() {
  const { theme } = useHomeTheme();
  return (
    <div className="relative">
      <img
        src={theme.images.banner}
        alt="Site banner"
        className="w-full h-30 sm:h-40 md:h-55 bg-(--home-primary-dark) select-none pointer-events-none"
        style={{
          objectFit: theme.images.bannerStyle?.objectFit ?? "cover",
          objectPosition: theme.images.bannerStyle?.objectPosition ?? "center",
        }}
        loading="lazy"
      />
    </div>
  );
}

/** Decorative portrait that swaps to a hover image (if the theme has one). */
export function Portrait({
  src,
  hoverSrc,
  style,
  hoverStyle,
  alt = "Portrait",
  className = "",
  defaultPosition = "center",
}: {
  src: string;
  hoverSrc?: string;
  style?: ImgStyle;
  hoverStyle?: ImgStyle;
  alt?: string;
  className?: string;
  defaultPosition?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      {hoverSrc && (
        <img
          src={hoverSrc}
          alt={alt}
          className="absolute inset-0 z-1 w-full h-full hidden group-hover:block"
          style={{ objectFit: hoverStyle?.objectFit ?? "cover", objectPosition: hoverStyle?.objectPosition ?? defaultPosition }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: style?.objectFit ?? "cover", objectPosition: style?.objectPosition ?? defaultPosition }}
      />
    </div>
  );
}
