export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/api'],
      },
    ],
    sitemap: 'https://coffea.et/sitemap.xml',
  }
}
