import { Link } from "react-router-dom";
import BlogShell from "../components/blog/BlogShell";
import { posts, type BlogPost } from "../lib/blog";
import { relativeDate, toIsoDate } from "../lib/dates";

function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="blog-post-list" aria-label="Posts do blog">
      <table className="blog-topics-table">
        <thead>
          <tr>
            <th scope="col">Tópicos</th>
            <th scope="col">Categoria</th>
            <th scope="col">Data</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((p) => (
              <tr key={p.slug} className="blog-post-row">
                <td>
                  <Link to={`/blog/${p.slug}`} className="blog-post-title">
                    {p.title}
                  </Link>
                </td>
                <td className="blog-post-category">{p.category}</td>
                <td className="blog-post-date">
                  <time dateTime={toIsoDate(p.date)}>{relativeDate(p.date)}</time>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="blog-empty">
                Nenhum post encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default function BlogPage() {
  return (
    <BlogShell title="YourName Blog" subtitle="posts, atualizações e pensamentos">
      <PostList posts={posts} />
    </BlogShell>
  );
}
