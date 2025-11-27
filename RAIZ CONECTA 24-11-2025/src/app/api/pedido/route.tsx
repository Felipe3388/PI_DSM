// Arquivo: app/api/carrinho/route.ts (ou .js)

import { NextResponse } from "next/server";

// NOSSO "BANCO DE DADOS" SIMULADO EM MEMÓRIA
// Esta variável fica "viva" no servidor enquanto ele estiver rodando.
let carrinho: any[] = [];

/**
 * GET: Retorna o estado atual do carrinho
 */
export function GET() {
  // Simplesmente retorna a lista atual de itens
  return NextResponse.json(
    carrinho,
    { status: 200 }
  );
}

/**
 * POST: Adiciona/Atualiza um item no carrinho
 */
export async function POST(request: Request) {
  try {
    // 1. Pega o item enviado pelo frontend (ex: { id: "prod1", nome: "Produto 1", quantidade: 1 })
    const itemAdicionado = await request.json();

    // Validação básica
    if (!itemAdicionado.id || !itemAdicionado.quantidade) {
      return NextResponse.json(
        { message: "Requisição inválida. 'id' e 'quantidade' são obrigatórios." },
        { status: 400 }
      );
    }

    // 2. Lógica do Carrinho: Verifica se o item já existe
    const itemExistenteIndex = carrinho.findIndex(item => item.id === itemAdicionado.id);

    if (itemExistenteIndex > -1) {
      // --- Item já existe ---
      // Apenas atualiza a quantidade
      carrinho[itemExistenteIndex].quantidade = itemAdicionado.quantidade;
      
      // Se a quantidade for 0 ou menos, remove o item
      if (carrinho[itemExistenteIndex].quantidade <= 0) {
        carrinho = carrinho.filter(item => item.id !== itemAdicionado.id);
      }
    } else if (itemAdicionado.quantidade > 0) {
      // --- Item é novo ---
      // Adiciona o item ao carrinho (aqui você poderia adicionar mais dados, como 'nome' e 'preco')
      carrinho.push(itemAdicionado);
    }

    console.log("Carrinho atualizado:", carrinho);

    // 3. Retorna o carrinho atualizado para o frontend
    return NextResponse.json(
      carrinho, // Envia o carrinho inteiro de volta
      { status: 201 }
    );

  } catch (error) {
    console.log("Erro no POST:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}



export async function PUT(request: Request) {
  try {
    // 1. Pega o item enviado pelo frontend (ex: { id: "prod1", quantidade: 3 })
    const itemAtualizado = await request.json();

    // Validação básica
    if (!itemAtualizado.id || itemAtualizado.quantidade === undefined) {
      return NextResponse.json(
        { message: "Requisição inválida. 'id' e 'quantidade' são obrigatórios." },
        { status: 400 }
      );
    }

    // 2. Procura o item no carrinho
    const itemExistenteIndex = carrinho.findIndex(item => item.id === itemAtualizado.id);

    if (itemExistenteIndex === -1) {
      // Item não existe → PUT não cria, só atualiza
      return NextResponse.json(
        { message: "Item não encontrado no carrinho." },
        { status: 404 }
      );
    }

    // 3. Atualiza a quantidade do item
    carrinho[itemExistenteIndex].quantidade = itemAtualizado.quantidade;

    // Se a quantidade for 0 ou menos → remove
    if (itemAtualizado.quantidade <= 0) {
      carrinho = carrinho.filter(item => item.id !== itemAtualizado.id);
    }

    console.log("Item atualizado via PUT:", carrinho);

    // 4. Retorna o carrinho atualizado
    return NextResponse.json(
      carrinho,
      { status: 200 }
    );

  } catch (error) {
    console.log("Erro no PUT:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}


/**
 * DELETE: (Opcional) Esvazia o carrinho
 */
export function DELETE() {
  carrinho = []; // Reseta o carrinho
  console.log("Carrinho esvaziado.");
  return NextResponse.json(
    { message: "Carrinho esvaziado com sucesso!" },
    { status: 200 }
  );
}
