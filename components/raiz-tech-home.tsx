"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, ShoppingCart, TrendingUp, Headphones } from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * Componente da página principal do RaizTech
 * Apresenta informações sobre a empresa, serviços oferecidos e call-to-action
 * Inclui navegação suave entre seções e redirecionamento para página de login
 */
export default function RaizTechHome() {
  const router = useRouter()

  /**
   * Função para navegar suavemente para uma seção específica da página
   * @param sectionId - ID da seção para onde navegar
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  /**
   * Função para redirecionar para a página de login com transição suave
   */
  const goToLogin = () => {
    // Adiciona transição suave antes de navegar
    document.body.style.transition = "opacity 0.4s"
    document.body.style.opacity = "0"
    setTimeout(() => {
      router.push("/login")
    }, 400)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-lime-100 to-green-200 relative">
      {/* Overlay de fundo com efeito blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none" />

      {/* Cabeçalho profissional com navegação - fundo sólido para garantir contraste */}
      <header className="bg-green-800 text-white rounded-b-3xl shadow-2xl relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-7 flex-wrap gap-4">
            {/* Logo e título da empresa */}
            <div className="flex items-center gap-5">
              <div className="w-15 h-15 rounded-full border-3 border-orange-500 bg-white flex items-center justify-center overflow-hidden shadow-lg hover:scale-110 hover:rotate-3 transition-transform duration-200">
                <img
                  src="/logo-agricultura-sustent-vel.jpg"
                  alt="Logo RaizTech"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold tracking-wider font-montserrat text-white drop-shadow-lg hover:text-orange-300 transition-colors duration-200 cursor-pointer">
                RaizTech
              </h1>
            </div>

            {/* Menu de navegação principal */}
            <nav className="flex gap-8 items-center bg-green-900/90 px-6 py-2 rounded-xl shadow-lg">
              <button
                onClick={() => scrollToSection("about")}
                className="text-white font-semibold text-lg px-5 py-2 rounded-lg hover:bg-orange-500 hover:text-green-900 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Sobre Nós
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-white font-semibold text-lg px-5 py-2 rounded-lg hover:bg-orange-500 hover:text-green-900 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollToSection("cta")}
                className="text-white font-semibold text-lg px-5 py-2 rounded-lg hover:bg-orange-500 hover:text-green-900 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Contato
              </button>
            </nav>

            {/* Botão de login no cabeçalho */}
            <Button
              onClick={goToLogin}
              className="bg-orange-500 text-green-900 border-none rounded-lg px-8 py-3 text-lg font-bold hover:bg-orange-400 hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <span className="material-icons">login</span>
              Entrar
            </Button>
          </div>

          {/* Barra decorativa colorida */}
          <div className="w-full h-2 bg-gradient-to-r from-orange-500 to-green-700 rounded-b-xl mb-2 shadow-lg" />

          <p className="text-center text-xl text-orange-200 font-semibold mb-5 tracking-wide drop-shadow-md bg-green-900/50 py-3 rounded-lg">
            Conectando pequenos agricultores a mercados locais com tecnologia, confiança e inovação.
          </p>
        </div>
      </header>

      {/* Conteúdo principal da página */}
      <main className="max-w-6xl mx-auto mt-12 mb-12 px-4 flex flex-col gap-6 relative z-10">
        {/* Seção Sobre Nós com efeito glassmorphism */}
        <section
          id="about"
          className="flex items-start gap-6 bg-white/60 rounded-3xl shadow-2xl p-11 max-w-5xl mx-auto relative z-10 border-l-8 border-green-700 border-r-8 border-orange-500 backdrop-blur-xl border-t border-b border-white/30"
        >
          {/* Imagem da equipe/empresa */}
          <img
            src="/equipe-agricultura-tecnologia.jpg"
            alt="Equipe RaizTech"
            className="w-56 h-56 object-cover rounded-full border-4 border-orange-500 shadow-2xl bg-white hover:scale-105 hover:rotate-2 transition-transform duration-200"
          />

          {/* Descrição institucional detalhada */}
          <div className="text-lg text-amber-900 leading-relaxed font-medium flex-1 pt-3">
            <strong className="text-xl">Quem somos?</strong>
            <br />A <b>RaizTech</b> nasceu do desejo de transformar a relação entre pequenos agricultores e mercados
            locais, promovendo uma rede colaborativa e sustentável. Nossa equipe é formada por especialistas apaixonados
            por tecnologia, inovação e desenvolvimento rural.
            <br />
            <br />
            <b>Missão:</b> Facilitar o acesso de produtores a oportunidades de negócio, valorizando o trabalho rural e
            incentivando o consumo de alimentos frescos e saudáveis.
            <br />
            <b>Visão:</b> Ser referência nacional em soluções digitais para o agronegócio familiar.
            <br />
            <b>Valores:</b> Ética, transparência, sustentabilidade e compromisso com o desenvolvimento local.
          </div>
        </section>

        {/* Seção de Serviços com cards interativos */}
        <section
          id="services"
          className="bg-white/70 rounded-3xl shadow-xl p-10 my-9 relative z-10 border-t-6 border-green-700 border-b-6 border-orange-500 backdrop-blur-xl border-l border-r border-white/25"
        >
          <h2 className="text-green-700 text-3xl font-bold text-center mb-6 tracking-wide">Nossos Serviços</h2>

          {/* Grid de cards de serviços */}
          <div className="flex flex-wrap gap-8 justify-center mt-6">
            {/* Card 1: Rede de Conexão */}
            <Card className="bg-white/90 rounded-3xl shadow-2xl border-3 border-orange-500 p-7 text-center w-64 min-h-48 hover:shadow-3xl hover:border-green-700 hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-sm">
              <CardContent className="p-0 flex flex-col items-center">
                <Users className="text-5xl text-green-700 mb-2 drop-shadow-lg hover:text-orange-500 transition-colors duration-200" />
                <div className="text-lg font-bold text-amber-800 mb-1 tracking-wide">Rede de Conexão</div>
                <div className="text-base text-amber-700">
                  Unimos agricultores, comerciantes e consumidores em uma plataforma colaborativa.
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Marketplace Local */}
            <Card className="bg-white/90 rounded-3xl shadow-2xl border-3 border-orange-500 p-7 text-center w-64 min-h-48 hover:shadow-3xl hover:border-green-700 hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-sm">
              <CardContent className="p-0 flex flex-col items-center">
                <ShoppingCart className="text-5xl text-green-700 mb-2 drop-shadow-lg hover:text-orange-500 transition-colors duration-200" />
                <div className="text-lg font-bold text-amber-800 mb-1 tracking-wide">Marketplace Local</div>
                <div className="text-base text-amber-700">
                  Facilitamos a venda direta de produtos frescos, promovendo economia e qualidade.
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Consultoria Digital */}
            <Card className="bg-white/90 rounded-3xl shadow-2xl border-3 border-orange-500 p-7 text-center w-64 min-h-48 hover:shadow-3xl hover:border-green-700 hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-sm">
              <CardContent className="p-0 flex flex-col items-center">
                <TrendingUp className="text-5xl text-green-700 mb-2 drop-shadow-lg hover:text-orange-500 transition-colors duration-200" />
                <div className="text-lg font-bold text-amber-800 mb-1 tracking-wide">Consultoria Digital</div>
                <div className="text-base text-amber-700">
                  Apoiamos produtores na adoção de ferramentas tecnológicas para gestão e vendas.
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Suporte Personalizado */}
            <Card className="bg-white/90 rounded-3xl shadow-2xl border-3 border-orange-500 p-7 text-center w-64 min-h-48 hover:shadow-3xl hover:border-green-700 hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-sm">
              <CardContent className="p-0 flex flex-col items-center">
                <Headphones className="text-5xl text-green-700 mb-2 drop-shadow-lg hover:text-orange-500 transition-colors duration-200" />
                <div className="text-lg font-bold text-amber-800 mb-1 tracking-wide">Suporte Personalizado</div>
                <div className="text-base text-amber-700">
                  Equipe dedicada para orientar e solucionar dúvidas de nossos parceiros.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seção Call to Action (CTA) */}
        <section
          id="cta"
          className="bg-white/80 rounded-3xl shadow-2xl max-w-lg mx-auto p-9 flex flex-col items-center z-10 border-t-5 border-orange-500 backdrop-blur-xl border-b border-white/20"
        >
          <h2 className="text-green-700 text-2xl font-bold mb-5 text-center">Se interessou?</h2>

          {/* Botão principal de ação */}
          <Button
            onClick={goToLogin}
            className="bg-green-700 text-white border-none rounded-lg px-10 py-4 text-lg font-bold mt-2 hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-2xl flex items-center gap-3 tracking-wide focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span className="material-icons">touch_app</span>
            Clique aqui para acessar!
          </Button>

          {/* Nota informativa */}
          <div className="text-red-800 text-base mt-4 text-center flex items-center gap-2">
            <span className="material-icons text-lg">info</span>
            Ao clicar, você será direcionado para a área de acesso aos nossos serviços.
          </div>
        </section>
      </main>

      {/* Rodapé da página */}
      <footer className="bg-green-700 text-white text-center py-5 mt-6 rounded-t-3xl text-lg relative z-10 shadow-2xl">
        &copy; 2025 RaizTech. A ponte entre economia e sustentabilidade.
      </footer>
    </div>
  )
}
