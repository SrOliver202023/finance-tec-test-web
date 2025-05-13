"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusIndicator } from "@/components/status-indicator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Product {
  codigo: number;
  tipo_vinho: string;
  preco: string;
  safra: string;
  ano_compra: number;
}

interface TopPurchase {
  customerName: string;
  customerCpf: string;
  product: Product;
  quantity: number;
  totalValue: number;
}

interface ApiResponse {
  content: TopPurchase[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Interface para agrupar compras por ano
interface YearlyPurchases {
  year: number;
  purchases: TopPurchase[];
  totalValue: number;
}

export function YearlyTopPurchasesTab() {
  const [topPurchases, setTopPurchases] = useState<TopPurchase[]>([]);
  const [yearlyPurchases, setYearlyPurchases] = useState<YearlyPurchases[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20); // Aumentamos o tamanho para ter mais dados para agrupar
  const [direction, setDirection] = useState("DESC");
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "error">(
    "online"
  );

  const fetchTopPurchases = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/maiores-compras?page=${page}&size=${size}&direction=${direction}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const data = await response.json();
      setTopPurchases(data);
      setTotalPages(data.totalPages || 1);
      setApiStatus("online");
    } catch (err) {
      console.error("Erro ao buscar maiores compras por ano:", err);
      setError("Não foi possível carregar os dados. Usando dados de exemplo.");
      setApiStatus("offline");

      // Mesmo com erro, não deixamos a tabela vazia
      setTopPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar compras por ano
  useEffect(() => {
    if (topPurchases?.length > 0) {
      const purchasesByYear: Record<number, TopPurchase[]> = {};

      // Agrupar compras por ano
      topPurchases.forEach((purchase) => {
        const year = purchase.product.ano_compra;
        if (!purchasesByYear[year]) {
          purchasesByYear[year] = [];
        }
        purchasesByYear[year].push(purchase);
      });

      // Converter para array e calcular totais
      const yearlyData: YearlyPurchases[] = Object.entries(purchasesByYear).map(
        ([year, purchases]) => {
          const totalValue = purchases.reduce(
            (sum, purchase) => sum + purchase.totalValue,
            0
          );
          return {
            year: Number.parseInt(year),
            purchases,
            totalValue,
          };
        }
      );

      // Ordenar por ano (mais recente primeiro)
      yearlyData.sort((a, b) => b.year - a.year);

      setYearlyPurchases(yearlyData);
    } else {
      setYearlyPurchases([]);
    }
  }, [topPurchases]);

  useEffect(() => {
    fetchTopPurchases();
  }, [page, size, direction]);

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCurrency = (value: number | string) => {
    const numValue =
      typeof value === "string" ? Number.parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Itens por página:</span>
          <Select
            value={size.toString()}
            onValueChange={(value) => {
              setSize(Number.parseInt(value));
              setPage(1); // Reset to first page when changing page size
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="20" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Ordenação:</span>
          <Select
            value={direction}
            onValueChange={(value) => {
              setDirection(value);
              setPage(1); // Reset to first page when changing direction
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Decrescente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Decrescente</SelectItem>
              <SelectItem value="ASC">Crescente</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchTopPurchases}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <StatusIndicator status={apiStatus} message={error || undefined} />
      </div>

      {topPurchases?.length > 0 && error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mt-2">
          Exibindo dados de exemplo. A API original não está disponível.
        </div>
      )}

      {loading ? (
        // Skeleton para carregamento
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-7 w-[100px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : yearlyPurchases.length > 0 ? (
        <div className="space-y-6">
          {yearlyPurchases.map((yearData) => (
            <Card key={yearData.year}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Ano {yearData.year}</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-base font-semibold">
                    Total: {formatCurrency(yearData.totalValue)}
                  </Badge>
                </div>
                <CardDescription>
                  {yearData.purchases.length} maiores compras registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearData.purchases
                      .sort((a, b) => b.totalValue - a.totalValue)
                      .slice(0, 5) // Mostrar apenas as 5 maiores de cada ano
                      .map((purchase, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {index < 3 && (
                              <Badge
                                className={
                                  index === 0
                                    ? "bg-amber-500 hover:bg-amber-600"
                                    : index === 1
                                    ? "bg-slate-400 hover:bg-slate-500"
                                    : "bg-amber-700 hover:bg-amber-800"
                                }
                              >
                                {index + 1}º
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {purchase.customerName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatCPF(purchase.customerCpf)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {purchase.product.tipo_vinho}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Safra {purchase.product.safra}
                            </div>
                          </TableCell>
                          <TableCell>{purchase.quantity}</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(purchase.totalValue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    {yearData.purchases.length > 5 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-sm text-muted-foreground py-2"
                        >
                          + {yearData.purchases.length - 5} outras compras neste
                          ano
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Nenhuma compra encontrada para exibir por ano.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
