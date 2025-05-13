"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Trophy, User, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusIndicator } from "@/components/status-indicator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface LoyalCustomer {
  customerName: string
  customerCpf: string
  totalSpent: number
}

export function LoyalCustomersTab() {
  const [customers, setCustomers] = useState<LoyalCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "error">("online")

  const fetchLoyalCustomers = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/clientes-fieis`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`)
      }

      const data: LoyalCustomer[] = await response.json()
      setCustomers(data)
      setApiStatus("online")
    } catch (err) {
      console.error("Erro ao buscar clientes fiéis:", err)
      setError("Não foi possível carregar os dados. Usando dados de exemplo.")
      setApiStatus("offline")

      // Mesmo com erro, não deixamos a lista vazia
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoyalCustomers()
  }, [])

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  // Função para obter a cor do avatar baseada no nome
  const getAvatarColor = (name: string, index: number) => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
    ]

    // Para os 3 primeiros, usamos cores especiais
    if (index === 0) return "bg-amber-100 text-amber-800"
    if (index === 1) return "bg-slate-100 text-slate-800"
    if (index === 2) return "bg-amber-50 text-amber-900"

    // Para os demais, usamos uma cor baseada no nome
    const charCode = name.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  // Calcular o valor máximo para a barra de progresso
  const maxSpent = customers.length > 0 ? customers[0].totalSpent : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <StatusIndicator status={apiStatus} message={error || undefined} />

        <Button variant="outline" size="sm" onClick={fetchLoyalCustomers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {customers.length > 0 && error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mt-2">
          Exibindo dados de exemplo. A API original não está disponível.
        </div>
      )}

      {/* Top 3 Clientes - Destaque */}
      {!loading && customers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {customers.slice(0, 3).map((customer, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarFallback className={getAvatarColor(customer.customerName, index)}>
                        {getInitials(customer.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-full">
                        <Trophy className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{customer.customerName}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{formatCPF(customer.customerCpf)}</p>
                  <div className="bg-primary/10 text-primary font-bold rounded-full px-4 py-1 text-sm mb-2">
                    {index === 0 ? "Cliente Diamante" : index === 1 ? "Cliente Platina" : "Cliente Ouro"}
                  </div>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-xs text-muted-foreground">Total gasto</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lista de Clientes */}
      <div className="rounded-md border bg-card">
        <div className="p-4 font-medium flex items-center gap-2 border-b">
          <User className="h-4 w-4" />
          <span>Todos os Clientes Fiéis</span>
        </div>
        <div className="divide-y">
          {loading ? (
            // Skeleton para carregamento
            Array(7)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-4 flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[200px] mb-2" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))
          ) : customers.length > 0 ? (
            customers.map((customer, index) => (
              <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={getAvatarColor(customer.customerName, index)}>
                      {getInitials(customer.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{customer.customerName}</p>
                    <p className="text-sm text-muted-foreground">{formatCPF(customer.customerCpf)}</p>
                  </div>
                </div>
                <div className="flex-1 mt-2 sm:mt-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1 text-sm">
                      <ShoppingBag className="h-3 w-3" />
                      <span>Total gasto</span>
                    </div>
                    <span className="font-bold">{formatCurrency(customer.totalSpent)}</span>
                  </div>
                  <Progress value={(customer.totalSpent / maxSpent) * 100} className="h-2" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">Nenhum cliente fiel encontrado.</div>
          )}
        </div>
      </div>
    </div>
  )
}
