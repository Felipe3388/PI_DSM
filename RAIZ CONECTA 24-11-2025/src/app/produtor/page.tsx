"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBasket,
  ClipboardList,
  Check,
  X,
  ArrowLeft,
  Leaf,
  AlertCircle,
} from "lucide-react";

// --- TIPOS ---
interface ProdutoMestre {
  id: number;
  nome: string;
  tipo: "Fruta" | "Verdura" | "Legume";
  preco: number;
  imagem: string;
  unidade: string;
}

type MeusProdutos = number[];

interface ItemPedido {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  imagem: string;
  // Novo campo para controlar a disponibilidade individual
  disponivel: boolean | null; // null = não decidido, true = tem, false = não tem
}

interface Pedido {
  id: number;
  mercadoNome: string;
  mercadoAvatar?: string;
  mensagem: string;
  status: "pendente" | "respondido";
  itens: ItemPedido[];
}

export default function ProdutorPage(): JSX.Element {
  const [view, setView] = useState<"dashboard" | "produtos" | "pedidos">(
    "dashboard"
  );

  // --- DADOS MOCKADOS ---
  const [meusProdutosIDs, setMeusProdutosIDs] = useState<MeusProdutos>([]);
  const [selecaoTemporariaIDs, setSelecaoTemporariaIDs] = useState<number[]>(
    []
  );

  const [listaMestraProdutos, setListaMestraProdutos] = useState<
    ProdutoMestre[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- DADOS DE PEDIDOS ---
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      mercadoNome: "Mercado Central",
      mercadoAvatar: "M",
      mensagem: "Olá! Precisamos repor nosso estoque para o fim de semana.",
      status: "pendente",
      itens: [
        {
          id: 101,
          nome: "Tomate",
          quantidade: 50,
          unidade: "Kg",
          imagem:
            "https://cdn.pixabay.com/photo/2016/11/19/15/17/food-1839792_640.jpg",
          disponivel: null, // Inicialmente sem decisão
        },
        {
          id: 102,
          nome: "Alface",
          quantidade: 100,
          unidade: "Un",
          imagem:
            "https://cdn.pixabay.com/photo/2020/06/16/21/32/lettuce-isolated-5307332_640.jpg",
          disponivel: null,
        },
      ],
    },
    {
      id: 2,
      mercadoNome: "Quitanda da Vila",
      mercadoAvatar: "Q",
      mensagem: "Gostaria de saber a disponibilidade destes itens.",
      status: "respondido",
      itens: [
        {
          id: 201,
          nome: "Cenoura",
          quantidade: 20,
          unidade: "Kg",
          imagem:
            "https://cdn.pixabay.com/photo/2016/09/25/16/34/carrots-1694087_640.jpg",
          disponivel: true,
        },
        {
          id: 202,
          nome: "Batata",
          quantidade: 30,
          unidade: "Kg",
          imagem:
            "https://media.istockphoto.com/id/610765164/pt/foto/batata-nova.jpg?b=1&s=612x612&w=0&k=20&c=heY03eYifMa05KMkMhJ7dupuqID9jhrJqqipgjWGXSc=",
          disponivel: true,
        },
      ],
    },
  ]);

  // --- FILTROS ---
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  // --- EFEITOS ---
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/produto");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const dataRaw: any = await response.json();
        if (!Array.isArray(dataRaw)) throw new Error("Esperado um array.");

        const dataNormalizada = dataRaw.map((p: any) => ({
          id: Number(p?.id ?? 0),
          nome: String(p?.nome ?? "Produto"),
          tipo: ["Fruta", "Verdura", "Legume"].includes(p.tipo)
            ? p.tipo
            : "Verdura",
          preco: Number(p?.preco ?? 0),
          imagem: String(p?.imagem ?? ""),
          unidade: p?.unidade ?? "Unid.",
        }));

        setListaMestraProdutos(dataNormalizada);
      } catch (error) {
        console.error("Erro ao carregar produtos (usando fallback):", error);

        setListaMestraProdutos([
          {
            id: 1,
            nome: "Tomate",
            tipo: "Verdura",
            preco: 4.2,
            imagem:
              "https://cdn.pixabay.com/photo/2016/11/19/15/17/food-1839792_640.jpg",
            unidade: "Kg",
          },
          {
            id: 2,
            nome: "Alface",
            tipo: "Verdura",
            preco: 2.0,
            imagem:
              "https://cdn.pixabay.com/photo/2020/06/16/21/32/lettuce-isolated-5307332_640.jpg",
            unidade: "Un",
          },
          {
            id: 3,
            nome: "Cenoura",
            tipo: "Verdura",
            preco: 3.3,
            imagem:
              "https://cdn.pixabay.com/photo/2016/09/25/16/34/carrots-1694087_640.jpg",
            unidade: "Kg",
          },
          {
            id: 4,
            nome: "Maçã",
            tipo: "Fruta",
            preco: 3.5,
            imagem:
              "https://carrefourbrfood.vtexassets.com/arquivos/ids/26081377/5229227_1.jpg?v=637722585191230000",
            unidade: "Kg",
          },
          {
            id: 5,
            nome: "Banana",
            tipo: "Fruta",
            preco: 2.2,
            imagem:
              "https://media.istockphoto.com/id/1291262100/pt/foto/banana.jpg?s=612x612&w=0&k=20&c=-r0pgMLdu1O6BWiLxE5Et1yYAmUVirlwoHFr-hlUGHk=",
            unidade: "Dúzia",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  useEffect(() => {
    if (view === "produtos") {
      setSelecaoTemporariaIDs(meusProdutosIDs);
    }
  }, [view, meusProdutosIDs]);

  // --- HANDLERS ---
  const handleToggleSelecaoTemporaria = (produtoID: number) => {
    setSelecaoTemporariaIDs((prevIDs) =>
      prevIDs.includes(produtoID)
        ? prevIDs.filter((id) => id !== produtoID)
        : [...prevIDs, produtoID]
    );
  };

  const handleSalvarSelecao = () => {
    setMeusProdutosIDs(selecaoTemporariaIDs);
  };

  // Define se um item específico está disponível ou não
  const handleItemDecision = (
    pedidoId: number,
    itemId: number,
    decision: boolean
  ) => {
    setPedidos((prev) =>
      prev.map((pedido) => {
        if (pedido.id !== pedidoId) return pedido;

        return {
          ...pedido,
          itens: pedido.itens.map((item) => {
            if (item.id !== itemId) return item;
            // Se clicar na mesma decisão que já estava, desmarca (volta pra null)
            const novaDecisao = item.disponivel === decision ? null : decision;
            return { ...item, disponivel: novaDecisao };
          }),
        };
      })
    );
  };

  const responderPedido = (id: number) => {
    // Verifica se há itens pendentes de decisão (opcional, mas boa prática)
    const pedidoAtual = pedidos.find((p) => p.id === id);
    if (pedidoAtual) {
      const itensPendentes = pedidoAtual.itens.some(
        (i) => i.disponivel === null
      );
      if (itensPendentes) {
        if (
          !confirm(
            "Alguns itens não foram marcados. Eles serão considerados indisponíveis. Deseja continuar?"
          )
        ) {
          return;
        }
      }
    }

    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "respondido" } : p))
    );
  };

  // --- RENDERIZAÇÃO ---

  const produtosFiltrados = listaMestraProdutos.filter((produto) => {
    const matchTipo = filtroTipo === "Todos" || produto.tipo === filtroTipo;
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const hasChanges =
    JSON.stringify([...selecaoTemporariaIDs].sort()) !==
    JSON.stringify([...meusProdutosIDs].sort());

  // DASHBOARD
  const renderDashboard = () => {
    const totalProdutosAtivos = meusProdutosIDs.length;
    const pedidosPendentes = pedidos.filter(
      (p) => p.status === "pendente"
    ).length;

    return (
      <>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Painel de Controle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              MEUS PRODUTOS
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {totalProdutosAtivos}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              PEDIDOS PENDENTES
            </h3>
            <p className="text-3xl font-bold text-yellow-500">
              {pedidosPendentes}
            </p>
          </div>
        </div>
      </>
    );
  };

  // MEUS PRODUTOS
  const renderMeusProdutos = () => {
    if (isLoading)
      return (
        <div className="p-8 text-center text-gray-500">
          Carregando produtos...
        </div>
      );

    return (
      <>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          O que você vende?
        </h2>
        <p className="text-gray-600 mb-6">
          Selecione os produtos que você cultiva.
        </p>

        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
            />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-800"
            >
              <option value="Todos">Todos</option>
              <option value="Fruta">Frutas</option>
              <option value="Verdura">Verduras</option>
              <option value="Legume">Legumes</option>
            </select>
            <button
              onClick={handleSalvarSelecao}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                hasChanges
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {produtosFiltrados.map((produto) => {
            const isSelected = selecaoTemporariaIDs.includes(produto.id);
            return (
              <div
                key={produto.id}
                onClick={() => handleToggleSelecaoTemporaria(produto.id)}
                className={`relative group cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "border-green-500 shadow-md"
                    : "border-gray-100 hover:border-green-300"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full z-10 shadow-sm">
                    <Check size={14} />
                  </div>
                )}
                <div className="aspect-square relative bg-gray-50">
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Leaf size={32} />
                  </div>
                  {produto.imagem && (
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="absolute inset-0 w-full h-full object-contain p-2 transform scale-100 transition-transform group-hover:scale-110"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>
                <div className="p-3 bg-white text-center">
                  <p className="font-bold text-gray-800 text-sm truncate">
                    {produto.nome}
                  </p>
                  <p className="text-xs text-gray-500">{produto.tipo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  // PEDIDOS
  const renderPedidos = () => {
    return (
      <>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Pedidos e Consultas
        </h2>

        <div className="space-y-6">
          {pedidos.map((pedido) => {
            // Cálculos para o resumo do botão
            const itensConfirmados = pedido.itens.filter(
              (i) => i.disponivel === true
            ).length;
            const itensNegados = pedido.itens.filter(
              (i) => i.disponivel === false
            ).length;
            const itensPendentes = pedido.itens.filter(
              (i) => i.disponivel === null
            ).length;

            return (
              <div
                key={pedido.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Cabeçalho do Pedido */}
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                      {pedido.mercadoNome.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base m-0">
                        {pedido.mercadoNome}
                      </h3>
                      <p className="text-xs text-gray-500 m-0">
                        {pedido.mensagem}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pedido.status === "pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {pedido.status === "pendente" ? "Pendente" : "Respondido"}
                  </span>
                </div>

                {/* Corpo com Itens Visuais */}
                <div className="p-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Produtos Solicitados</span>
                    {pedido.status === "pendente" && (
                      <span className="text-[10px] normal-case bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                        Confirme a disponibilidade item a item
                      </span>
                    )}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pedido.itens.map((item) => {
                      // Estilização condicional baseada na disponibilidade
                      let bgClass = "bg-white border-gray-200";
                      if (item.disponivel === true)
                        bgClass = "bg-green-50 border-green-200";
                      if (item.disponivel === false)
                        bgClass = "bg-red-50 border-red-200 opacity-75";

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between border rounded-xl p-2 pr-3 shadow-sm transition-all ${bgClass}`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Imagem do Item */}
                            <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden relative flex items-center justify-center border border-gray-100">
                              <Leaf className="text-gray-300" size={20} />
                              {item.imagem && (
                                <img
                                  src={item.imagem}
                                  alt={item.nome}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) =>
                                    (e.currentTarget.style.display = "none")
                                  }
                                />
                              )}
                            </div>
                            {/* Info Quantidade */}
                            <div className="flex flex-col">
                              <span
                                className={`text-sm font-bold ${
                                  item.disponivel === false
                                    ? "text-gray-500 line-through"
                                    : "text-gray-800"
                                }`}
                              >
                                {item.nome}
                              </span>
                              <span className="text-xs font-bold text-gray-500">
                                {item.quantidade} {item.unidade}
                              </span>
                            </div>
                          </div>

                          {/* Botões de Decisão (Só aparecem se pendente) */}
                          {pedido.status === "pendente" ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  handleItemDecision(pedido.id, item.id, true)
                                }
                                className={`p-2 rounded-full transition-colors ${
                                  item.disponivel === true
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                                }`}
                                title="Tenho disponível"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleItemDecision(pedido.id, item.id, false)
                                }
                                className={`p-2 rounded-full transition-colors ${
                                  item.disponivel === false
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
                                }`}
                                title="Não tenho estoque"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            // Visualização estática se já respondido
                            <div className="px-3">
                              {item.disponivel ? (
                                <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                                  <Check size={14} /> Confirmado
                                </span>
                              ) : (
                                <span className="text-red-500 font-bold text-xs flex items-center gap-1">
                                  <X size={14} /> Indisponível
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ações */}
                {pedido.status === "pendente" && (
                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {itensPendentes > 0
                        ? `Ainda faltam confirmar ${itensPendentes} itens.`
                        : "Todos os itens revisados."}
                    </div>
                    <button
                      onClick={() => responderPedido(pedido.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
                    >
                      <Check size={16} />
                      {itensNegados > 0
                        ? `Enviar (${itensConfirmados} Sim, ${itensNegados} Não)`
                        : "Confirmar Tudo Disponível"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 transition-all">
        <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-gray-100 h-16">
          <div className="p-2 bg-green-100 rounded-xl text-green-600">
            <Leaf size={20} />
          </div>
          <span className="hidden lg:block font-bold text-green-800 tracking-tight">
            Raiz Conecta
          </span>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1">
          <button
            onClick={() => setView("dashboard")}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-colors ${
              view === "dashboard"
                ? "bg-green-50 text-green-700 font-bold"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={20} />{" "}
            <span className="hidden lg:inline">Visão Geral</span>
          </button>
          <button
            onClick={() => setView("produtos")}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-colors ${
              view === "produtos"
                ? "bg-green-50 text-green-700 font-bold"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <ShoppingBasket size={20} />{" "}
            <span className="hidden lg:inline">Meus Produtos</span>
          </button>
          <button
            onClick={() => setView("pedidos")}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-colors ${
              view === "pedidos"
                ? "bg-green-50 text-green-700 font-bold"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <ClipboardList size={20} />
            <span className="hidden lg:inline">Pedidos</span>
            {pedidos.filter((p) => p.status === "pendente").length > 0 && (
              <span className="w-2 h-2 bg-yellow-500 rounded-full lg:ml-auto"></span>
            )}
          </button>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 ml-20 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Botão Voltar */}
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para Início
          </button>

          {view === "dashboard" && renderDashboard()}
          {view === "produtos" && renderMeusProdutos()}
          {view === "pedidos" && renderPedidos()}
        </div>
      </main>
    </div>
  );
}
