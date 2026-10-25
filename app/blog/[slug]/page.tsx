import Link from "next/link";
import { Metadata } from "next";
import { JsonLd, pageMetadata, siteUrl } from "@/lib/seo";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getPostBySlug, getPostSlugs } from "@/lib/markdown";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return {
      ...pageMetadata(
        post.meta.title,
        post.meta.excerpt,
        `/blog/${post.meta.slug}/`,
      ),
      openGraph: {
        ...pageMetadata(
          post.meta.title,
          post.meta.excerpt,
          `/blog/${post.meta.slug}/`,
        ).openGraph,
        type: "article",
        publishedTime: post.meta.date,
        authors: [post.meta.author],
      },
    };
  } catch (e) {
    return {
      title: "Статья не найдена | NWO",
    };
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post;
  try {
    const { slug } = await params;
    post = getPostBySlug(slug);
  } catch (e) {
    notFound();
  }

  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.meta.title,
            description: post.meta.excerpt,
            datePublished: post.meta.date,
            author: { "@type": "Person", name: post.meta.author },
            publisher: { "@id": `${siteUrl}/#organization` },
            mainEntityOfPage: `${siteUrl}/blog/${post.meta.slug}/`,
            inLanguage: "ru",
            image: `${siteUrl}/og.png`,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Журнал",
                item: `${siteUrl}/blog/`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.meta.title,
                item: `${siteUrl}/blog/${post.meta.slug}/`,
              },
            ],
          }}
        />
        <article className="reading-article">
          <Link href="/blog/" className="article-back">
            <ArrowLeft size={15} /> Все статьи
          </Link>
          <h1>{post.meta.title}</h1>
          <div className="article-meta">
            <span>{post.meta.author}</span>
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString("ru-RU", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span>{post.meta.readTime} на чтение</span>
          </div>
          <div className="article-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
        <section className="closing-section">
          <div className="site-container">
            <span className="site-eyebrow">От чтения к практике</span>
            <h2>
              Попробуй
              <br />
              <em>в своём диалоге.</em>
            </h2>
            <Link href="/free/" className="site-button">
              Открыть бесплатный курс <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
