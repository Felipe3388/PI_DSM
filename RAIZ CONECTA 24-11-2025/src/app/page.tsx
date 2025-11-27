"use client";

import Image from "next/image";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Leaf, Truck, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">

      {/* ================= HERO (INICIO) ================= */}
      <section className="py-20 lg:py-32" id="inicio">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-5 mb-md-0">
              <h1 className="fw-bold display-4 text-green-800 mb-4 tracking-tight">
                Tecnologia <br />
                <span className="text-green-600">Da Raiz ao Fruto</span>
              </h1>

              <h3 className="text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-4">
                Uma plataforma digital que otimiza a cadeia de suprimentos de
                alimentos. Conectando produtores e mercados para
                facilitar o acesso a alimentos frescos em um só lugar.
              </h3>

              <div className="d-flex gap-3 justify-content-center justify-content-md-start mt-8">
                <Button
                  variant="success"
                  size="lg"
                  href="/login"
                  className="px-4 py-2 shadow-lg hover:scale-105 transition-transform"
                >
                  Começar Agora
                </Button>

                <Button
                  as="a"
                  href="#sobre"
                  variant="outline-success"
                  size="lg"
                  className="px-4 py-2 bg-white/50 backdrop-blur-sm border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
                >
                  Saiba Mais
                </Button>
              </div>
            </Col>

            <Col md={6} className="text-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 transform hover:rotate-1 transition-all duration-500">
                <Image
                  src="/HORTA.jpg"
                  alt="Produtor rural em uma horta"
                  width={800}
                  height={600}
                  className="img-fluid object-cover h-full w-full"
                  priority
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= SOBRE ================= */}
      <section className="py-20" id="sobre">
        <Container>
          {/* Este container interno mantém o fundo branco/vidro, criando o efeito de flutuação */}
          <div className="bg-white/80 backdrop-blur-md p-6 p-md-5 rounded-[2.5rem] shadow-lg border border-white/60">
            <h2 className="text-center fw-bold text-green-700 mb-5 text-2xl md:text-3xl mt-4">
              Revolucionando o caminho do hortifruti até você.
            </h2>

            <Row className="align-items-center">
              <Col md={6}>
                <div className="pe-md-4 p-4">
                  <h4 className="fw-bold text-green-800 mb-3 flex items-center gap-2">
                    <Leaf size={24} className="text-green-500" />
                    Nossa Missão
                  </h4>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    A missão do <strong>Raiz Conecta</strong> é aproximar
                    produtores e compradores, facilitando negociações diretas,
                    diminuindo o desperdício de alimentos e promovendo preços mais
                    justos e sustentáveis.
                  </p>

                  <ul className="space-y-3 list-none pl-0 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Produtores:</strong> Redução de desperdício e venda direta.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Mercados:</strong> Produtos frescos e logística otimizada.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Consumidores:</strong> Transparência e qualidade na mesa.</span>
                    </li>
                  </ul>
                </div>
              </Col>

              <Col md={6} className="text-center mt-5 mt-md-0 mb-4">
                <div className="rounded-2xl overflow-hidden shadow-md mx-auto w-full max-w-md">
                  <Image
                    src="/Colheita.jpg"
                    alt="Mãos segurando uma colheita"
                    width={600}
                    height={400}
                    className="img-fluid object-cover w-full h-full"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* ================= FUNCIONALIDADES ================= */}
      <section className="py-20" id="funcionalidades">
        <Container>
          <h2 className="text-center fw-bold text-green-800 mb-3 text-3xl">
            Funcionalidades Principais
          </h2>

          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
            Conectando todos os elos da cadeia de hortifruti com tecnologia de ponta.
          </p>

          <Row xs={1} md={3} className="g-4">
            {[
              { icon: Leaf, title: "Sustentabilidade", text: "Reduza desperdícios e promova um consumo mais consciente." },
              { icon: Truck, title: "Logística Eficiente", text: "Entregas rápidas e integradas entre produtores e mercados." },
              { icon: TrendingUp, title: "Transparência", text: "Sistema de avaliação e controle de qualidade integrado." }
            ].map((item, idx) => (
              <Col key={idx}>
                <Card className="h-100 border-white/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/70 backdrop-blur-sm text-center py-4 rounded-2xl">
                  <Card.Body className="flex flex-col items-center">
                    <div className="p-3 bg-green-100 rounded-full mb-4 text-green-600 shadow-inner">
                      <item.icon size={32} />
                    </div>
                    <Card.Title className="fw-bold text-gray-800 mb-3">{item.title}</Card.Title>
                    <Card.Text className="text-gray-500 px-3">
                      {item.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= COMO FUNCIONA ================= */}
      <section className="py-20 mb-10" id="como-funciona">
        <Container>
          <h2 className="text-center fw-bold text-green-800 mb-3 text-3xl">
            Como Funciona
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Processo simples em 3 passos
          </p>
            <h1> </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Cadastre-se", desc: "Crie sua conta como produtor ou mercado em poucos cliques." },
              { step: "2", title: "Conecte-se", desc: "Encontre parceiros locais e inicie negociações diretas na plataforma." },
              { step: "3", title: "Negocie", desc: "Feche negócios com transparência, agilidade e segurança." }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white/80 backdrop-blur p-8 rounded-3xl shadow-lg border-b-4 border-green-400 text-center hover:bg-white transition-colors">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 text-white font-bold text-xl flex items-center justify-center rounded-full shadow-lg ring-4 ring-green-100">
                  {item.step}
                </div>
                <h3 className="mt-6 font-bold text-xl text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}