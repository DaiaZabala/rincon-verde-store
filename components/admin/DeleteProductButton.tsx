"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id }: { id: number }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar')
      // refresh server components
      router.refresh()
    } catch (err) {
      console.error('Error deleting:', err)
      alert('Error al eliminar el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} className="flex-1 text-destructive" disabled={loading}>
      <Trash2 className="h-3 w-3" />
    </Button>
  )
}
