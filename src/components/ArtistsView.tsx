import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil, Trash, User } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Artist, Artwork } from '@/lib/types'

export default function ArtistsView() {
  const [artists, setArtists] = useKV<Artist[]>('artists', [])
  const [artworks] = useKV<Artwork[]>('artworks', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    biography: '',
    style: '',
    imageUrl: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      nationality: '',
      biography: '',
      style: '',
      imageUrl: ''
    })
    setEditingArtist(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingArtist) {
      setArtists((current = []) => current.map(a => 
        a.id === editingArtist.id 
          ? { ...editingArtist, ...formData }
          : a
      ))
      toast.success('Artist updated successfully')
    } else {
      const newArtist: Artist = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setArtists((current = []) => [...current, newArtist])
      toast.success('Artist added successfully')
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist)
    setFormData({
      name: artist.name,
      nationality: artist.nationality,
      biography: artist.biography,
      style: artist.style,
      imageUrl: artist.imageUrl || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (artistId: string) => {
    const artistArtworks = (artworks || []).filter(a => a.artistId === artistId)
    
    if (artistArtworks.length > 0) {
      toast.error(`Cannot delete artist with ${artistArtworks.length} associated artwork(s)`)
      return
    }
    
    setArtists((current = []) => current.filter(a => a.id !== artistId))
    toast.success('Artist deleted successfully')
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Artists</h2>
          <p className="text-muted-foreground">Manage artist profiles and biographies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Input
                    id="style"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    placeholder="e.g., Contemporary, Abstract"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography">Biography</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/artist-photo.jpg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingArtist ? 'Update' : 'Add'} Artist
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(artists || []).length === 0 ? (
        <Card className="p-12 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">No artists yet</h3>
          <p className="text-muted-foreground mb-6">Add your first artist to start building your gallery</p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Artist
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(artists || []).map((artist) => {
            const artistArtworkCount = (artworks || []).filter(a => a.artistId === artist.id).length
            
            return (
              <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {artist.imageUrl && (
                  <div className="aspect-square bg-muted">
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{artist.name}</CardTitle>
                  <div className="space-y-1">
                    {artist.nationality && (
                      <p className="text-sm text-muted-foreground">{artist.nationality}</p>
                    )}
                    {artist.style && (
                      <p className="text-sm text-muted-foreground">{artist.style}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {artist.biography && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {artist.biography}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {artistArtworkCount} artwork{artistArtworkCount !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(artist)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(artist.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
