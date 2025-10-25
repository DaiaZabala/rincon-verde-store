"use client"
// app/admin/products/create/page.tsx

// 🛑 CORRECCIÓN VERCEL: Cambiamos el alias (@/) por la ruta relativa (../../../../).
// Este archivo está a cuatro niveles de profundidad (app/admin/productos/crear) de la raíz.
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminNavbar } from "../../../../components/adminnavbar"
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"

export default function CreateProductPage() {
	const router = useRouter()
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [price, setPrice] = useState("")
	const [stock, setStock] = useState("")
	const [imageUrl, setImageUrl] = useState("")
	const [categoryId, setCategoryId] = useState("")
	const [categories, setCategories] = useState<Array<any>>([])
	const [catsLoading, setCatsLoading] = useState(false)

	useEffect(() => {
		let mounted = true
		setCatsLoading(true)
		fetch('/api/categories')
			.then((r) => r.json())
			.then((data) => {
				if (!mounted) return
				setCategories(data.categories || [])
			})
			.catch((e) => console.error('Error cargando categorías', e))
			.finally(() => mounted && setCatsLoading(false))
		return () => { mounted = false }
	}, [])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const body = {
				name,
				description,
				price: Number(price) || 0,
				stock_quantity: Number(stock) || 0,
				image_url: imageUrl || null,
				category_id: categoryId ? Number(categoryId) : null,
				is_active: true,
			}

			const res = await fetch("/api/admin/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			})

			if (!res.ok) {
				const b = await res.json().catch(() => ({}))
				throw new Error(b?.error || "Error creando producto")
			}

			router.push("/admin/products")
		} catch (err: any) {
			setError(err?.message || String(err))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen">
			<AdminNavbar />
			<main className="p-6 md:p-10">
				<h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>

				<Card>
					<CardHeader>
						<CardTitle>Formulario del Producto</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Nombre</label>
								<Input value={name} onChange={(e) => setName(e.target.value)} required />
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Descripción</label>
								<Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
							</div>

							<div className="grid grid-cols-3 gap-3">
								<div>
									<label className="block text-sm font-medium mb-1">Precio</label>
									<Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">Stock</label>
									<Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">Categoría (opcional)</label>
									<select aria-label="Categoría" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="block w-full rounded-md border px-2 py-1">
										<option value="">Sin categoría</option>
										{categories.map((c) => (
											<option key={c.id} value={c.id}>{c.name}</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">URL de Imagen (opcional)</label>
								<Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
							</div>

							{error && <p className="text-destructive text-sm">{error}</p>}

							<div className="flex items-center gap-2">
								<Button type="submit" disabled={loading}>
									{loading ? "Creando..." : "Crear Producto"}
								</Button>
								<Button variant="ghost" onClick={() => router.push('/admin/products')}>
									Cancelar
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
