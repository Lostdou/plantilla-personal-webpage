import type { CSSProperties } from "react";

type ImgStyle = Pick<CSSProperties, "objectFit" | "objectPosition">;

export type HomeTheme = {
  id: string;
  name: string;
  isDefault?: boolean;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    accentText: string;
    accentSoft: string;
    text: string;
    textHighlight: string;
    stripePrimary: string;
    stripeSecondary: string;
    selectionBg: string;
    selectionText: string;
    goalDone: string;
    textHover: string;
  };
  images: {
    decGoals: string;
    decGoalsHover?: string;
    /** Image path, or a CSS color (#hex / rgb()) */
    wallpaper: string;
    wallpaperStyle?: ImgStyle;
    banner: string;
    bannerStyle?: ImgStyle;
    decLeft: string;
    decLeftStyle?: ImgStyle;
    decLeftHover?: string;
    decLeftHoverStyle?: ImgStyle;
    decRight: string;
    decRightStyle?: ImgStyle;
    decRightHover?: string;
    decRightHoverStyle?: ImgStyle;
    avatar: string;
    avatarStyle?: ImgStyle;
    /** CSS hue-rotate value for the avatar frame, or "white" */
    avatarBorderHue: string;
    bannerMid: string;
    bannerMidBorder: string;
    bannerBottom: string;
    bannerBottomBorder: string;
  };
};

const common = {
  decGoals: "/assets/home/themes/common/goals.webp",
  decGoalsHover: "/assets/home/themes/common/goals-hover.webp",
};

export const muvLuv: HomeTheme = {
  id: "muv-luv",
  name: "Muv-Luv",
  colors: {
    primary: "#2B347C",
    primaryDark: "#1C2254",
    accent: "#6A94AB",
    accentText: "#8EA1D6",
    accentSoft: "#8EA1D6",
    text: "#FCFAE2",
    textHighlight: "#ffff91",
    stripePrimary: "#2c357c",
    stripeSecondary: "#232c6e4b",
    selectionBg: "#4d57a1",
    selectionText: "#fcfae2",
    goalDone: "#54973E",
    textHover: "#FCFAE2",
  },
  images: {
    ...common,
    wallpaper: "/assets/home/themes/muv-luv/wallpaper.webp",
    banner: "/assets/home/themes/muv-luv/banner.jpg",
    decLeft: "/assets/home/themes/muv-luv/dec-left.png",
    decLeftHover: "/assets/home/themes/muv-luv/dec-left-hover.png",
    decRight: "/assets/home/themes/muv-luv/dec-right.png",
    decRightHover: "/assets/home/themes/muv-luv/dec-right-hover.png",
    avatar: "/assets/home/themes/muv-luv/avatar.webp",
    avatarBorderHue: "250deg",
    bannerMid: "/assets/home/themes/muv-luv/banner-mid.png",
    bannerMidBorder: "#F6CA9B",
    bannerBottom: "/assets/home/themes/muv-luv/banner-bottom.webp",
    bannerBottomBorder: "#c23174",
  },
};

export const lain: HomeTheme = {
  id: "lain",
  name: "Lain",
  colors: {
    primary: "#000000",
    primaryDark: "#000000",
    accent: "#D2738A",
    accentText: "#e0a0b0",
    accentSoft: "#BE8F87",
    text: "#F5F1E8",
    textHighlight: "#C1B492",
    stripePrimary: "#000000",
    stripeSecondary: "#1c161b9b",
    selectionBg: "#D2738A",
    selectionText: "#F5F1E8",
    goalDone: "#54973E",
    textHover: "#F5F1E8",
  },
  images: {
    ...common,
    wallpaper: "/assets/home/themes/lain/wallpaper.png",
    banner: "/assets/home/themes/lain/banner.gif",
    bannerStyle: { objectFit: "none" },
    decLeft: "/assets/home/themes/lain/dec-left.gif",
    decLeftStyle: { objectFit: "cover" },
    decLeftHover: "/assets/home/themes/lain/dec-left-hover.gif",
    decRight: "/assets/home/themes/lain/dec-right.gif",
    decRightStyle: { objectFit: "none" },
    decRightHover: "/assets/home/themes/lain/dec-right-hover.gif",
    decRightHoverStyle: { objectFit: "none", objectPosition: "center" },
    avatar: "/assets/home/themes/lain/avatar.gif",
    avatarBorderHue: "335deg",
    bannerMid: "/assets/home/themes/lain/banner-mid.webp",
    bannerMidBorder: "#97b16e",
    bannerBottom: "/assets/home/themes/lain/banner-bottom.webp",
    bannerBottomBorder: "#b3b8b2",
  },
};

export const kuro: HomeTheme = {
  id: "black",
  name: "Kuro",
  isDefault: true,
  colors: {
    primary: "#000000",
    primaryDark: "#000000",
    accent: "white",
    accentText: "white",
    accentSoft: "white",
    text: "white",
    textHighlight: "white",
    stripePrimary: "#000000",
    stripeSecondary: "#1c161b9b",
    selectionBg: "black",
    selectionText: "gray",
    goalDone: "#54973E",
    textHover: "white",
  },
  images: {
    ...common,
    wallpaper: "/assets/home/themes/kuro/wallpaper.jpg",
    banner: "/assets/home/themes/kuro/banner.jpg",
    bannerStyle: { objectFit: "cover" },
    decLeft: "/assets/home/themes/kuro/dec-left.jpg",
    decLeftStyle: { objectFit: "cover" },
    decRight: "/assets/home/themes/kuro/dec-right.jpg",
    decRightStyle: { objectFit: "cover" },
    avatar: "/assets/home/themes/kuro/avatar.jpg",
    avatarBorderHue: "white",
    bannerMid: "/assets/home/themes/kuro/banner-mid.jpg",
    bannerMidBorder: "white",
    bannerBottom: "/assets/home/themes/kuro/banner-bottom.jpg",
    bannerBottomBorder: "white",
  },
};

export const themes: HomeTheme[] = [muvLuv, lain, kuro];

export function getDefaultTheme() {
  return themes.find((t) => t.isDefault) ?? themes[0];
}

export function getTheme(id: string) {
  return themes.find((t) => t.id === id) ?? getDefaultTheme();
}

/** CSS custom properties applied to <html> for the active theme. */
export function themeCssVars(theme: HomeTheme): [string, string][] {
  const c = theme.colors;
  return [
    ["--home-primary", c.primary],
    ["--home-primary-dark", c.primaryDark],
    ["--home-accent", c.accent],
    ["--home-accent-text", c.accentText],
    ["--home-accent-soft", c.accentSoft],
    ["--home-text", c.text],
    ["--home-text-highlight", c.textHighlight],
    ["--home-stripe-primary", c.stripePrimary],
    ["--home-stripe-secondary", c.stripeSecondary],
    ["--home-selection-bg", c.selectionBg],
    ["--home-selection-text", c.selectionText],
    ["--home-goal-done", c.goalDone],
    ["--home-text-hover", c.textHover],
    ["--home-banner-mid-border", theme.images.bannerMidBorder],
    ["--home-banner-bottom-border", theme.images.bannerBottomBorder],
  ];
}
