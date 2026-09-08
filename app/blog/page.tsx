import Link from 'next/link'
import { Metadata } from 'next'
import { getAllPosts } from '@/lib/markdown'
import { ArrowLeft, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Блог о продажах | NWO (НВО)',
  description: 'Статьи, кейсы и новости проекта NWO. Практические советы по B2B и B2C продажам.',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-white text-[#121212]">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} /> На главную
          </Link>
          <div className="font-display font-bold uppercase tracking-widest text-sm">NWO Journal</div>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 tracking-tight">Журнал NWO</h1>
        <p className="text-lg text-gray-600 mb-16 max-w-2xl">
          Практика, скрипты, разборы звонков и психология продаж. Читайте, чтобы продавать дороже и увереннее.
        </p>

        <div className="space-y-12 border-t border-gray-200 pt-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                  <time className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {new Date(post.date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
                    <Clock size={12} /> {post.readTime}
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 group-hover:underline decoration-2 underline-offset-4">
                  {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-4 max-w-3xl">
                  {post.excerpt}
                </p>
                <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  Читать статью <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
