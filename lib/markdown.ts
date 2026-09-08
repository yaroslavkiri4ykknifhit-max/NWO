import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogDirectory = path.join(process.cwd(), 'content/blog')

export type BlogPostMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  readTime: string
}

export type BlogPost = {
  meta: BlogPostMeta
  content: string
}

export function getPostSlugs() {
  if (!fs.existsSync(blogDirectory)) return []
  return fs.readdirSync(blogDirectory)
}

export function getPostBySlug(slug: string): BlogPost {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = path.join(blogDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    meta: {
      slug: realSlug,
      title: data.title || 'Untitled',
      date: data.date || '',
      excerpt: data.excerpt || '',
      author: data.author || 'Ярослав Киричук',
      readTime: data.readTime || '5 мин',
    },
    content,
  }
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .filter(slug => slug.endsWith('.md'))
    .map((slug) => getPostBySlug(slug).meta)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
