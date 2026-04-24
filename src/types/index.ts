export interface ItineraryDay {
  day: number
  title: string
  description: string
  meals?: string
  accommodation?: string
}

export interface Package {
  id: string
  slug: string
  title: string
  subtitle: string
  destination: string
  duration: string
  durationDays: number
  price: number
  originalPrice?: number
  currency: string
  category: string
  tags: string[]
  heroImage: string
  gallery: string[]
  overview: string
  highlights: string[]
  included: string[]
  excluded: string[]
  itinerary: ItineraryDay[]
  instagramVideos: string[]
  featured: boolean
  popular: boolean
  rating: number
  reviewCount: number
  bookingFormUrl?: string
}

export interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  text: string
  package: string
  date: string
}

export interface SiteConfig {
  siteName: string
  tagline: string
  whatsapp: string
  phone: string
  email: string
  address: string
  socialMedia: {
    instagram: string
    facebook: string
  }
}
