import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Clock, User } from 'lucide-react'
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
      title: 'Статья не найдена',
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
    <main className="min-h-screen bg-white text-[#121212]">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} /> Назад в журнал
          </Link>
          <div className="font-display font-bold uppercase tracking-widest text-sm">NWO</div>
          <div className="w-32" />
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight mb-6">
            {post.meta.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-500 border-t border-b border-gray-100 py-4">
            <div className="flex items-center gap-2">
              <User size={14} /> {post.meta.author}
            </div>
            <span>•</span>
            <time>
              {new Date(post.meta.date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={14} /> {post.meta.readTime}
            </div>
          </div>
        </header>

        <div className="prose prose-lg prose-gray max-w-none font-ui leading-relaxed">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <footer className="border-t border-gray-200 bg-gray-50 py-12 text-center mt-12">
        <p className="text-gray-500 font-semibold mb-4">Готов начать зарабатывать на продажах?</p>
        <div className="flex justify-center gap-4">
          <Link href="/mentorship" className="px-6 py-3 bg-black text-white rounded-md font-bold hover:bg-gray-800 transition-colors">
            Пойти в менторство
          </Link>
          <Link href="/free" className="px-6 py-3 bg-white border border-gray-300 text-black rounded-md font-bold hover:bg-gray-50 transition-colors">
            Бесплатный курс
          </Link>
        </div>
      </footer>
    </main>
  )
}
