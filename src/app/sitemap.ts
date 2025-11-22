
import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/booking-constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
