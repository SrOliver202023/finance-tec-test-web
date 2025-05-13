"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Wine } from "lucide-react"

interface Recommendation {
  codigo: number
  tipo_vinho: string
  preco: string
  safra: string
  ano_compra: number
  motivo: string
}

interface RecommendationDialogProps {
  cpf: string
  customerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecommendationDialog({ cpf, customerName, open, onOpenChange }: RecommendationDialogProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number.parseFloat(value))
  }

  useEffect(() => {
    if (open) {
      fetchRecommendation()
    } else {
      // Reset state when dialog closes
      setRecommendation(null)
      setError(null)
    }
  }, [open])

  const fetchRecommendation = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/recomendacao/${cpf}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar recomendação: ${response.status}`)
      }

      const data = await response.json()
      setRecommendation(data)
    } catch (err) {
      console.error("Erro ao buscar recomendação:", err)
      setError("Não foi possível encontrar uma recomendação para este cliente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Recomendação de Vinho</DialogTitle>
          <DialogDescription>
            Recomendação personalizada para {customerName} ({formatCPF(cpf)})
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Buscando recomendação...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : recommendation ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Wine className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{recommendation.tipo_vinho}</h3>
                  <p className="text-sm text-muted-foreground">Safra {recommendation.safra}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-bold">{formatCurrency(recommendation.preco)}</div>
                  <div className="text-xs text-muted-foreground">Código: {recommendation.codigo}</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Por que recomendamos:</h4>
                <p className="text-sm text-muted-foreground">{recommendation.motivo}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fechar
                </Button>
                <Button>Adicionar ao Carrinho</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Nenhuma recomendação disponível</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
