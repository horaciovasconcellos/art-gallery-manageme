import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Star, ChartBar, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Artist, Artwork, Exhibition, Evaluation, RankingEntry } from '@/lib/types'

export default function EvaluationsView() {
  const [evaluations, setEvaluations] = useKV<Evaluation[]>('evaluations', [])
  const [exhibitions] = useKV<Exhibition[]>('exhibitions', [])
  const [artworks] = useKV<Artwork[]>('artworks', [])
  const [artists] = useKV<Artist[]>('artists', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedExhibition, setSelectedExhibition] = useState('')
  const [formData, setFormData] = useState({
    exhibitionId: '',
    artworkId: '',
    rating: 5,
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      exhibitionId: '',
      artworkId: '',
      rating: 5,
      notes: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.exhibitionId || !formData.artworkId) {
      toast.error('Please select exhibition and artwork')
      return
    }

    if (formData.rating < 1 || formData.rating > 10) {
      toast.error('Rating must be between 1 and 10')
      return
    }

    const existingEval = (evaluations || []).find(
      e => e.exhibitionId === formData.exhibitionId && e.artworkId === formData.artworkId
    )

    if (existingEval) {
      setEvaluations((current = []) => current.map(e =>
        e.id === existingEval.id
          ? { ...e, rating: formData.rating, notes: formData.notes }
          : e
      ))
      toast.success('Evaluation updated successfully')
    } else {
      const newEvaluation: Evaluation = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setEvaluations((current = []) => [...current, newEvaluation])
      toast.success('Evaluation added successfully')
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (evaluationId: string) => {
    setEvaluations((current = []) => current.filter(e => e.id !== evaluationId))
    toast.success('Evaluation deleted successfully')
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const getExhibitionName = (exhibitionId: string) => {
    const exhibition = (exhibitions || []).find(e => e.id === exhibitionId)
    return exhibition?.name || 'Unknown Exhibition'
  }

  const getArtworkTitle = (artworkId: string) => {
    const artwork = (artworks || []).find(a => a.id === artworkId)
    return artwork?.title || 'Unknown Artwork'
  }

  const getArtistName = (artistId: string) => {
    const artist = (artists || []).find(a => a.id === artistId)
    return artist?.name || 'Unknown Artist'
  }

  const availableArtworks = useMemo(() => {
    if (!formData.exhibitionId) return []
    const exhibition = (exhibitions || []).find(e => e.id === formData.exhibitionId)
    if (!exhibition) return []
    return (artworks || []).filter(a => exhibition.artworkIds.includes(a.id))
  }, [formData.exhibitionId, exhibitions, artworks])

  const rankings = useMemo(() => {
    const filterExhibitionId = selectedExhibition
    const filteredEvals = filterExhibitionId
      ? (evaluations || []).filter(e => e.exhibitionId === filterExhibitionId)
      : (evaluations || [])

    const artworkRatings = new Map<string, { ratings: number[], artwork: Artwork, artist: Artist }>()

    filteredEvals.forEach(evaluation => {
      const artwork = (artworks || []).find(a => a.id === evaluation.artworkId)
      const artist = artwork ? (artists || []).find(a => a.id === artwork.artistId) : undefined
      
      if (artwork && artist) {
        if (!artworkRatings.has(artwork.id)) {
          artworkRatings.set(artwork.id, { ratings: [], artwork, artist })
        }
        artworkRatings.get(artwork.id)!.ratings.push(evaluation.rating)
      }
    })

    const rankingEntries: RankingEntry[] = Array.from(artworkRatings.values()).map(
      ({ ratings, artwork, artist }) => ({
        artwork,
        artist,
        averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
        evaluationCount: ratings.length
      })
    )

    return rankingEntries.sort((a, b) => b.averageRating - a.averageRating)
  }, [evaluations, artworks, artists, selectedExhibition])

  const exhibitionEvaluations = useMemo(() => {
    return (evaluations || []).map(evaluation => {
      const artwork = (artworks || []).find(a => a.id === evaluation.artworkId)
      const artist = artwork ? (artists || []).find(a => a.id === artwork.artistId) : undefined
      return {
        ...evaluation,
        artworkTitle: artwork?.title || 'Unknown',
        artistName: artist?.name || 'Unknown',
        exhibitionName: getExhibitionName(evaluation.exhibitionId)
      }
    })
  }, [evaluations, artworks, artists])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Evaluations & Rankings</h2>
          <p className="text-muted-foreground">Rate artworks and view performance rankings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={(exhibitions || []).length === 0}>
              <Plus className="h-4 w-4" />
              Add Evaluation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Artwork Evaluation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exhibition">Exhibition *</Label>
                <Select 
                  value={formData.exhibitionId} 
                  onValueChange={(value) => setFormData({ ...formData, exhibitionId: value, artworkId: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exhibition" />
                  </SelectTrigger>
                  <SelectContent>
                    {(exhibitions || []).map(exhibition => (
                      <SelectItem key={exhibition.id} value={exhibition.id}>
                        {exhibition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="artwork">Artwork *</Label>
                <Select 
                  value={formData.artworkId} 
                  onValueChange={(value) => setFormData({ ...formData, artworkId: value })}
                  disabled={!formData.exhibitionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select artwork" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableArtworks.map(artwork => (
                      <SelectItem key={artwork.id} value={artwork.id}>
                        {artwork.title} - {getArtistName(artwork.artistId)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-10) *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-24"
                    required
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <Star
                        key={num}
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          num <= Math.round(formData.rating)
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground'
                        }`}
                        onClick={() => setFormData({ ...formData, rating: num })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any observations or comments..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Evaluation
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(exhibitions || []).length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">Create exhibitions first</h3>
          <p className="text-muted-foreground">You need exhibitions with artworks before evaluating</p>
        </Card>
      ) : (evaluations || []).length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">No evaluations yet</h3>
          <p className="text-muted-foreground mb-6">Start evaluating artworks to generate rankings</p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Evaluation
          </Button>
        </Card>
      ) : (
        <Tabs defaultValue="rankings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rankings" className="gap-2">
              <ChartBar className="h-4 w-4" />
              Rankings
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="gap-2">
              <Star className="h-4 w-4" />
              All Evaluations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rankings" className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="filter-exhibition">Filter by Exhibition:</Label>
              <Select value={selectedExhibition} onValueChange={setSelectedExhibition}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All exhibitions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All exhibitions</SelectItem>
                  {(exhibitions || []).map(exhibition => (
                    <SelectItem key={exhibition.id} value={exhibition.id}>
                      {exhibition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {rankings.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No rankings available for this filter</p>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Artwork Rankings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Showing {rankings.length} artwork{rankings.length !== 1 ? 's' : ''} sorted by average rating
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Artwork</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead className="text-right">Avg. Rating</TableHead>
                        <TableHead className="text-right">Evaluations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rankings.map((entry, index) => (
                        <TableRow key={entry.artwork.id}>
                          <TableCell className="font-bold text-lg">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {entry.artwork.imageUrl && (
                                <img
                                  src={entry.artwork.imageUrl}
                                  alt={entry.artwork.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{entry.artwork.title}</p>
                                <p className="text-sm text-muted-foreground">{entry.artwork.year}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{entry.artist.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-bold text-lg">
                                {entry.averageRating.toFixed(1)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {entry.evaluationCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="evaluations">
            <Card>
              <CardHeader>
                <CardTitle>All Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exhibition</TableHead>
                      <TableHead>Artwork</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exhibitionEvaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell className="font-medium">{evaluation.exhibitionName}</TableCell>
                        <TableCell>{evaluation.artworkTitle}</TableCell>
                        <TableCell>{evaluation.artistName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-medium">{evaluation.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                          {evaluation.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(evaluation.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
