import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash, CalendarDots } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Artist, Artwork, Exhibition } from '@/lib/types'

export default function ExhibitionsView() {
  const [exhibitions, setExhibitions] = useKV<Exhibition[]>('exhibitions', [])
  const [artworks] = useKV<Artwork[]>('artworks', [])
  const [artists] = useKV<Artist[]>('artists', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    artworkIds: [] as string[]
  })

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      artworkIds: []
    })
    setEditingExhibition(null)
  }

  const getExhibitionStatus = (startDate: string, endDate: string): Exhibition['status'] => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (now < start) return 'planned'
    if (now > end) return 'completed'
    return 'active'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('End date must be after start date')
      return
    }
    
    if (formData.artworkIds.length === 0) {
      toast.error('Please select at least one artwork')
      return
    }
    
    const status = getExhibitionStatus(formData.startDate, formData.endDate)
    
    if (editingExhibition) {
      setExhibitions((current = []) => current.map(e => 
        e.id === editingExhibition.id 
          ? { ...formData, id: editingExhibition.id, status, createdAt: editingExhibition.createdAt }
          : e
      ))
      toast.success('Exhibition updated successfully')
    } else {
      const newExhibition: Exhibition = {
        id: Date.now().toString(),
        ...formData,
        status,
        createdAt: new Date().toISOString()
      }
      setExhibitions((current = []) => [...current, newExhibition])
      toast.success('Exhibition created successfully')
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (exhibition: Exhibition) => {
    setEditingExhibition(exhibition)
    setFormData({
      name: exhibition.name,
      location: exhibition.location,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      description: exhibition.description,
      artworkIds: exhibition.artworkIds
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (exhibitionId: string) => {
    setExhibitions((current = []) => current.filter(e => e.id !== exhibitionId))
    toast.success('Exhibition deleted successfully')
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const toggleArtwork = (artworkId: string) => {
    setFormData(prev => ({
      ...prev,
      artworkIds: prev.artworkIds.includes(artworkId)
        ? prev.artworkIds.filter(id => id !== artworkId)
        : [...prev.artworkIds, artworkId]
    }))
  }

  const getArtistName = (artistId: string) => {
    const artist = (artists || []).find(a => a.id === artistId)
    return artist?.name || 'Unknown Artist'
  }

  const getStatusColor = (status: Exhibition['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Exhibitions</h2>
          <p className="text-muted-foreground">Plan and manage your art exhibitions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={(artworks || []).length === 0}>
              <Plus className="h-4 w-4" />
              Create Exhibition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExhibition ? 'Edit Exhibition' : 'Create New Exhibition'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exhibition Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
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

              <div className="space-y-3">
                <Label>Select Artworks *</Label>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                  {(artworks || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No artworks available. Add artworks first.
                    </p>
                  ) : (
                    (artworks || []).map(artwork => (
                      <div key={artwork.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`artwork-${artwork.id}`}
                          checked={formData.artworkIds.includes(artwork.id)}
                          onCheckedChange={() => toggleArtwork(artwork.id)}
                        />
                        <label
                          htmlFor={`artwork-${artwork.id}`}
                          className="flex-1 flex items-center gap-3 cursor-pointer"
                        >
                          {artwork.imageUrl && (
                            <img
                              src={artwork.imageUrl}
                              alt={artwork.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{artwork.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {getArtistName(artwork.artistId)} • {artwork.year}
                            </p>
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.artworkIds.length} artwork{formData.artworkIds.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExhibition ? 'Update' : 'Create'} Exhibition
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(artworks || []).length === 0 ? (
        <Card className="p-12 text-center">
          <CalendarDots className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">Add artworks first</h3>
          <p className="text-muted-foreground">You need artworks before creating exhibitions</p>
        </Card>
      ) : (exhibitions || []).length === 0 ? (
        <Card className="p-12 text-center">
          <CalendarDots className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2">No exhibitions yet</h3>
          <p className="text-muted-foreground mb-6">Create your first exhibition to showcase artworks</p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create First Exhibition
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {(exhibitions || []).map((exhibition) => {
            const exhibitionArtworks = (artworks || []).filter(a => 
              exhibition.artworkIds.includes(a.id)
            )
            const participatingArtists = new Set(
              exhibitionArtworks.map(a => getArtistName(a.artistId))
            )

            return (
              <Card key={exhibition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{exhibition.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                        <span>{exhibition.location}</span>
                        <span>•</span>
                        <span>
                          {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(exhibition.status)} variant="secondary">
                      {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exhibition.description && (
                    <p className="text-sm text-muted-foreground">{exhibition.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {exhibitionArtworks.length} Artwork{exhibitionArtworks.length !== 1 ? 's' : ''} • {participatingArtists.size} Artist{participatingArtists.size !== 1 ? 's' : ''}
                    </p>
                    
                    {exhibitionArtworks.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {exhibitionArtworks.slice(0, 6).map(artwork => (
                          <div key={artwork.id} className="aspect-square rounded overflow-hidden bg-muted">
                            {artwork.imageUrl ? (
                              <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-muted-foreground text-center p-2">
                                  {artwork.title}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(exhibition)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(exhibition.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
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
