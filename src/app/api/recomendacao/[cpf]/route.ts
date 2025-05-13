import { NextResponse } from "next/server";

// Dados de exemplo para recomendações
const mockRecommendations: Record<string, any> = {
  "20634031392": {
    codigo: 12,
    tipo_vinho: "Cabernet Sauvignon",
    preco: "189.90",
    safra: "2015",
    ano_compra: 2023,
    motivo:
      "Baseado nas suas compras anteriores de vinhos Rosé, acreditamos que você vai gostar deste Cabernet Sauvignon premium da safra de 2015. É um vinho encorpado com notas de frutas vermelhas e um final longo.",
  },
  "12345678901": {
    codigo: 7,
    tipo_vinho: "Merlot",
    preco: "99.90",
    safra: "2019",
    ano_compra: 2022,
    motivo:
      "Como você comprou vinhos Tintos recentemente, recomendamos este Merlot suave e frutado que complementa bem sua coleção atual.",
  },
};

export async function GET(
  request: Request,
  { params }: { params: { cpf: string } }
) {
  const cpf = params.cpf;

  try {
    // Tentar buscar da API original
    const apiUrl = `${process.env.BASE_URL_API}/recomendacao/${cpf}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // Se a API original falhar, verificar se temos dados de exemplo
      if (mockRecommendations[cpf]) {
        return NextResponse.json(mockRecommendations[cpf]);
      }

      // Se não tivermos dados de exemplo para este CPF, retornar erro
      return NextResponse.json(
        {
          error:
            "Não foi possível encontrar uma recomendação para este cliente.",
        },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.warn(
      "Erro ao acessar API de recomendação, verificando dados de exemplo:",
      error
    );

    // Verificar se temos dados de exemplo para este CPF
    if (mockRecommendations[cpf]) {
      const enableMockData = process.env.ENABLE_MOCK_DATA_API;

      if (enableMockData) {
        return NextResponse.json(mockRecommendations[cpf]);
      }
      return NextResponse.json([]);
    }

    // Se não tivermos dados de exemplo para este CPF, retornar erro
    return NextResponse.json(
      {
        error: "Não foi possível encontrar uma recomendação para este cliente.",
      },
      { status: 404 }
    );
  }
}
