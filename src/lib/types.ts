export interface Artist {
  id: string
  name: string
  nationality: string
  biography: string
  style: string
  imageUrl?: string
  createdAt: string
}

export interface Artwork {
  id: string
  title: string
  artistId: string
  year: number
  category: 'painting' | 'sculpture' | 'photography' | 'installation' | 'digital'
  technique: string
  description: string
  dimensions: {
    height: number
    width: number
    depth?: number
  }
  status: 'available' | 'in-exhibition' | 'on-loan' | 'sold'
  imageUrl?: string
  createdAt: string
}

export interface Exhibition {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  description: string
  artworkIds: string[]
  status: 'planned' | 'active' | 'completed'
  createdAt: string
}

export interface Evaluation {
  id: string
  exhibitionId: string
  artworkId: string
  rating: number
  notes?: string
  createdAt: string
}

export interface RankingEntry {
  artwork: Artwork
  artist: Artist
  averageRating: number
  evaluationCount: number
}
