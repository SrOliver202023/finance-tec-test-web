"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseDetailsDialog } from "@/components/purchase-details-dialog";
import { RecommendationDialog } from "@/components/recommendation-dialog";

interface Product {
  codigo: number;
  tipo_vinho: string;
  preco: string;
  safra: string;
  ano_compra: number;
}

interface Item {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface Purchase {
  customerName: string;
  customerCpf: string;
  items: Item[];
  totalValue: number;
}

interface ApiResponse {
  content: Purchase[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export function PurchasesTab() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [direction, setDirection] = useState("DESC");
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "error">(
    "online"
  );

  // Estado para os diálogos
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [recommendationDialogOpen, setRecommendationDialogOpen] =
    useState(false);

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);

    try {
      // Usar nossa própria rota de API em vez de acessar diretamente a API externa
      const response = await fetch(
        `/api/compras?page=${page}&size=${size}&direction=${direction}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const data = await response.json();

      setPurchases(data);
      setTotalPages(data.totalPages || 1);
      setApiStatus("online");
    } catch (err) {
      console.error("Erro ao buscar compras:", err);
      setError("Não foi possível carregar os dados. Usando dados de exemplo.");
      setApiStatus("offline");

      // Mesmo com erro, não deixamos a tabela vazia
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [page, size, direction]);

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleShowDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setDetailsDialogOpen(true);
  };

  const handleShowRecommendation = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setRecommendationDialogOpen(true);
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

          <Button variant="outline" size="icon" onClick={fetchPurchases}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <StatusIndicator status={apiStatus} message={error || undefined} />

        <Button variant="outline" size="icon" onClick={fetchPurchases}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {purchases?.length > 0 && error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mt-2">
          Exibindo dados de exemplo. A API original não está disponível.
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Cliente</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(size)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-6 w-[80px] ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[30px]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : purchases?.length > 0 ? (
              purchases.map((purchase, index) => (
                <TableRow key={index} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {purchase.customerName}
                  </TableCell>
                  <TableCell>{formatCPF(purchase.customerCpf)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {purchase.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm">
                          {item.quantity}x {item.product.tipo_vinho} (
                          {item.product.safra})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(purchase.totalValue)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleShowDetails(purchase)}
                        >
                          Detalhes do pedido
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShowRecommendation(purchase)}
                        >
                          Recomendação de compra
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      {/* Diálogos */}
      <PurchaseDetailsDialog
        purchase={selectedPurchase}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
      {selectedPurchase && (
        <RecommendationDialog
          cpf={selectedPurchase.customerCpf}
          customerName={selectedPurchase.customerName}
          open={recommendationDialogOpen}
          onOpenChange={setRecommendationDialogOpen}
        />
      )}
    </div>
  );
}
