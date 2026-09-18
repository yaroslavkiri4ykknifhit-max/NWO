import Link from 'next/link'
import { Metadata } from 'next'
import { getAllPosts } from '@/lib/markdown'
import { ArrowLeft, Clock, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Журнал о продажах | NWO (New Way Out)',
  description: 'Статьи, кейсы и разборы сделок от NWO. Практические советы по B2B и B2C продажам без воды.',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-white text-[#121212] font-ui selection:bg-black selection:text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-300 bg-black py-2 text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-red-700 px-1.5 py-0.5 font-ui text-[10px] font-bold uppercase tracking-[0.08em]">
              Редакция
            </span>
            <span className="text-gray-300">Статьи, разборы звонков и боевая психология продаж</span>
          </div>
          <Link href="/" className="text-gray-300 hover:text-white flex items-center gap-1">
            На главную <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Masthead Header */}
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={14} /> На главную
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
            Официальное издание NWO · Практические исследования и аналитика переговоров
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="border-b border-gray-300 pb-8 mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 block mb-2">
            Свежие публикации
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-black tracking-tight mb-4">
            Журнал NWO
          </h1>
          <p className="text-lg text-gray-700 font-display max-w-2xl leading-relaxed">
            Разборы реальных звонков, анатомия отказов, психология богатых клиентов и тактики закрытия на высокие чеки. Без воды из устаревших учебников.
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <article key={post.slug} className="py-10 group first:pt-0">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-wrap items-center gap-3 mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <time className="text-black font-ui">
                    {new Date(post.date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock size={12} /> {post.readTime}
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-3 group-hover:underline decoration-2 underline-offset-4 leading-snug">
                  {post.title}
                </h2>

                <p className="text-gray-700 font-display leading-relaxed text-base mb-4 max-w-3xl">
                  {post.excerpt}
                </p>

                <div className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-1.5 pt-2">
                  <span>Читать расследование</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white py-12 text-center text-xs text-gray-500 font-ui">
        <div className="mx-auto max-w-[1200px] px-4">
          <span 
            className="text-2xl text-black block mb-2 select-none"
            style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
          >
            New Way Out
          </span>
          <p>© {new Date().getFullYear()} NWO Journal. Независимое издание о практике высоких чеков.</p>
        </div>
      </footer>
    </main>
  )
}
