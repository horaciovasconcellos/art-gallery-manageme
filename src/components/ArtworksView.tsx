import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash, Palette } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Artist, Artwork } from '@/lib/types'

const CATEGORIES = ['painting', 'sculpture', 'photography', 'installation', 'digital'] as const
const STATUSES = ['available', 'in-exhibition', 'on-loan', 'sold'] as const

export default function ArtworksView() {
  const [artworks, setArtworks] = useKV<Artwork[]>('artworks', [])
  const [artists] = useKV<Artist[]>('artists', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    year: new Date().getFullYear(),
    category: 'painting' as typeof CATEGORIES[number],
    technique: '',
    description: '',
    height: 0,
    width: 0,
    depth: 0,
    status: 'available' as typeof STATUSES[number],
    imageUrl: ''
  })

  const resetForm = () => {
    setFormData({
      title: '',
      artistId: '',
      year: new Date().getFullYear(),
      category: 'painting',
      technique: '',
      description: '',
      height: 0,
      width: 0,
      depth: 0,
      status: 'available',
      imageUrl: ''
    })
    setEditingArtwork(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.artistId) {
      toast.error('Please select an artist')
      return
    }
    
    if (editingArtwork) {
      setArtworks((current = []) => current.map(a => 
        a.id === editingArtwork.id 
          ? {
              ...editingArtwork,
              ...formData,
              dimensions: {
                height: formData.height,
                width: formData.width,
                depth: formData.depth || undefined
              }
            }
          : a
      ))
      toast.success('Artwork updated successfully')
    } else {
      const newArtwork: Artwork = {
        id: Date.now().toString(),
        title: formData.title,
        artistId: formData.artistId,
        year: formData.year,
        category: formData.category,
        technique: formData.technique,
        description: formData.description,
        dimensions: {
          height: formData.height,
          width: formData.width,
          depth: formData.depth || undefined
        },
        status: formData.status,
        imageUrl: formData.imageUrl || undefined,
        createdAt: new Date().toISOString()
      }
      setArtworks((current = []) => [...current, newArtwork])
      toast.success('Artwork added successfully')
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork)
    setFormData({
      title: artwork.title,
      artistId: artwork.artistId,
      year: artwork.year,
      category: artwork.category,
      technique: artwork.technique,
      description: artwork.description,
      height: artwork.dimensions.height,
      width: artwork.dimensions.width,
      depth: artwork.dimensions.depth || 0,
      status: artwork.status,
      imageUrl: artwork.imageUrl || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (artworkId: string) => {
    setArtworks((current = []) => current.filter(a => a.id !== artworkId))
    toast.success('Artwork deleted successfully')
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const getArtistName = (artistId: string) => {
    const artist = (artists || []).find(a => a.id === artistId)
    return artist?.name || 'Unknown Artist'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'in-exhibition':
        return 'bg-blue-100 text-blue-800'
      case 'on-loan':
        return 'bg-yellow-100 text-yellow-800'
      case 'sold':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Artworks</h2>
          <p className="text-muted-foreground">Manage your art collection and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={(artists || []).length === 0}>
              <Plus className="h-4 w-4" />
              Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist">Artist *</Label>
                  <Select value={formData.artistId} onValueChange={(value) => setFormData({ ...formData, artistId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent>
                      {(artists || []).map(artist => (
                        <SelectItem key={artist.id} value={artist.id}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value: typeof CATEGORIES[number]) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: typeof STATUSES[number]) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technique">Technique / Medium</Label>
                <Input
                  id="technique"
                  value={formData.technique}
                  onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                  placeholder="e.g., Oil on canvas, Bronze sculpture"
                />
              </div>

              <div className="space-y-2">
                <Label>Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-sm">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth" className="text-sm">Depth</Label>
                    <Input
                      id="depth"
                      type="number"
                      step="0.1"
                      value={formData.depth}
                      onChange={(e) => setFormData({ ...formData, depth: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/artwork-image.jpg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingArtwork ? 'Update' : 'Add'} Artwork
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(artists || []).length === 0 ? (
        <Card className="p-12 text-center">
          <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">Add artists first</h3>
          <p className="text-muted-foreground">You need to add at least one artist before registering artworks</p>
        </Card>
      ) : (artworks || []).length === 0 ? (
        <Card className="p-12 text-center">
          <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">No artworks yet</h3>
          <p className="text-muted-foreground mb-6">Start building your collection by adding artworks</p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Artwork
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(artworks || []).map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-square bg-muted relative overflow-hidden">
                {artwork.imageUrl ? (
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Palette className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{artwork.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{getArtistName(artwork.artistId)}</p>
                  </div>
                  <Badge className={getStatusColor(artwork.status)} variant="secondary">
                    {artwork.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{artwork.year} • {artwork.category.charAt(0).toUpperCase() + artwork.category.slice(1)}</p>
                  {artwork.technique && <p>{artwork.technique}</p>}
                  <p>
                    {artwork.dimensions.height} × {artwork.dimensions.width}
                    {artwork.dimensions.depth ? ` × ${artwork.dimensions.depth}` : ''} cm
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(artwork)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDelete(artwork.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
