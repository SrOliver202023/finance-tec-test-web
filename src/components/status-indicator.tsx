import { AlertCircle, CheckCircle2, WifiOff } from "lucide-react"

interface StatusIndicatorProps {
  status: "online" | "offline" | "error"
  message?: string
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  if (status === "online") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
        <CheckCircle2 className="h-4 w-4" />
        <span>API conectada</span>
      </div>
    )
  }

  if (status === "offline") {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-md">
        <WifiOff className="h-4 w-4" />
        <span>API indisponível - usando dados de exemplo</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-md">
      <AlertCircle className="h-4 w-4" />
      <span>{message || "Erro ao conectar com a API"}</span>
    </div>
  )
}
