export interface NavigationItem {
  name: string
  href: string
}

export interface Category {
  name: string
  featured: NavigationItem[]
  collection: NavigationItem[]
  categories: NavigationItem[]
  brands: NavigationItem[]
}

export interface Navigation {
  categories: Category[]
  pages: NavigationItem[]
}

export interface Offer {
  name: string
  description: string
  href: string
}

export interface AvailableColor {
  name: string
  colorBg: string
}

export interface Product {
  id: number
  name: string
  color: string
  price: string
  href: string
  imageSrc: string
  imageAlt: string
  availableColors: AvailableColor[]
}

export interface Collection {
  name: string
  description: string
  imageSrc: string
  imageAlt: string
  href: string
}

export interface Testimonial {
  id: number
  quote: string
  attribution: string
}

export interface FooterNavigation {
  products: NavigationItem[]
  customerService: NavigationItem[]
  company: NavigationItem[]
  legal: NavigationItem[]
  bottomLinks: NavigationItem[]
}

