/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
// Если сборка идет на GitHub Actions, автоматически получаем имя репозитория для basePath
const repoName = isGithubActions && process.env.GITHUB_REPOSITORY 
  ? process.env.GITHUB_REPOSITORY.split('/')[1] 
  : '';

const nextConfig = {
  output: 'export', // Обязательно для статического экспорта на GitHub Pages
  basePath: repoName ? `/${repoName}` : undefined, // Авто-настройка путей для github.io/repo-name
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // GitHub Pages не поддерживает серверную оптимизацию изображений
  },
}

export default nextConfig
