import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Palette, CalendarDots, Star } from '@phosphor-icons/react'
import type { Artwork, Exhibition } from '@/lib/types'

interface DashboardProps {
  artistCount: number
  artworkCount: number
  exhibitionCount: number
  evaluationCount: number
  recentArtworks: Artwork[]
  activeExhibitions: Exhibition[]
}

export default function Dashboard({
  artistCount,
  artworkCount,
  exhibitionCount,
  evaluationCount,
  recentArtworks,
  activeExhibitions
}: DashboardProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2">Overview</h2>
        <p className="text-muted-foreground">Gallery statistics and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Artists</CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{artistCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Artworks</CardTitle>
            <Palette className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{artworkCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Exhibitions</CardTitle>
            <CalendarDots className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{exhibitionCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Evaluations</CardTitle>
            <Star className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{evaluationCount}</div>
          </CardContent>
        </Card>
      </div>

      {activeExhibitions.length > 0 && (
        <div>
          <h3 className="text-foreground mb-4">Active Exhibitions</h3>
          <div className="grid gap-4">
            {activeExhibitions.map(exhibition => (
              <Card key={exhibition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{exhibition.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{exhibition.location}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">{exhibition.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recentArtworks.length > 0 && (
        <div>
          <h3 className="text-foreground mb-4">Recently Added Artworks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArtworks.map(artwork => (
              <Card key={artwork.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {artwork.imageUrl && (
                  <div className="aspect-square bg-muted">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-base">{artwork.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{artwork.year}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {artistCount === 0 && artworkCount === 0 && exhibitionCount === 0 && (
        <Card className="p-12 text-center">
          <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">Welcome to Galeria BethAzevedo</h3>
          <p className="text-muted-foreground">Start by adding artists and artworks to build your collection</p>
        </Card>
      )}
    </div>
  )
}
