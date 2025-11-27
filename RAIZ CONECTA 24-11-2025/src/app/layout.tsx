import type { Metadata } from "next";
// Voltar a usar next/font/google com fontes alternativas
import { Lato, Source_Code_Pro } from "next/font/google";
import "./globals.css";

// Importar componentes de layout (mantendo o alias @/)
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// Instanciar as fontes do Google Fonts
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // Pesos que vamos usar
  variable: "--font-lato", // Variável CSS para a fonte sans-serif
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "600"], // Pesos comuns para mono
  variable: "--font-source-code-pro", // Variável CSS para a fonte mono
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raiz Conecta",
  description: "Conectando produtores rurais a mercados locais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Aplicar as variáveis das novas fontes no HTML
    <html lang="pt-BR" className={`${lato.variable} ${sourceCodePro.variable}`}>
      <body
        // Layout flex e fonte padrão SANS (agora Lato)
        className="d-flex flex-column min-vh-100 font-sans"
      >
        <SiteHeader />
        <main className="flex-grow-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
