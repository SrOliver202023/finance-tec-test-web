"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

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

export function TopPurchasesTab() {
  const [topPurchases, setTopPurchases] = useState<TopPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
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
      console.error("Erro ao buscar maiores compras:", err);
      setError("Não foi possível carregar os dados. Usando dados de exemplo.");
      setApiStatus("offline");

      // Mesmo com erro, não deixamos a tabela vazia
      setTopPurchases([]);
    } finally {
      setLoading(false);
    }
  };

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
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[250px]">Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(size)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[30px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-6 w-[80px] ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
            ) : topPurchases?.length > 0 ? (
              topPurchases.map((purchase, index) => (
                <TableRow key={index} className="group hover:bg-muted/50">
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
                    <div>
                      <div className="font-medium">{purchase.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCPF(purchase.customerCpf)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {purchase.product.tipo_vinho}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Safra {purchase.product.safra} •{" "}
                        {formatCurrency(purchase.product.preco)} un.
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-lg font-semibold">
                      {purchase.quantity}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      unidades
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-lg font-bold">
                      {formatCurrency(purchase.totalValue)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma compra encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
