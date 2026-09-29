import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./blog.css";

type Props = {
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  background?: string;
};

export default function BlogShell({ title, subtitle, children, background }: Props) {
  const style = background
    ? { backgroundImage: `linear-gradient(rgba(2, 8, 19, 0.78), rgba(2, 8, 19, 0.88)), url(${background})` }
    : { backgroundImage: "url(/assets/blog/wallpaper.webp)" };

  return (
    <div className="blog-page" style={style}>
      <div className="blog-page-overlay" aria-hidden="true" />
      <div className="blog-container">
        <header className="blog-header">
          <img src="/assets/blog/banner.webp" alt="" className="blog-header-image" />
          <div className="blog-header-shade" aria-hidden="true" />
          <Link to="/" className="blog-back-link">
            <ArrowLeft aria-hidden="true" /> Voltar ao início
          </Link>
          <div className="blog-header-copy">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>
        <main className="blog-main">{children}</main>
      </div>
    </div>
  );
}
