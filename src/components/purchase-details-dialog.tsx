import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

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

interface PurchaseDetailsDialogProps {
  purchase: Purchase | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PurchaseDetailsDialog({ purchase, open, onOpenChange }: PurchaseDetailsDialogProps) {
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  if (!purchase) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido</DialogTitle>
          <DialogDescription>
            Pedido de {purchase.customerName} ({formatCPF(purchase.customerCpf)})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Itens do Pedido</h3>
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

          <Separator />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Ano de compra dos produtos: {purchase.items[0]?.product.ano_compra}
            </div>
            <div className="text-xl font-semibold">Total: {formatCurrency(purchase.totalValue)}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
