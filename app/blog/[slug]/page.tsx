import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Clock, User, ArrowUpRight } from 'lucide-react'
import { getPostBySlug, getPostSlugs } from '@/lib/markdown'

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = getPostBySlug(slug)
    return {
      title: `${post.meta.title} | NWO Journal`,
      description: post.meta.excerpt,
    }
  } catch (e) {
    return {
      title: 'Статья не найдена | NWO',
    }
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  let post
  try {
    const { slug } = await params
    post = getPostBySlug(slug)
  } catch (e) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white text-[#121212] font-ui selection:bg-black selection:text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-300 bg-black py-2 text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-red-700 px-1.5 py-0.5 font-ui text-[10px] font-bold uppercase tracking-[0.08em]">
              Статья
            </span>
            <span className="text-gray-300">Материалы редакции New Way Out</span>
          </div>
          <Link href="/blog" className="text-gray-300 hover:text-white flex items-center gap-1">
            Все статьи <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={14} /> В журнал
          </Link>
          
          <Link href="/" className="text-center">
            <span 
              className="text-3xl sm:text-4xl text-black block tracking-tight select-none"
              style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
            >
              New Way Out
            </span>
            <span className="text-[9px] font-display uppercase tracking-[0.3em] text-gray-500 block -mt-1">
              Editorial Journal
            </span>
          </Link>

          <Link
            href="/mentorship"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
          >
            Менторство
          </Link>
        </div>
        <div className="border-t border-b border-black py-1.5 text-center bg-[#fafaf9]">
          <p className="font-display text-[11px] uppercase tracking-[0.25em] text-gray-600">
            Практика высоких чеков · Разбор реальных переговоров
          </p>
        </div>
      </header>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <header className="mb-10 border-b border-gray-300 pb-8">
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-black leading-tight mb-6">
            {post.meta.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-1.5 text-black">
              <User size={13} /> {post.meta.author}
            </div>
            <span>•</span>
            <time>
              {new Date(post.meta.date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={13} /> {post.meta.readTime}
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none font-ui leading-relaxed text-gray-800 prose-headings:font-display prose-headings:font-bold prose-headings:text-black prose-p:font-display prose-p:text-lg prose-p:leading-relaxed prose-strong:text-black prose-blockquote:border-l-2 prose-blockquote:border-black prose-blockquote:bg-[#fafaf9] prose-blockquote:p-4 prose-blockquote:italic">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      {/* Action Footer Callout */}
      <section className="border-t border-b border-gray-300 bg-[#fafaf9] py-14 text-center">
        <div className="max-w-xl mx-auto px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 block mb-2">
            Следующий шаг
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-black mb-3">
            Хочешь освоить эти техники на практике?
          </h3>
          <p className="text-sm text-gray-600 font-ui leading-relaxed mb-6">
            Пройди бесплатный базовый курс или заходи в личное менторство к Ярославу с гарантией доведения до первого оффера.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              href="/mentorship" 
              className="px-6 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Личное менторство
            </Link>
            <Link 
              href="/free" 
              className="px-6 py-3.5 bg-white border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Бесплатный курс
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 text-center text-xs text-gray-500 font-ui">
        <div className="mx-auto max-w-[1200px] px-4">
          <span 
            className="text-2xl text-black block mb-2 select-none"
            style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
          >
            New Way Out
          </span>
          <p>© {new Date().getFullYear()} NWO Journal. Все материалы защищены.</p>
        </div>
      </footer>
    </main>
  )
}
