import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

const ROUTES = ['', '/product', '/how-it-works', '/security', '/company', '/book', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: SITE.url + r,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: r === '' ? 1 : r === '/book' ? 0.9 : r === '/privacy' || r === '/terms' ? 0.2 : 0.7,
  }));
}
