"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Removido para corrigir o erro

interface Produto {
  id: number;
  nome: string;
  preco: number;
  tipo: "Fruta" | "Verdura" | "Legume";
  imagem: string;
  quantidade: number; // Esta agora é a quantidade TOTAL no carrinho
}

export default function ProdutosPage() {
  // const router = useRouter(); // Removido para corrigir o erro

  const [produtos, setProdutos] = useState<Produto[]>([]);

  // --- NOVOS ESTADOS ---
  // Estado para guardar o valor dos inputs de "quantidade a adicionar"
  const [inputQuantidades, setInputQuantidades] = useState<
    Record<number, string>
  >({});
  // --- ESTADO DO POPUP REMOVIDO ---
  // const [popupInfo, setPopupInfo] = useState({ visible: false, message: "" });

  // -----------------------

  useEffect(() => {
    fetch("http://localhost:3000/api/produto", { method: "GET" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resposta: Produto[] = await response.json();
        // Inicializa os produtos com quantidade 0
        const produtosComQuantidade = resposta.map((p) => ({
          ...p,
          quantidade: 0,
        }));
        setProdutos(produtosComQuantidade);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoTipo, setNovoTipo] = useState<"Fruta" | "Verdura" | "Legume">(
    "Fruta"
  );
  const [novaImagem, setNovaImagem] = useState("");

  // --- NOVA FUNÇÃO ---
  // Lógica para adicionar ao carrinho (sem popup)
  const handleAdicionarAoCarrinho = (produto: Produto) => {
    // Pega a quantidade do input, ou usa "1" como padrão se estiver vazio
    const strQtd = inputQuantidades[produto.id] || "1";
    const qtdParaAdicionar = parseInt(strQtd, 10);

    // Validação
    if (isNaN(qtdParaAdicionar) || qtdParaAdicionar <= 0) {
      console.error("Quantidade inválida");
      return;
    }

    // Atualiza o estado de 'produtos' somando a nova quantidade
    setProdutos((prev) =>
      prev.map((item) =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + qtdParaAdicionar }
          : item
      )
    );

    // Reseta o input do card para "" (vazio)
    setInputQuantidades((prev) => ({ ...prev, [produto.id]: "" }));

    // --- POPUP REMOVIDO ---
  };

  const adicionarProduto = () => {
    if (!novoNome || !novoPreco) return;
    const novo: Produto = {
      id: produtos.length + 1,
      nome: novoNome,
      preco: parseFloat(novoPreco),
      tipo: novoTipo,
      imagem:
        novaImagem || "https://cdn-icons-png.flaticon.com/512/415/415733.png",
      quantidade: 0,
    };
    setProdutos((prev) => [...prev, novo]);
    setMostrarModal(false);
    setNovoNome("");
    setNovoPreco("");
    setNovaImagem("");
  };

  const irParaCheckout = async () => {
    const carrinho = produtos.filter((p) => p.quantidade > 0);

    if (carrinho.length > 0) {
      localStorage.setItem("carrinho", JSON.stringify(carrinho));

      try {
        const promessasDeAtualizacao = carrinho.map((produto) =>
          atualizarItemNoCarrinho(produto, produto.quantidade)
        );

        await Promise.all(promessasDeAtualizacao);

        console.log("Carrinho salvo na API, redirecionando...");
        window.location.href = "/checkout";
      } catch (error) {
        console.error("Erro ao salvar o carrinho na API:", error);
        // Opcional: Mostrar um alerta de erro (popup foi removido)
        // alert("Erro ao salvar o carrinho. Tente novamente.");
      }
    } else {
      localStorage.removeItem("carrinho");
      window.location.href = "/checkout";
    }
  };

  const atualizarItemNoCarrinho = async (
    produto: { id: any; nome: any; preco: any; imagem: any },
    novaQuantidade: any
  ) => {
    const response = await fetch("/api/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: novaQuantidade,
        imagem: produto.imagem,
        unidade: "un",
      }),
    });

    const carrinhoAtualizado = await response.json();
    console.log("Carrinho atualizado pela API:", carrinhoAtualizado);
  };

  // ------------------- FILTROS -----------------------
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<string>("Todos");

  const produtosFiltrados = produtos.filter((p) => {
    const nomeCombina = p.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaCombina =
      categoriaSelecionada === "Todos" || p.tipo === categoriaSelecionada;
    return nomeCombina && categoriaCombina;
  });

  // ------------------- INTERFACE -----------------------
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* --- POPUP REMOVIDO --- */}

      <main className="flex-1 container mx-auto p-4">
        {/* TÍTULO + FILTROS */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h1 className="text-2xl font-bold text-green-800">Produtos</h1>
          <div className="flex items-center gap-2">
            {/* Campo de busca */}
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border border-green-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Filtro de categoria */}
            <select
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
              className="border border-green-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="Todos">Todos</option>
              <option value="Fruta">Frutas</option>
              <option value="Verdura">Verduras</option>
              <option value="Legume">Legumes</option>
            </select>
          </div>
        </div>

        <hr className="mb-6" />

        {/* LISTA DE PRODUTOS — ALTERADO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {produtosFiltrados.map((p) => (
            <div
              key={p.id}
              className="relative flex flex-col items-center border border-green-300 rounded-xl p-4 bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              {/* --- NOVO BADGE DE QUANTIDADE --- */}
              {p.quantidade > 0 && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                  {p.quantidade} no carrinho
                </div>
              )}

              {/* Imagem */}
              <img
                src={p.imagem}
                alt={p.nome}
                className="w-28 h-28 object-contain mb-3"
              />
              {/* Nome e preços */}
              <h3 className="font-semibold text-green-800 text-sm mb-1">
                {p.nome}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-gray-800 font-bold text-base">
                  R$ {p.preco.toFixed(2)}
                </span>
              </div>

              {/* --- CONTROLES DE QUANTIDADE (MODIFICADO) --- */}
              <div className="flex items-center justify-center gap-2 w-full mb-3">
                <input
                  type="text"
                  // O valor agora é "" por padrão
                  value={inputQuantidades[p.id] || ""}
                  // Adicionado placeholder para sugerir "_"
                  placeholder="__"
                  onChange={(e) => {
                    const valor = e.target.value;
                    // Permite apenas números inteiros positivos
                    if (/^\d*$/.test(valor)) {
                      setInputQuantidades((prev) => ({
                        ...prev,
                        [p.id]: valor,
                      }));
                    }
                  }}
                  // Estilo ajustado
                  className="w-16 text-center text-sm font-medium border border-gray-300 rounded-md py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 no-spinners"
                />
              </div>

              {/* --- BOTÃO "Add to Cart" (MODIFICADO) --- */}
              <button
                // Chama a nova função
                onClick={() => handleAdicionarAoCarrinho(p)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 !rounded-full text-sm font-medium transition"
              >
                Adicionar ao Carrinho 🛒
              </button>
            </div>
          ))}
        </div>

        {/* RODAPÉ DO CARRINHO */}
        <div className="mt-4 p-3 bg-white rounded shadow-sm flex justify-between items-center">
          <div className="text-sm">
            Total de itens no carrinho:{" "}
            <span className="font-semibold">
              {produtos.reduce((a, b) => a + b.quantidade, 0)}
            </span>
          </div>
          <div>
            <button
              onClick={irParaCheckout}
              className="bg-orange-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded text-sm"
            >
              Ir para o Checkout
            </button>
          </div>
        </div>
      </main>

      {/* MODAL DE NOVO PRODUTO (Sem alterações) */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-5 rounded-lg w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-green-700">
              Novo Produto
            </h2>
            <input
              type="text"
              placeholder="Nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="border p-2 rounded-md w-full mb-2 text-sm"
            />
            <input
              type="number"
              placeholder="Preço"
              value={novoPreco}
              onChange={(e) => setNovoPreco(e.target.value)}
              className="border p-2 rounded-md w-full mb-2 text-sm"
            />
            <input
              type="text"
              placeholder="URL da imagem (opcional)"
              value={novaImagem}
              onChange={(e) => setNovaImagem(e.target.value)}
              className="border p-2 rounded-md w-full mb-2 text-sm"
            />
            <select
              value={novoTipo}
              onChange={(e) =>
                setNovoTipo(e.target.value as "Fruta" | "Verdura" | "Legume")
              }
              className="border p-2 rounded-md w-full mb-3 text-sm"
            >
              <option value="Fruta">Fruta</option>
              <option value="Verdura">Verdura</option>
              <option value="Legume">Legume</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-3 py-1 rounded bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarProduto}
                className="px-3 py-1 rounded bg-green-600 text-white"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}