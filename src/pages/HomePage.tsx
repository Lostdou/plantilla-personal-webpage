import { HomeThemeProvider, useHomeTheme } from "../theme/HomeThemeContext";
import { Portrait, SiteBanner, Wallpaper } from "../components/home/Decorations";
import Sidebar from "../components/home/Sidebar";
import Panel from "../components/home/Panel";
import Jukebox from "../components/home/Jukebox";
import { ButtonWidget, CatAlbum, Goals, LatestPosts, MedialogRecents, Welcome } from "../components/home/Widgets";

function MainContent() {
  const { theme } = useHomeTheme();
  const img = theme.images;
  return (
    <div className="relative">
      <Panel className="p-1.5">
        <div className="space-y-1.5">
          <div className="grid md:grid-cols-[140px_1fr] gap-1.5">
            <Portrait
              src={img.decLeft}
              hoverSrc={img.decLeftHover}
              style={img.decLeftStyle}
              hoverStyle={img.decLeftHoverStyle}
              className="hidden md:block overflow-hidden"
            />
            <Welcome />
          </div>

          <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] gap-1.5 mt-1.5 *:h-60">
            <LatestPosts />
            <Jukebox />
            <CatAlbum />
          </div>

          <div className="mt-1.5">
            <img src={img.bannerMid} alt="decoration" className="w-full h-16 border border-(--home-banner-mid-border) object-cover" />
          </div>

          <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr] gap-1.5 mt-1.5 auto-rows-[15rem] md:auto-rows-[11rem]">
            <Goals />
            <MedialogRecents />
            <Portrait
              src={img.decRight}
              hoverSrc={img.decRightHover}
              style={img.decRightStyle}
              hoverStyle={img.decRightHoverStyle}
              className="hidden md:block"
              defaultPosition="top"
            />
            <ButtonWidget />
          </div>

          <div className="mt-1.5">
            <img src={img.bannerBottom} alt="decoration" className="w-full h-40 border border-(--home-banner-bottom-border) object-cover" />
          </div>
        </div>
      </Panel>
      <p className="text-center mt-2 text-(--home-text)/80">example.com © 2025 - 2026</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeThemeProvider>
      <Wallpaper />
      <div className="relative max-w-230 mx-2 md:mx-auto space-y-1.5 mb-3">
        <SiteBanner />
        <div className="grid md:grid-cols-[190px_1fr] md:gap-1.5">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </HomeThemeProvider>
  );
}
