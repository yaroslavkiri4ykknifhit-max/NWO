import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/markdown";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
export const metadata = pageMetadata(
  "Журнал о продажах и переговорах",
  "Материалы New Way Out: практика продаж, переговоры и работа с клиентами.",
  "/blog/",
);
export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content" className="site-container">
        <section className="journal-hero">
          <span className="site-eyebrow">NWO / Заметки о практике</span>
          <h1>
            За пределами
            <br />
            <em>скрипта.</em>
          </h1>
          <p>
            Продажи, переговоры и работа с клиентами. По одной ситуации за раз.
          </p>
        </section>
        <div className="journal-list">
          {posts.map((post) => (
            <Link
              className="journal-entry"
              key={post.slug}
              href={`/blog/${post.slug}/`}
            >
              <div>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("ru-RU", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span>{post.readTime} на чтение</span>
              </div>
              <div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
