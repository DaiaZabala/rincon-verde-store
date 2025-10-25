"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function RestoreProductButton({ id }: { id: number }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const handleRestore = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'PATCH' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'No se pudo restaurar')
      }
      toast({ title: 'Producto restaurado', description: 'El producto ahora está activo' })
      router.refresh()
    } catch (err: any) {
      console.error('Error restoring:', err)
      toast({ title: 'Error', description: err?.message || 'Intenta nuevamente', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleRestore} className="flex-1" disabled={loading}>
      <RotateCcw className="h-3 w-3 mr-1" /> Restaurar
    </Button>
  )
}
