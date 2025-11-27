"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
  Spinner, // ADICIONADO SPINNER
} from "react-bootstrap";
// ADICIONADO ArrowLeft
import { Trash2, ArrowLeft } from "lucide-react";

export default function Checkout() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // --- NOVO ESTADO PARA O FORMULÁRIO ---
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    telefone: "",
    cep: "",
    endereco: "",
    num: "",
    // complemento: "", // REMOVIDO
    bairro: "",
    cidade: "",
    estado: "",
  });

  // --- NOVOS ESTADOS PARA API DE CEP ---
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  // Tipagem mais específica para produto (COM ID)
  interface Produto {
    id: number;
    imagem: string;
    nome: string;
    unidade: string;
    quantidade: number;
    preco?: number;
  }

  useEffect(() => {
    fetch("http://localhost:3000/api/pedido", { method: "GET" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resposta: Produto[] = await response.json();
        setProdutos(resposta);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  // --- NOVA FUNÇÃO PARA BUSCAR CEP ---
  const fetchCep = async (cep: string) => {
    setCepLoading(true);
    setCepError("");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("CEP não encontrado");
      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado ou inválido");
      }

      // Preenche o formulário com os dados
      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch (error: any) {
      setCepError(error.message || "Erro ao buscar CEP");
      // Limpa os campos se der erro
      setFormData((prev) => ({
        ...prev,
        endereco: "",
        bairro: "",
        cidade: "",
        estado: "",
      }));
    } finally {
      setCepLoading(false);
    }
  };

  // --- NOVO USEEFFECT PARA OBSERVAR O CEP ---
  useEffect(() => {
    const cepLimpo = formData.cep.replace(/\D/g, ""); // Remove máscara

    if (cepLimpo.length === 8) {
      fetchCep(cepLimpo);
    } else {
      // Limpa erro se o CEP for apagado/incompleto
      setCepError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.cep]); // Dispara toda vez que o CEP mudar

  // --- FUNÇÃO HELPER ---
const atualizarItemNoCarrinhoAPI = async (produto: Produto, novaQuantidade: number) => {
  try {
    const response = await fetch(`/api/pedido`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: produto.id,
        quantidade: novaQuantidade,
      }),
    });

    if (!response.ok) throw new Error("Falha ao atualizar item na API");
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar item:", error);
  }
};

  // --- HANDLERS ---
  const handleAtualizarQuantidade = (id: number, novaQuantidadeStr: string) => {
    const novaQuantidade = Math.max(0, parseInt(novaQuantidadeStr) || 0);
    const produtoParaAtualizar = produtos.find((p) => p.id === id);

    if (!produtoParaAtualizar) return;

    const novosProdutos = produtos
      .map((p) => (p.id === id ? { ...p, quantidade: novaQuantidade } : p))
      .filter((p) => p.quantidade > 0);

    setProdutos(novosProdutos);
    atualizarItemNoCarrinhoAPI(produtoParaAtualizar, novaQuantidade);
  };

  const handleLimparCarrinho = async () => {
    try {
      const response = await fetch("/api/pedido", { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Falha ao limpar o carrinho na API");
      }
      setProdutos([]);
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  // --- NOVAS FUNÇÕES DE FORMATAÇÃO (MÁSCARA) ---
  // MÁSCARA DO TELEFONE ATUALIZADA (com Regex)
  const formatTelefone = (value: string) => {
    let v = value.replace(/\D/g, "");
    v = v.slice(0, 11); // Max 11 dígitos

    if (v.length <= 10) {
      // Fixo (XX)XXXX-XXXX
      v = v.replace(/(\d{2})(\d)/, "($1)$2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      // Celular (XX)XXXXX-XXXX
      v = v.replace(/(\d{2})(\d)/, "($1)$2");
      v = v.replace(/(\d{5})(\d)/, "$1-$2"); // (XX)XXXXX-XXXX
    }
    return v;
  };

  const formatCEP = (value: string) => {
    let v = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    v = v.slice(0, 8); // Limita a 8 dígitos XXXXX-XXX
    if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
    return v;
  };

  // --- NOVO HANDLER UNIFICADO PARA O FORMULÁRIO ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplica formatação condicional
    switch (name) {
      case "telefone":
        formattedValue = formatTelefone(value);
        break;
      case "cep":
        formattedValue = formatCEP(value);
        break;
      case "estado":
        formattedValue = value.toUpperCase().slice(0, 2); // Caixa alta e 2 chars
        break;
      case "num":
        formattedValue = value.replace(/\D/g, "").slice(0, 6); // Apenas números
        break;
      case "nomeCompleto":
        formattedValue = value.slice(0, 100); // Limita nome
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // --- FUNÇÕES DE CÁLCULO E SUBMISSÃO ---
  const calcularTotal = () => {
    return produtos
      .reduce((total, p) => total + (p.preco || 0) * (p.quantidade || 0), 0)
      .toFixed(2);
  };

  const handleFinalizarPedido2 = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      console.log("Enviando pedido para o backend...", {
        produtos,
        dadosEntrega: formData,
      });
      // (Lógica de enviar pedido...)

      // Limpa o carrinho na API
      const response = await fetch("/api/pedido", { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao limpar o carrinho na API");

      setProdutos([]);
      // Reseta o formulário
      setFormData({
        nomeCompleto: "",
        telefone: "",
        cep: "",
        endereco: "",
        num: "",
        // complemento: "", // REMOVIDO
        bairro: "",
        cidade: "",
        estado: "",
      });
      // alert("Obrigado pelo seu pedido!");
    } catch (error) {
      console.error("Erro ao finalizar o pedido:", error);
      // alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  };

  return (
    // Usado classes do bootstrap para um fundo leve
    <Container className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      {/* --- TAG DE ESTILO ADICIONADA --- */}
      <style>{`
        /* Re-criando o estilo do botão laranja */
        .btn-finalizar-laranja {
          background-color: #f7941e; /* Laranja vibrante */
          border-color: #f7941e;
          color: #ffffff;
          font-weight: 500;
        }
        .btn-finalizar-laranja:hover {
          background-color: #e6861c;
          border-color: #e6861c;
          color: #ffffff;
        }
        .btn-finalizar-laranja:disabled {
          background-color: #f7b061;
          border-color: #f7b061;
        }

        /* Estilos do card que o import 'styles' provavelmente fazia */
        .card-custom {
          border: 1px solid #dee2e6;
          border-radius: 0.375rem; /* .rounded-md */
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* .shadow-sm */
          overflow: hidden; /* Garante que o header arredondado funcione */
        }
        .card-header-custom {
          background-color: #ffffff; /* Fundo branco */
          border-bottom: 1px solid #dee2e6;
        }

        /* Estilo da imagem (que estava inline) */
        .img-produto-checkout {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.375rem;
        }

        /* Estilo do total (que estava inline) */
        .div-total-checkout {
          text-align: right;
          font-size: 1.25rem; /* fs-5 */
          font-weight: 700; /* fw-bold */
          margin-top: 1rem; /* mt-3 */
        }
      `}</style>

      {/* --- BOTÃO VOLTAR --- */}
      <Button
        variant="link"
        onClick={() => (window.location.href = "/produtos")}
        className="d-flex align-items-center p-0 mb-3 text-secondary text-decoration-none"
      >
        <ArrowLeft size={18} className="me-2" />
        Voltar para Produtos
      </Button>

      <h1 className="mb-4">🛒 Checkout</h1>
      <Row className="g-4">
        {/* 🧾 Lista de Produtos */}
        <Col lg={7} xl={8} className="d-flex">
          <Card className="w-100 card-custom">
            <Card.Header
              as="h5"
              className="d-flex justify-content-between align-items-center card-header-custom"
            >
              Produtos Escolhidos
              {produtos.length > 0 && (
                <Button
                  variant="danger"
                  onClick={handleLimparCarrinho}
                  className="d-flex align-items-center"
                >
                  <Trash2 size={16} className="me-2" />
                  Esvaziar Carrinho
                </Button>
              )}
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <div className="table-responsive flex-grow-1">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Imagem</th>
                      <th>Produto</th>
                      <th className="text-center">Unidade</th>
                      <th style={{ width: "120px" }} className="text-center">
                        Qtd. Total
                      </th>
                      <th className="text-end">Preço Unitário</th>
                      <th className="text-end">Preço Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          Seu carrinho está vazio.
                        </td>
                      </tr>
                    ) : (
                      produtos.map((produto: Produto) => (
                        <tr key={produto.id}>
                          <td>
                            <img
                              src={`${produto.imagem}`}
                              alt={produto.nome || "Produto"}
                              className="img-produto-checkout"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src =
                                  "https://placehold.co/60x60/e2e8f0/64748b?text=?";
                                target.alt = "Imagem indisponível";
                              }}
                            />
                          </td>
                          <td className="fw-medium">{produto.nome || "-"}</td>
                          <td className="text-center">
                            {produto.unidade || "-"}
                          </td>
                          <td
                            style={{ minWidth: "100px" }}
                            className="text-center"
                          >
                            <Form.Control
                              type="number"
                              size="sm"
                              value={produto.quantidade}
                              onChange={(e) =>
                                handleAtualizarQuantidade(
                                  produto.id,
                                  e.target.value
                                )
                              }
                              min={0}
                              className="text-center"
                              aria-label="Quantidade total"
                            />
                          </td>
                          <td className="text-end">
                            R$ {(produto.preco || 0).toFixed(2)}
                          </td>
                          <td className="text-end fw-bold">
                            R${" "}
                            {(
                              (produto.preco || 0) * (produto.quantidade || 0)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              {produtos.length > 0 && (
                <div className="div-total-checkout">
                  <strong>Total Geral:</strong> R$ {calcularTotal()}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* 🚚 Dados de Entrega (FORMULÁRIO ATUALIZADO) */}
        <Col lg={5} xl={4} className="d-flex">
          <Card className="w-100 card-custom">
            <Card.Header as="h5" className="card-header-custom">
              Dados de Entrega
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleFinalizarPedido2}>
                <Form.Group className="mb-3" controlId="nomeCompleto">
                  <Form.Label className="fw-medium">Nome Completo:</Form.Label>
                  <Form.Control
                    type="text"
                    // placeholder="Digite seu nome" // REMOVIDO
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="telefone">
                  <Form.Label className="fw-medium">
                    Telefone (WhatsApp):
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    // placeholder="(XX) XXXXX-XXXX" // REMOVIDO
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleFormChange}
                    maxLength={15}
                    required
                  />
                </Form.Group>

                <hr className="my-4" />

                <Form.Group className="mb-3" controlId="cep">
                  <Form.Label className="fw-medium">CEP:</Form.Label>
                  <Form.Control
                    type="text"
                    // placeholder="XXXXX-XXX" // REMOVIDO
                    name="cep"
                    value={formData.cep}
                    onChange={handleFormChange}
                    maxLength={9}
                    required
                  />
                  {/* FEEDBACK DA API DE CEP */}
                  {cepLoading && (
                    <Spinner
                      animation="border"
                      size="sm"
                      className="ms-2"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  <Form.Text className="text-danger">{cepError}</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="endereco">
                  <Form.Label className="fw-medium">
                    Endereço (Rua/Av.):
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleFormChange}
                    required
                    disabled={cepLoading}
                    readOnly={cepLoading}
                  />
                </Form.Group>

                <Row>
                  <Col xs={12}> {/* Coluna ajustada para 12 */}
                    <Form.Group className="mb-3" controlId="num">
                      <Form.Label className="fw-medium">Número:</Form.Label>
                      <Form.Control
                        type="text"
                        // placeholder="Nº" // REMOVIDO
                        name="num"
                        value={formData.num}
                        onChange={handleFormChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  {/* Coluna de Complemento removida */}
                </Row>

                <Form.Group className="mb-3" controlId="bairro">
                  <Form.Label className="fw-medium">Bairro:</Form.Label>
                  <Form.Control
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleFormChange}
                    required
                    disabled={cepLoading}
                    readOnly={cepLoading}
                  />
                </Form.Group>

                <Row>
                  <Col xs={8}>
                    <Form.Group className="mb-3" controlId="cidade">
                      <Form.Label className="fw-medium">Cidade:</Form.Label>
                      <Form.Control
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleFormChange}
                        required
                        disabled={cepLoading}
                        readOnly={cepLoading}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={4}>
                    <Form.Group className="mb-3" controlId="estado">
                      <Form.Label className="fw-medium">Estado:</Form.Label>
                      <Form.Control
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleFormChange}
                        maxLength={2}
                        required
                        disabled={cepLoading}
                        readOnly={cepLoading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  size="lg"
                  type="submit"
                  className="w-100 mt-2 btn-finalizar-laranja" // Classe do botão laranja
                  disabled={produtos.length === 0}
                >
                  Finalizar Pedido
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}