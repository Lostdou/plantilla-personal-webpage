import type { ComponentProps } from "react";
import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { ArrowLeft } from "lucide-react";
import BlogShell from "../components/blog/BlogShell";
import "../components/blog/blog.css";
import { getPost } from "../lib/blog";
import { formatDate } from "../lib/dates";

const mdxComponents = {
  a: (props: ComponentProps<"a">) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <BlogShell title="Post não encontrado" subtitle="esse arquivo não existe mais">
        <section className="blog-not-found">
          <p>O post que você procurou não foi encontrado.</p>
          <Link to="/blog">
            <ArrowLeft aria-hidden="true" /> Voltar ao blog
          </Link>
        </section>
      </BlogShell>
    );
  }

  const Content = post.Component;

  return (
    <div
      className="blog-page blog-page--post"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.62)), url(${post.background})` }}
    >
      <div className="blog-container">
        <header className="blog-header">
          <img src={post.banner} alt="" className="blog-header-image" />
          <div className="blog-header-shade blog-header-shade--post" aria-hidden="true" />
          <Link to="/blog" className="blog-back-link">
            <ArrowLeft aria-hidden="true" /> Voltar ao blog
          </Link>
          <div className="blog-post-header-copy">
            <h1>{post.title}</h1>
            <p>
              <span>{formatDate(post.date)}</span>
            </p>
          </div>
        </header>
        <main className="blog-post-main">
          <MDXProvider components={mdxComponents}>
            <Content />
          </MDXProvider>
        </main>
      </div>
    </div>
  );
}
