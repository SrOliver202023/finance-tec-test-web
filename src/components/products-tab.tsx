"use client"

import { useState, useEffect, useMemo } from "react"
import { RefreshCw, Wine, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Product {
  codigo: number
  tipo_vinho: string
  preco: string
  safra: string
  ano_compra: number
}

// Cores para os diferentes tipos de vinho
const wineTypeColors: Record<string, string> = {
  Tinto: "bg-red-100 text-red-800 border-red-200",
  Branco: "bg-yellow-50 text-yellow-800 border-yellow-200",
  Rosé: "bg-pink-100 text-pink-800 border-pink-200",
  Espumante: "bg-blue-50 text-blue-800 border-blue-200",
  Chardonnay: "bg-amber-100 text-amber-800 border-amber-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
}

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "error">("online")

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"preco-asc" | "preco-desc" | "safra-asc" | "safra-desc">("preco-asc")

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/all-products`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`)
      }

      const data: Product[] = await response.json()
      setProducts(data)
      setApiStatus("online")
    } catch (err) {
      console.error("Erro ao buscar produtos:", err)
      setError("Não foi possível carregar os dados. Usando dados de exemplo.")
      setApiStatus("offline")

      // Mesmo com erro, não deixamos a lista vazia
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Extrair tipos de vinho únicos
  const wineTypes = useMemo(() => {
    const types = new Set<string>()
    products.forEach((product) => types.add(product.tipo_vinho))
    return Array.from(types).sort()
  }, [products])

  // Extrair anos de safra únicos
  const vintageYears = useMemo(() => {
    const years = new Set<string>()
    products.forEach((product) => years.add(product.safra))
    return Array.from(years).sort((a, b) => Number(b) - Number(a)) // Ordenar do mais recente para o mais antigo
  }, [products])

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filtro de pesquisa
        const matchesSearch =
          searchTerm === "" ||
          product.tipo_vinho.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.safra.includes(searchTerm) ||
          product.codigo.toString().includes(searchTerm)

        // Filtro de tipo de vinho
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.tipo_vinho)

        // Filtro de ano de safra
        const matchesYear = selectedYears.length === 0 || selectedYears.includes(product.safra)

        return matchesSearch && matchesType && matchesYear
      })
      .sort((a, b) => {
        // Ordenação
        switch (sortBy) {
          case "preco-asc":
            return Number.parseFloat(a.preco) - Number.parseFloat(b.preco)
          case "preco-desc":
            return Number.parseFloat(b.preco) - Number.parseFloat(a.preco)
          case "safra-asc":
            return Number.parseInt(a.safra) - Number.parseInt(b.safra)
          case "safra-desc":
            return Number.parseInt(b.safra) - Number.parseInt(a.safra)
          default:
            return 0
        }
      })
  }, [products, searchTerm, selectedTypes, selectedYears, sortBy])

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number.parseFloat(value))
  }

  const getWineTypeColor = (type: string) => {
    return wineTypeColors[type] || wineTypeColors.default
  }

  const handleTypeSelect = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleYearSelect = (year: string) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedYears([])
    setSortBy("preco-asc")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <StatusIndicator status={apiStatus} message={error || undefined} />

        <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {products.length > 0 && error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mt-2">
          Exibindo dados de exemplo. A API original não está disponível.
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por tipo, safra ou código..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Tipo de Vinho</span>
                {selectedTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {wineTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeSelect(type)}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Safra</span>
                {selectedYears.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedYears.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {vintageYears.map((year) => (
                <DropdownMenuCheckboxItem
                  key={year}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => handleYearSelect(year)}
                >
                  {year}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preco-asc">Preço: Menor para Maior</SelectItem>
              <SelectItem value="preco-desc">Preço: Maior para Menor</SelectItem>
              <SelectItem value="safra-asc">Safra: Mais Antiga</SelectItem>
              <SelectItem value="safra-desc">Safra: Mais Recente</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || selectedTypes.length > 0 || selectedYears.length > 0 || sortBy !== "preco-asc") && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Contagem de resultados */}
      <div className="text-sm text-muted-foreground">
        {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
      </div>

      {/* Grade de Produtos */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-24 mb-6" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.codigo} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={getWineTypeColor(product.tipo_vinho)}>
                      {product.tipo_vinho}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Cód. {product.codigo}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Wine className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.tipo_vinho}</h3>
                      <p className="text-sm text-muted-foreground">Safra {product.safra}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ano de compra</p>
                      <p className="font-medium">{product.ano_compra}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Preço</p>
                      <p className="text-lg font-bold">{formatCurrency(product.preco)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground border rounded-md">
          Nenhum produto encontrado com os filtros selecionados.
        </div>
      )}
    </div>
  )
}
