import { type NextRequest, NextResponse } from "next/server";

// Dados de exemplo para fallback quando a API não estiver disponível
const mockData = {
  content: [
    {
      customerName: "Ian Joaquim Giovanni Santos",
      customerCpf: "96718391344",
      product: {
        codigo: 3,
        tipo_vinho: "Rosé",
        preco: "121.75",
        safra: "2019",
        ano_compra: 2020,
      },
      quantity: 20,
      totalValue: 2435,
    },
    {
      customerName: "Natália Sandra da Cruz",
      customerCpf: "03763001590",
      product: {
        codigo: 6,
        tipo_vinho: "Tinto",
        preco: "327.50",
        safra: "2016",
        ano_compra: 2017,
      },
      quantity: 6,
      totalValue: 1965,
    },
    {
      customerName: "Fabiana Melissa Nunes",
      customerCpf: "824643755772",
      product: {
        codigo: 10,
        tipo_vinho: "Chardonnay",
        preco: "130.75",
        safra: "2020",
        ano_compra: 2021,
      },
      quantity: 10,
      totalValue: 1307.5,
    },
    {
      customerName: "Ian Joaquim Giovanni Santos",
      customerCpf: "96718391344",
      product: {
        codigo: 15,
        tipo_vinho: "Chardonnay",
        preco: "188.99",
        safra: "2021",
        ano_compra: 2022,
      },
      quantity: 6,
      totalValue: 1133.94,
    },
    {
      customerName: "Marcos Vinicius Calebe Peixoto",
      customerCpf: "12345678901",
      product: {
        codigo: 8,
        tipo_vinho: "Branco",
        preco: "245.90",
        safra: "2018",
        ano_compra: 2019,
      },
      quantity: 7,
      totalValue: 1721.3,
    },
    {
      customerName: "Elisa Mariana Alves",
      customerCpf: "98765432101",
      product: {
        codigo: 12,
        tipo_vinho: "Espumante",
        preco: "189.99",
        safra: "2020",
        ano_compra: 2021,
      },
      quantity: 8,
      totalValue: 1519.92,
    },
    {
      customerName: "Cauê Matheus Barros",
      customerCpf: "45678912301",
      product: {
        codigo: 5,
        tipo_vinho: "Tinto",
        preco: "298.75",
        safra: "2015",
        ano_compra: 2016,
      },
      quantity: 5,
      totalValue: 1493.75,
    },
    {
      customerName: "Luiza Sophia Monteiro",
      customerCpf: "78901234567",
      product: {
        codigo: 9,
        tipo_vinho: "Merlot",
        preco: "175.50",
        safra: "2017",
        ano_compra: 2018,
      },
      quantity: 8,
      totalValue: 1404,
    },
    {
      customerName: "Pedro Henrique Costa",
      customerCpf: "23456789012",
      product: {
        codigo: 7,
        tipo_vinho: "Cabernet",
        preco: "210.25",
        safra: "2019",
        ano_compra: 2020,
      },
      quantity: 6,
      totalValue: 1261.5,
    },
    {
      customerName: "Amanda Oliveira Lima",
      customerCpf: "34567890123",
      product: {
        codigo: 11,
        tipo_vinho: "Pinot Noir",
        preco: "315.00",
        safra: "2018",
        ano_compra: 2019,
      },
      quantity: 4,
      totalValue: 1260,
    },
    {
      customerName: "Rafael Souza Santos",
      customerCpf: "56789012345",
      product: {
        codigo: 14,
        tipo_vinho: "Sauvignon Blanc",
        preco: "145.90",
        safra: "2021",
        ano_compra: 2022,
      },
      quantity: 8,
      totalValue: 1167.2,
    },
    {
      customerName: "Juliana Ferreira Silva",
      customerCpf: "67890123456",
      product: {
        codigo: 4,
        tipo_vinho: "Malbec",
        preco: "189.50",
        safra: "2017",
        ano_compra: 2018,
      },
      quantity: 6,
      totalValue: 1137,
    },
  ],
  totalElements: 12,
  totalPages: 2,
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
    const apiUrl = `${process.env.BASE_URL_API}/maiores-compras?page=${page}&size=${size}&direction=${direction}`;

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
      "Erro ao acessar API externa de maiores compras, usando dados de fallback:",
      error
    );

    const enableMockData = process.env.ENABLE_MOCK_DATA_API;

    if (enableMockData) {
      // Retornar dados de exemplo quando a API não estiver disponível
      // Simular paginação com os dados de exemplo
      const pageNum = Number.parseInt(page) - 1;
      const sizeNum = Number.parseInt(size);
      const start = pageNum * sizeNum;
      const end = start + sizeNum;

      const paginatedContent = mockData.content.slice(start, end);
      const totalPages = Math.ceil(mockData.content.length / sizeNum);

      return NextResponse.json({
        content: paginatedContent,
        totalElements: mockData.content.length,
        totalPages: totalPages,
        size: sizeNum,
        number: pageNum,
      });
    }

    return NextResponse.json([]);
  }
}
