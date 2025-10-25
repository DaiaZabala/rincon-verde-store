"use client"

import * as AlertDialog from '@radix-ui/react-alert-dialog'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function DeleteProductButton({ id }: { id: number }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'No se pudo eliminar')
      }
      toast({ title: 'Producto eliminado', description: 'El producto se marcó como inactivo' })
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting:', err)
      toast({ title: 'Error al eliminar', description: err?.message || 'Intenta nuevamente' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="outline" size="sm" className="flex-1 text-destructive">
          <Trash2 className="h-3 w-3" />
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-96">
          <AlertDialog.Title className="text-lg font-bold">Confirmar eliminación</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground mt-2">¿Estás seguro que deseas marcar este producto como inactivo? Esta acción puede revertirse editando el producto.</AlertDialog.Description>

          <div className="mt-4 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="destructive" onClick={handleConfirm} disabled={loading}>{loading ? 'Eliminando...' : 'Confirmar'}</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
