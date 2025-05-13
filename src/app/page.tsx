"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Award, CalendarDays, Users, GlassWater, LogOut } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PurchasesTab } from "@/components/purchases-tab"
import { TopPurchasesTab } from "@/components/top-purchases-tab"
import { YearlyTopPurchasesTab } from "@/components/yearly-top-purchases-tab"
import { LoyalCustomersTab } from "@/components/loyal-customers-tab"
import { ProductsTab } from "@/components/products-tab"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ComprasPage() {
  const [activeTab, setActiveTab] = useState("compras")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está logado
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loginStatus)
      setIsLoading(false)

      if (!loginStatus) {
        router.push("/login")
      }
    }

    checkLoginStatus()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  // Mostrar nada enquanto verifica o login
  if (isLoading) {
    return null
  }

  // Se não estiver logado, não renderizar o conteúdo
  if (!isLoggedIn) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sistema de Vinhos</h1>
          <p className="text-muted-foreground">Painel de controle e análise</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Compras</CardTitle>
          <CardDescription>Visualize e gerencie as compras de vinhos realizadas pelos clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compras" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="compras" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Compras</span>
              </TabsTrigger>
              <TabsTrigger value="maiores-compras" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Maiores Compras</span>
              </TabsTrigger>
              <TabsTrigger value="compras-por-ano" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Compras por Ano</span>
              </TabsTrigger>
              <TabsTrigger value="clientes-fieis" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Clientes Fiéis</span>
              </TabsTrigger>
              <TabsTrigger value="produtos" className="flex items-center gap-2">
                <GlassWater className="h-4 w-4" />
                <span>Produtos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compras">
              <PurchasesTab />
            </TabsContent>

            <TabsContent value="maiores-compras">
              <TopPurchasesTab />
            </TabsContent>

            <TabsContent value="compras-por-ano">
              <YearlyTopPurchasesTab />
            </TabsContent>

            <TabsContent value="clientes-fieis">
              <LoyalCustomersTab />
            </TabsContent>

            <TabsContent value="produtos">
              <ProductsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
