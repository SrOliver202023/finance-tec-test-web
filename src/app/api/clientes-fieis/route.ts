import { NextResponse } from "next/server";

// Dados de exemplo para fallback quando a API não estiver disponível
const mockData = [
  {
    customerName: "Ian Joaquim Giovanni Santos",
    customerCpf: "96718391344",
    totalSpent: 7631.69,
  },
  {
    customerName: "Geraldo Pedro Julio Nascimento",
    customerCpf: "05870189179",
    totalSpent: 3416.87,
  },
  {
    customerName: "Andreia Emanuelly da Mata",
    customerCpf: "27737287426",
    totalSpent: 3210.19,
  },
  {
    customerName: "Natália Sandra da Cruz",
    customerCpf: "03763001590",
    totalSpent: 2987.45,
  },
  {
    customerName: "Marcos Vinicius Calebe Peixoto",
    customerCpf: "12345678901",
    totalSpent: 2754.3,
  },
  {
    customerName: "Elisa Mariana Alves",
    customerCpf: "98765432101",
    totalSpent: 2519.92,
  },
  {
    customerName: "Cauê Matheus Barros",
    customerCpf: "45678912301",
    totalSpent: 2493.75,
  },
  {
    customerName: "Luiza Sophia Monteiro",
    customerCpf: "78901234567",
    totalSpent: 2104.0,
  },
  {
    customerName: "Pedro Henrique Costa",
    customerCpf: "23456789012",
    totalSpent: 1961.5,
  },
  {
    customerName: "Amanda Oliveira Lima",
    customerCpf: "34567890123",
    totalSpent: 1860.0,
  },
];

export async function GET() {
  try {
    // Tentar buscar da API original
    const apiUrl = `${process.env.BASE_URL_API}/clientes-fieis`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.warn(
      "Erro ao acessar API externa de clientes fiéis, usando dados de fallback:",
      error
    );
    const enableMockData = process.env.ENABLE_MOCK_DATA_API;

    if (enableMockData) {
      return NextResponse.json(mockData);
    }
    return NextResponse.json([]);
  }
}
