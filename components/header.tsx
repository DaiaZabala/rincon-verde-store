"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Menu, Search, ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useCart, CartItem } from "@/components/context/CartContext";
import Link from "next/link" 
import { useRouter, useSearchParams } from "next/navigation";

// --- CartSheet conectado al Contexto (Modificado para navegar a /checkout) ---
const CartSheet = () => {
    const {
        cart: cartItems,
        updateCartItemQuantity,
        removeFromCart,
    } = useCart();
    const [open, setOpen] = useState(false);

    // Eliminamos el useEffect que cargaba el carrito, ya que ahora se maneja en el CartContext
    
    // Lógica de búsqueda (se mantiene)
    const [searchTerm, setSearchTerm] = useState("");   
    const [suggestions, setSuggestions] = useState<{ id: number; name: string }[]>([]); 
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const handleSearch = (e?: React.FormEvent) => { 
        if (e) e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        router.push(`/productos?${params.toString()}`);
    };

    useEffect(() => { 
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(`/api/suggestions?q=${searchTerm}`);
                const data = await res.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Error buscando sugerencias:", error);
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);
    // Fin Lógica de búsqueda

    const increaseQuantity = (item: CartItem) => {
        updateCartItemQuantity(item.id, item.quantity + 1);
    };

    const decreaseQuantity = (item: CartItem) => {
        if (item.quantity > 1) {
            updateCartItemQuantity(item.id, item.quantity - 1);
        } else {
            removeFromCart(item.id);
        }
    };

    const removeItemFromContext = (id: number) => {
        removeFromCart(id);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const cartTotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * (item.product?.price || 0),
        0
    );

    const handleBackToStore = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <span className="h-full w-full flex items-center justify-center">
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center -mt-1 -mr-1">
                                {cartCount}
                            </span>
                        )}
                        <ShoppingCart className="h-5 w-5" />
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-primary">
                        Tu Carrito de Compras
                    </SheetTitle>
                    <SheetDescription>
                        Tienes {cartCount} artículo{cartCount !== 1 && "s"} en tu carrito.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">Tu carrito está vacío 😔</p>
                            <Button
                                variant="outline"
                                className="border-green-500 text-green-600 hover:bg-green-50"
                                onClick={handleBackToStore}
                            >
                                Volver a la Tienda
                            </Button>
                        </div>
                    ) : (
                        cartItems.map((item: CartItem) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-2">
                                <div className="flex-1">
                                    <p className="font-semibold">{item.product?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        ${(item.product?.price || 0).toFixed(2)} x {item.quantity}
                                    </p>

                                    <div className="flex items-center space-x-2 mt-1">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            disabled={item.quantity <= 1}
                                            onClick={() => decreaseQuantity(item)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => increaseQuantity(item)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItemFromContext(item.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="pt-4 border-t space-y-3">
                        <p className="font-semibold text-right">
                            Total: ${cartTotal.toFixed(2)}
                        </p>
                        
                        {/* ✅ Nuevo: Botón que cierra el Sheet y navega a la página /checkout */}
                        <SheetClose asChild>
                            <Link href="/checkout" passHref>
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    Proceder al Pago
                                </Button>
                            </Link>
                        </SheetClose>
                        
                        {/* Botón de seguir comprando */}
                        <SheetClose asChild>
                            <Link
                                href="/productos"
                                className="block text-center text-sm text-blue-600 hover:underline"
                            >
                                Seguir comprando
                            </Link>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

// --- Helper NavLink (sin cambios) ---
const NavLink = ({
    href,
    children,
    className = "",
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <a
        href={href}
        className={`text-foreground hover:text-primary transition-colors ${className}`}
    >
        {children}
    </a>
);

// --- Header completo (sin cambios) ---
export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<{ id: number; name: string }[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        router.push(`/productos?${params.toString()}`);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(`/api/suggestions?q=${searchTerm}`);
                const data = await res.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Error buscando sugerencias:", error);
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <NavLink href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">RV</span>
                        </div>
                        <span className="font-bold text-xl text-primary">Rincón Verde</span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <NavLink href="/">Inicio</NavLink>
                        <NavLink href="/productos">Productos</NavLink>
                        <NavLink href="/categorias">Categorías</NavLink>
                        <NavLink href="/nosotros">Nosotros</NavLink>
                        <NavLink href="/contacto">Contacto</NavLink>
                        <NavLink href="/blog">Blog</NavLink>
                    </nav>

                    {/* 🔍 Buscador Desktop */}
                    <div className="hidden md:flex gap-2 items-center relative">
                        <Input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        <Button onClick={handleSearch}>Buscar</Button>

                        {suggestions.length > 0 && (
                            <ul className="absolute top-full mt-1 w-64 bg-white border rounded shadow z-50">
                                {suggestions.map((item) => (
                                    <li
                                        key={item.id}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSearchTerm(item.name);
                                            setSuggestions([]);
                                            handleSearch();
                                        }}
                                    >
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        <CartSheet />

                        <NavLink href="/admin/login">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </NavLink>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <div className="flex flex-col space-y-4 mt-6">
                                    <form onSubmit={handleSearch} className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Buscar productos..."
                                            className="pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </form>

                                    <nav className="flex flex-col space-y-2">
                                        <NavLink href="/" className="py-2">Inicio</NavLink>
                                        <NavLink href="/productos" className="py-2">Productos</NavLink>
                                        <NavLink href="/categorias" className="py-2">Categorías</NavLink>
                                        <NavLink href="/nosotros" className="py-2">Nosotros</NavLink>
                                        <NavLink href="/contacto" className="py-2">Contacto</NavLink>
                                        <NavLink href="/blog" className="py-2">Blog</NavLink>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}