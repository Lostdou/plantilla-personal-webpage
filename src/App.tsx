import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const MedialogPage = lazy(() => import("./pages/MedialogPage"));
const MedialogStatsPage = lazy(() => import("./pages/MedialogStatsPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const DanbooruPage = lazy(() => import("./pages/DanbooruPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/medialog" element={<Navigate to="/medialog/games" replace />} />
        <Route path="/medialog/stats" element={<MedialogStatsPage />} />
        <Route path="/medialog/:tab" element={<MedialogPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/danbooru" element={<DanbooruPage />} />
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
    </Suspense>
  );
}
