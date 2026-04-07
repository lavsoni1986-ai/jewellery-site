import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://anshujewellers.com',
      lastModified: new Date(),
    },
    {
      url: 'https://anshujewellers.com/jewellery',
      lastModified: new Date(),
    },
  ]
}