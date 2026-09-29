import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// Production is indexable. Vercel preview deployments, or any build with SITE_NOINDEX=1, are not.
export default function robots(): MetadataRoute.Robots {
  const preview = (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') || process.env.SITE_NOINDEX === '1';
  return preview
    ? { rules: { userAgent: '*', disallow: '/' } }
    : { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url };
}
