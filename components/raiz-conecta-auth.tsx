"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

// Tipos de conta disponíveis para cadastro
type AccountType = "produtor" | "mercado" | ""

// Interface para os dados do formulário de cadastro
interface FormData {
  // Campos comuns para ambos os tipos de conta
  email: string
  password: string
  confirmPassword: string
  accountType: AccountType

  // Campos específicos para produtores
  producerName: string
  cpf: string
  producerCep: string
  producerCountry: string
  producerState: string
  producerCity: string
  producerNeighborhood: string
  producerStreet: string
  producerNumber: string

  // Campos específicos para mercados
  marketName: string
  cnpj: string
  marketCep: string
  marketCountry: string
  marketState: string
  marketCity: string
  marketNeighborhood: string
  marketStreet: string
  marketNumber: string
}

/**
 * Componente principal de autenticação do Raiz Conecta
 * Gerencia login e cadastro de produtores e mercados
 * Inclui validação de formulários e máscaras para CPF, CNPJ e CEP
 */
export default function RaizConectaAuth() {
  const router = useRouter()

  // Estado para controlar qual aba está ativa (login ou cadastro)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  // Estado para dados do formulário de login
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  // Estado para dados do formulário de cadastro
  const [registerData, setRegisterData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
    producerName: "",
    cpf: "",
    producerCep: "",
    producerCountry: "Brasil",
    producerState: "",
    producerCity: "",
    producerNeighborhood: "",
    producerStreet: "",
    producerNumber: "",
    marketName: "",
    cnpj: "",
    marketCep: "",
    marketCountry: "Brasil",
    marketState: "",
    marketCity: "",
    marketNeighborhood: "",
    marketStreet: "",
    marketNumber: "",
  })

  // Estado para mensagens de feedback ao usuário
  const [message, setMessage] = useState({ text: "", type: "" })

  /**
   * Função para aplicar máscara de CPF
   * Formata o CPF no padrão 000.000.000-00
   */
  const maskCpf = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 11)
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  /**
   * Função para aplicar máscara de CNPJ
   * Formata o CNPJ no padrão 00.000.000/0000-00
   */
  const maskCnpj = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 14)
    return v
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }

  /**
   * Função para aplicar máscara de CEP
   * Formata o CEP no padrão 00000-000
   */
  const maskCep = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 8)
    return v.length > 5 ? v.replace(/^(\d{5})(\d{1,3})$/, "$1-$2") : v
  }

  /**
   * Função para voltar à página principal
   */
  const goToHome = () => {
    router.push("/")
  }

  /**
   * Função para processar o login do usuário
   * Valida os campos e simula o processo de autenticação
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica dos campos obrigatórios
    if (!loginData.email || !loginData.password) {
      setMessage({ text: "Preencha todos os campos.", type: "error" })
      return
    }

    // Simula processo de login bem-sucedido
    setMessage({ text: "Login simulado! Redirecionando...", type: "success" })
    setTimeout(() => {
      setMessage({ text: "", type: "" })
      // Aqui seria implementada a lógica real de redirecionamento
    }, 1200)
  }

  /**
   * Função para processar o cadastro do usuário
   * Valida todos os campos obrigatórios baseado no tipo de conta
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const { accountType, email, password, confirmPassword } = registerData

    // Validação dos campos básicos
    if (!accountType || !email || !password || !confirmPassword) {
      setMessage({ text: "Preencha todos os campos obrigatórios.", type: "error" })
      return
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      setMessage({ text: "As senhas não coincidem.", type: "error" })
      return
    }

    // Validação específica para produtores
    if (accountType === "produtor") {
      const requiredFields = [
        "producerName",
        "cpf",
        "producerCep",
        "producerCountry",
        "producerState",
        "producerCity",
        "producerNeighborhood",
        "producerStreet",
        "producerNumber",
      ]
      const hasEmptyFields = requiredFields.some((field) => !registerData[field as keyof FormData])
      if (hasEmptyFields) {
        setMessage({ text: "Preencha todos os campos obrigatórios.", type: "error" })
        return
      }
    }

    // Validação específica para mercados
    if (accountType === "mercado") {
      const requiredFields = [
        "marketName",
        "cnpj",
        "marketCep",
        "marketCountry",
        "marketState",
        "marketCity",
        "marketNeighborhood",
        "marketStreet",
        "marketNumber",
      ]
      const hasEmptyFields = requiredFields.some((field) => !registerData[field as keyof FormData])
      if (hasEmptyFields) {
        setMessage({ text: "Preencha todos os campos obrigatórios.", type: "error" })
        return
      }
    }

    // Simula processo de cadastro bem-sucedido
    setMessage({ text: "Cadastro simulado! Redirecionando...", type: "success" })
    setTimeout(() => {
      setMessage({ text: "", type: "" })
      // Aqui seria implementada a lógica real de redirecionamento
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-lime-100 to-green-200 relative">
      {/* Overlay de fundo escuro */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Cabeçalho com link para voltar à página principal */}
      <header className="bg-green-700 text-white text-center py-6 rounded-b-3xl shadow-lg relative z-10">
        <div className="container mx-auto px-4">
          <button
            onClick={goToHome}
            className="text-white font-bold text-xl hover:text-orange-400 transition-colors underline focus:outline-none focus:ring-2 focus:ring-orange-400 rounded px-2 py-1"
          >
            Raiz Conecta
          </button>
        </div>
      </header>

      {/* Conteúdo principal com layout de duas colunas */}
      <main className="flex justify-start items-start min-h-[70vh] relative z-10 max-w-7xl mx-auto mt-12 mb-12">
        {/* Coluna esquerda - Formulário de autenticação */}
        <div className="flex-none w-[480px] flex flex-col items-start justify-start min-h-screen ml-[7vw] z-10 mt-8 mb-8">
          <Card className="bg-white rounded-3xl shadow-2xl p-9 max-w-[480px] w-full mx-4 animate-in fade-in-0 slide-in-from-bottom-10 duration-700">
            <CardContent className="p-0">
              {/* Abas para alternar entre Login e Cadastro */}
              <div className="flex justify-center mb-6 gap-2">
                <Button
                  variant={activeTab === "login" ? "default" : "ghost"}
                  className={`text-lg font-bold px-7 py-2 rounded-t-3xl rounded-b-none ${
                    activeTab === "login"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                  onClick={() => {
                    setActiveTab("login")
                    setMessage({ text: "", type: "" })
                  }}
                >
                  Entrar
                </Button>
                <Button
                  variant={activeTab === "register" ? "default" : "ghost"}
                  className={`text-lg font-bold px-7 py-2 rounded-t-3xl rounded-b-none ${
                    activeTab === "register"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                  onClick={() => {
                    setActiveTab("register")
                    setMessage({ text: "", type: "" })
                  }}
                >
                  Cadastrar
                </Button>
              </div>

              {/* Seção de Login */}
              {activeTab === "login" && (
                <div className="animate-in fade-in-0 duration-500">
                  <h2 className="text-green-700 text-center text-3xl font-bold mb-5">Login</h2>
                  <form onSubmit={handleLogin} className="flex flex-col gap-4 items-center">
                    {/* Campo de e-mail */}
                    <div className="w-full">
                      <Label htmlFor="login-email" className="font-semibold text-gray-700 mb-1 block">
                        E-mail
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                        className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                        required
                        autoComplete="username"
                      />
                    </div>

                    {/* Campo de senha */}
                    <div className="w-full">
                      <Label htmlFor="login-password" className="font-semibold text-gray-700 mb-1 block">
                        Senha
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                        className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                        required
                        autoComplete="current-password"
                      />
                    </div>

                    {/* Botão de login */}
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-700 to-orange-500 text-white border-none rounded-3xl py-4 text-lg font-bold cursor-pointer mt-2 w-full hover:from-orange-500 hover:to-green-700 hover:scale-105 transition-all"
                    >
                      Entrar
                    </Button>
                  </form>

                  {/* Área de mensagens de feedback */}
                  <div
                    className={`text-center mt-3 font-bold text-base min-h-6 ${
                      message.type === "success" ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {activeTab === "login" ? message.text : ""}
                  </div>

                  {/* Botão para alternar para cadastro */}
                  <Button
                    variant="outline"
                    className="block mx-auto mt-4 bg-orange-500 text-white border-none rounded-full px-7 py-2 text-base font-semibold cursor-pointer hover:bg-green-700 hover:scale-105 transition-all"
                    onClick={() => setActiveTab("register")}
                  >
                    Não tem conta? Cadastre-se
                  </Button>
                </div>
              )}

              {/* Seção de Cadastro */}
              {activeTab === "register" && (
                <div className="animate-in fade-in-0 duration-500">
                  <h2 className="text-green-700 text-center text-3xl font-bold mb-5">Cadastro</h2>
                  <form onSubmit={handleRegister} className="flex flex-col gap-4 items-center">
                    {/* Seleção do tipo de conta */}
                    <div className="w-full">
                      <Label htmlFor="account-type" className="font-semibold text-gray-700 mb-1 block">
                        Tipo de Conta
                      </Label>
                      <Select
                        value={registerData.accountType}
                        onValueChange={(value: AccountType) =>
                          setRegisterData((prev) => ({ ...prev, accountType: value }))
                        }
                      >
                        <SelectTrigger className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="produtor">Produtor</SelectItem>
                          <SelectItem value="mercado">Mercado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Campos específicos para Produtores */}
                    {registerData.accountType === "produtor" && (
                      <div className="w-full space-y-4 animate-in fade-in-0 duration-500">
                        {/* Nome completo do produtor */}
                        <div>
                          <Label className="font-semibold text-gray-700 mb-1 block">Nome Completo</Label>
                          <Input
                            value={registerData.producerName}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, producerName: e.target.value }))}
                            className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                            autoComplete="name"
                          />
                        </div>

                        {/* CPF com máscara */}
                        <div>
                          <Label className="font-semibold text-gray-700 mb-1 block">CPF</Label>
                          <Input
                            value={registerData.cpf}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, cpf: maskCpf(e.target.value) }))}
                            className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                            placeholder="000.000.000-00"
                            maxLength={14}
                          />
                        </div>

                        {/* Linha com CEP e País */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">CEP</Label>
                            <Input
                              value={registerData.producerCep}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, producerCep: maskCep(e.target.value) }))
                              }
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="00000-000"
                              maxLength={9}
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">País</Label>
                            <Input
                              value={registerData.producerCountry}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, producerCountry: e.target.value }))
                              }
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Brasil"
                            />
                          </div>
                        </div>

                        {/* Linha com Estado e Cidade */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Estado</Label>
                            <Input
                              value={registerData.producerState}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, producerState: e.target.value }))}
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="UF"
                              maxLength={2}
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Cidade</Label>
                            <Input
                              value={registerData.producerCity}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, producerCity: e.target.value }))}
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Cidade"
                            />
                          </div>
                        </div>

                        {/* Linha com Bairro e Rua */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Bairro</Label>
                            <Input
                              value={registerData.producerNeighborhood}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, producerNeighborhood: e.target.value }))
                              }
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Bairro"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Rua</Label>
                            <Input
                              value={registerData.producerStreet}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, producerStreet: e.target.value }))}
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Rua"
                            />
                          </div>
                        </div>

                        {/* Número do endereço */}
                        <div>
                          <Label className="font-semibold text-gray-700 mb-1 block">Número</Label>
                          <Input
                            value={registerData.producerNumber}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, producerNumber: e.target.value }))}
                            className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                            placeholder="Número"
                          />
                        </div>
                      </div>
                    )}

                    {/* Campos específicos para Mercados */}
                    {registerData.accountType === "mercado" && (
                      <div className="w-full space-y-4 animate-in fade-in-0 duration-500">
                        {/* Nome do mercado */}
                        <div>
                          <Label className="font-semibold text-gray-700 mb-1 block">Nome do Mercado</Label>
                          <Input
                            value={registerData.marketName}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, marketName: e.target.value }))}
                            className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                            autoComplete="organization"
                          />
                        </div>

                        {/* CNPJ com máscara */}
                        <div>
                          <Label className="font-semibold text-gray-700 mb-1 block">CNPJ</Label>
                          <Input
                            value={registerData.cnpj}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, cnpj: maskCnpj(e.target.value) }))}
                            className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                          />
                        </div>

                        {/* Linha com CEP e País */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">CEP</Label>
                            <Input
                              value={registerData.marketCep}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, marketCep: maskCep(e.target.value) }))
                              }
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="00000-000"
                              maxLength={9}
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">País</Label>
                            <Input
                              value={registerData.marketCountry}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, marketCountry: e.target.value }))}
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Brasil"
                            />
                          </div>
                        </div>

                        {/* Linha com Estado e Cidade */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Estado</Label>
                            <Input
                              value={registerData.marketState}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, marketState: e.target.value }))}
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="UF"
                              maxLength={2}
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Cidade</Label>
                            <Input
                              value={registerData.marketCity}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, marketCity: e.target.value }))}
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Cidade"
                            />
                          </div>
                        </div>

                        {/* Linha com Bairro e Rua */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Bairro</Label>
                            <Input
                              value={registerData.marketNeighborhood}
                              onChange={(e) =>
                                setRegisterData((prev) => ({ ...prev, marketNeighborhood: e.target.value }))
                              }
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Bairro"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="font-semibold text-gray-700 mb-1 block">Rua</Label>
                            <Input
                              value={registerData.marketStreet}
                              onChange={(e) => setRegisterData((prev) => ({ ...prev, marketStreet: e.target.value }))}
                              className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                              placeholder="Rua"
                            />
                          </div>
                        </div>

                        {/* Número do endereço */}
                        <div>
                          <Label className="font-semibold text-gray-700 mb-1 block">Número</Label>
                          <Input
                            value={registerData.marketNumber}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, marketNumber: e.target.value }))}
                            className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                            placeholder="Número"
                          />
                        </div>
                      </div>
                    )}

                    {/* Campos comuns: E-mail e Senhas */}
                    <div className="w-full">
                      <Label className="font-semibold text-gray-700 mb-1 block">E-mail</Label>
                      <Input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                        className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="w-full">
                      <Label className="font-semibold text-gray-700 mb-1 block">Senha</Label>
                      <Input
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                        className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="w-full">
                      <Label className="font-semibold text-gray-700 mb-1 block">Confirmar Senha</Label>
                      <Input
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="p-3 rounded-3xl border-2 border-green-200 bg-gray-50 text-base w-full focus:border-green-700"
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    {/* Botão de cadastro */}
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-700 to-orange-500 text-white border-none rounded-3xl py-4 text-lg font-bold cursor-pointer mt-2 w-full hover:from-orange-500 hover:to-green-700 hover:scale-105 transition-all"
                    >
                      Cadastrar
                    </Button>
                  </form>

                  {/* Área de mensagens de feedback */}
                  <div
                    className={`text-center mt-3 font-bold text-base min-h-6 ${
                      message.type === "success" ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {activeTab === "register" ? message.text : ""}
                  </div>

                  {/* Botão para alternar para login */}
                  <Button
                    variant="outline"
                    className="block mx-auto mt-4 bg-orange-500 text-white border-none rounded-full px-7 py-2 text-base font-semibold cursor-pointer hover:bg-green-700 hover:scale-105 transition-all"
                    onClick={() => setActiveTab("login")}
                  >
                    Já tem conta? Entrar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita - Logo da empresa */}
        <div className="flex-1 flex items-start justify-end min-h-screen relative z-0 mt-8 mb-8">
          <div className="flex justify-end items-start w-full h-full pt-15 pr-[8vw] relative z-0">
            <div className="w-56 h-56 rounded-full bg-white/10 backdrop-blur-sm shadow-2xl flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                RAIZ
                <br />
                CONECTA
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé da página */}
      <footer className="bg-green-700 text-white text-center py-5 relative z-10">
        Raiz Conecta ©2025 — Projeto acadêmico Fatec
      </footer>
    </div>
  )
}
