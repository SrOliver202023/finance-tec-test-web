import { type NextRequest, NextResponse } from "next/server";

// Dados de exemplo para fallback quando a API não estiver disponível
const mockData = {
  content: [
    {
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
    },
    {
      customerName: "Maria Silva",
      customerCpf: "12345678901",
      items: [
        {
          product: {
            codigo: 5,
            tipo_vinho: "Tinto",
            preco: "89.90",
            safra: "2020",
            ano_compra: 2022,
          },
          quantity: 2,
          subtotal: 179.8,
        },
      ],
      totalValue: 179.8,
    },
    {
      customerName: "João Santos",
      customerCpf: "98765432101",
      items: [
        {
          product: {
            codigo: 12,
            tipo_vinho: "Branco",
            preco: "65.50",
            safra: "2021",
            ano_compra: 2023,
          },
          quantity: 4,
          subtotal: 262.0,
        },
      ],
      totalValue: 262.0,
    },
  ],
  totalElements: 3,
  totalPages: 1,
  size: 10,
  number: 0,
};

export async function GET(request: NextRequest) {
  // Extrair parâmetros da URL
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "10";
  const direction = searchParams.get("direction") || "DESC";

  try {
    // Tentar buscar da API original
    const apiUrl = `${process.env.BASE_URL_API}/compras?page=${page}&size=${size}&direction=${direction}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Importante: não reutilizar conexões para evitar problemas com o Node.js no ambiente Next.js
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.warn(
      "Erro ao acessar API externa, usando dados de fallback:",
      error
    );

    const enableMockData = process.env.ENABLE_MOCK_DATA_API;

    if (enableMockData) {
      return NextResponse.json(mockData);
    }
    return NextResponse.json([]);
  }
}
