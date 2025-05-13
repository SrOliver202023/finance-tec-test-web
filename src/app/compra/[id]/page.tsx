"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Product {
  codigo: number
  tipo_vinho: string
  preco: string
  safra: string
  ano_compra: number
}

interface Item {
  product: Product
  quantity: number
  subtotal: number
}

interface Purchase {
  customerName: string
  customerCpf: string
  items: Item[]
  totalValue: number
}

export default function CompraDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        // Em um caso real, você usaria:
        // const response = await fetch(`/api/compras/${id}`)

        // Simulando uma chamada de API com timeout
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dados de exemplo baseados na estrutura fornecida
        const mockPurchase: Purchase = {
          customerName: "Kaique Danilo Alves",
          customerCpf: "20634031392",
          items: [
            {
              product: {
                codigo: 8,
                tipo_vinho: "Rosé",
                preco: "120.99",
                safra: "2018",
                ano_compra: 2019,
              },
              quantity: 3,
              subtotal: 362.97,
            },
          ],
          totalValue: 362.97,
        }

        setPurchase(mockPurchase)
      } catch (err) {
        console.error("Erro ao buscar detalhes da compra:", err)
        setError("Não foi possível carregar os detalhes da compra. Usando dados de exemplo.")

        // Mesmo com erro, podemos mostrar dados de exemplo
        setPurchase({
          customerName: "Cliente Exemplo",
          customerCpf: "12345678901",
          items: [
            {
              product: {
                codigo: 1,
                tipo_vinho: "Exemplo",
                preco: "99.99",
                safra: "2020",
                ano_compra: 2021,
              },
              quantity: 1,
              subtotal: 99.99,
            },
          ],
          totalValue: 99.99,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseDetails()
  }, [id])

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[350px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[150px]" />
              </div>
              <Separator />
              <div>
                <Skeleton className="h-6 w-[180px] mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
          </CardContent>
        </Card>
      ) : purchase ? (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Compra #{id}</CardTitle>
            <CardDescription>Informações detalhadas sobre a compra realizada.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Informações do Cliente</h3>
                <p className="text-sm text-muted-foreground">Nome: {purchase.customerName}</p>
                <p className="text-sm text-muted-foreground">CPF: {formatCPF(purchase.customerCpf)}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Itens da Compra</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Safra</TableHead>
                      <TableHead>Preço Unit.</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchase.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.product.tipo_vinho}</TableCell>
                        <TableCell>{item.product.safra}</TableCell>
                        <TableCell>{formatCurrency(item.product.preco)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <div className="text-sm text-muted-foreground">
              Ano de compra dos produtos: {purchase.items[0]?.product.ano_compra}
            </div>
            <div className="text-xl font-semibold">Total: {formatCurrency(purchase.totalValue)}</div>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}
