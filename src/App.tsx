import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { Palette, User, CalendarDots, Star } from '@phosphor-icons/react'
import Dashboard from '@/components/Dashboard'
import ArtistsView from '@/components/ArtistsView'
import ArtworksView from '@/components/ArtworksView'
import ExhibitionsView from '@/components/ExhibitionsView'
import EvaluationsView from '@/components/EvaluationsView'
import type { Artist, Artwork, Exhibition, Evaluation } from '@/lib/types'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [artists] = useKV<Artist[]>('artists', [])
  const [artworks] = useKV<Artwork[]>('artworks', [])
  const [exhibitions] = useKV<Exhibition[]>('exhibitions', [])
  const [evaluations] = useKV<Evaluation[]>('evaluations', [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <h1 className="text-foreground">Galeria BethAzevedo</h1>
          <p className="text-muted-foreground text-sm mt-1">Art Exhibition Management System</p>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <CalendarDots className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="artists" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Artists</span>
            </TabsTrigger>
            <TabsTrigger value="artworks" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Artworks</span>
            </TabsTrigger>
            <TabsTrigger value="exhibitions" className="gap-2">
              <CalendarDots className="h-4 w-4" />
              <span className="hidden sm:inline">Exhibitions</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Evaluations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              artistCount={artists?.length || 0}
              artworkCount={artworks?.length || 0}
              exhibitionCount={exhibitions?.filter(e => e.status === 'active').length || 0}
              evaluationCount={evaluations?.length || 0}
              recentArtworks={artworks?.slice(-3).reverse() || []}
              activeExhibitions={exhibitions?.filter(e => e.status === 'active') || []}
            />
          </TabsContent>

          <TabsContent value="artists">
            <ArtistsView />
          </TabsContent>

          <TabsContent value="artworks">
            <ArtworksView />
          </TabsContent>

          <TabsContent value="exhibitions">
            <ExhibitionsView />
          </TabsContent>

          <TabsContent value="evaluations">
            <EvaluationsView />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default App
