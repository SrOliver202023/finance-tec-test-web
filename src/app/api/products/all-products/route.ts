import { NextResponse } from "next/server";

// Dados de exemplo para fallback quando a API não estiver disponível
const mockData = [
  {
    codigo: 1,
    tipo_vinho: "Tinto",
    preco: "229.99",
    safra: "2017",
    ano_compra: 2018,
  },
  {
    codigo: 2,
    tipo_vinho: "Branco",
    preco: "126.50",
    safra: "2018",
    ano_compra: 2019,
  },
  {
    codigo: 3,
    tipo_vinho: "Rosé",
    preco: "121.75",
    safra: "2019",
    ano_compra: 2020,
  },
  {
    codigo: 4,
    tipo_vinho: "Espumante",
    preco: "134.25",
    safra: "2020",
    ano_compra: 2021,
  },
  {
    codigo: 5,
    tipo_vinho: "Chardonnay",
    preco: "128.99",
    safra: "2021",
    ano_compra: 2022,
  },
  {
    codigo: 6,
    tipo_vinho: "Tinto",
    preco: "327.50",
    safra: "2016",
    ano_compra: 2017,
  },
  {
    codigo: 7,
    tipo_vinho: "Branco",
    preco: "125.25",
    safra: "2017",
    ano_compra: 2018,
  },
  {
    codigo: 8,
    tipo_vinho: "Rosé",
    preco: "120.99",
    safra: "2018",
    ano_compra: 2019,
  },
  {
    codigo: 9,
    tipo_vinho: "Espumante",
    preco: "135.50",
    safra: "2019",
    ano_compra: 2020,
  },
  {
    codigo: 10,
    tipo_vinho: "Chardonnay",
    preco: "130.75",
    safra: "2020",
    ano_compra: 2021,
  },
  {
    codigo: 11,
    tipo_vinho: "Tinto",
    preco: "128.99",
    safra: "2017",
    ano_compra: 2018,
  },
  {
    codigo: 12,
    tipo_vinho: "Branco",
    preco: "106.50",
    safra: "2018",
    ano_compra: 2019,
  },
  {
    codigo: 13,
    tipo_vinho: "Rosé",
    preco: "121.75",
    safra: "2019",
    ano_compra: 2020,
  },
  {
    codigo: 14,
    tipo_vinho: "Espumante",
    preco: "134.25",
    safra: "2020",
    ano_compra: 2021,
  },
  {
    codigo: 15,
    tipo_vinho: "Chardonnay",
    preco: "188.99",
    safra: "2021",
    ano_compra: 2022,
  },
  {
    codigo: 16,
    tipo_vinho: "Tinto",
    preco: "127.50",
    safra: "2016",
    ano_compra: 2017,
  },
  {
    codigo: 17,
    tipo_vinho: "Branco",
    preco: "125.25",
    safra: "2017",
    ano_compra: 2018,
  },
  {
    codigo: 18,
    tipo_vinho: "Rosé",
    preco: "120.99",
    safra: "2018",
    ano_compra: 2019,
  },
  {
    codigo: 19,
    tipo_vinho: "Espumante",
    preco: "135.50",
    safra: "2019",
    ano_compra: 2020,
  },
  {
    codigo: 20,
    tipo_vinho: "Chardonnay",
    preco: "130.75",
    safra: "2020",
    ano_compra: 2021,
  },
];

export async function GET() {
  try {
    // Tentar buscar da API original
    const apiUrl = `${process.env.BASE_URL_API}/products/all-products`;

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
      "Erro ao acessar API externa de produtos, usando dados de fallback:",
      error
    );

    const enableMockData = process.env.ENABLE_MOCK_DATA_API;

    if (enableMockData) {
      return NextResponse.json(mockData);
    }
    return NextResponse.json([]);
  }
}
