"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Tab, Tabs } from "react-bootstrap";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";
import { InputText } from "@/components/InputText";
import { InputPassword } from "@/components/InputPassword";
import { useFormik } from "formik";

import { loginSchema } from "@/schemas/LoginSchema"
import { registerSchema } from "@/schemas/RegisterSchema";

export default function Login() {
  const router = useRouter();
  const [key, setKey] = useState("login");
  const [cpfCnpjPlaceholder, setCpfCnpjPlaceholder] = useState("000.000.000-00");
  const [docLabel, setDocLabel] = useState("CPF");

  // --- FORMIK LOGIN ---
  const formikLogin = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const { username, password } = values;

      if (username === "mercadosecreto" && password === "segredo") {
        router.push("/produtos");
      } else if (username === "produtorsecreto" && password === "segredo") {
        router.push("/produtor");
      } else if (username === "admin" && password === "segredo") {
        router.push("/admin");
      } else {
        alert("Usuário ou senha incorretos.");
      }
    },
  });

  // --- FORMIK CADASTRO ---
  const formikRegister = useFormik({
    initialValues: {
      name: "",
      email: "",
      userType: "producer",
      cpfCnpj: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      alert(`Cadastro de ${values.name} realizado com sucesso! (Simulação)`);
      console.log(values);
      setKey("login");
      formikRegister.resetForm();
    },
  });

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formikRegister.handleChange(e);
    if (e.target.value === "market") {
      setDocLabel("CNPJ");
      setCpfCnpjPlaceholder("00.000.000/0000-00");
    } else {
      setDocLabel("CPF");
      setCpfCnpjPlaceholder("000.000.000-00");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 py-12 bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage: `url('/imagemPage.jpg')`
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/60 flex flex-col md:flex-row min-h-[650px]">

        {/* LADO ESQUERDO */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">

          <Link href="/" className="absolute top-6 left-6 text-green-700 hover:text-green-900 transition-colors flex items-center gap-2 no-underline text-sm font-semibold">
            <ArrowLeft size={18} /> Voltar
          </Link>

          <div className="md:hidden text-center mb-6 mt-8">
            <div className="inline-flex p-3 bg-green-100 rounded-full text-green-600 mb-3">
              <Leaf size={32} />
            </div>
            <h2 className="text-2xl font-bold text-green-800">Raiz Conecta</h2>
          </div>

          <div className="mt-6">
            <Tabs
              id="login-register-tabs"
              activeKey={key}
              onSelect={(k) => k && setKey(k)}
              className="mb-6 border-b-0 justify-center custom-tabs gap-2"
              variant="pills"
            >
              <Tab eventKey="login" title="Entrar" tabClassName={key === 'login' ? '!bg-green-600 !text-white shadow-md font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}>
                <div className="animate-fade-in mt-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h3>
                  <p className="text-gray-500 mb-6 text-sm">Acesse sua conta para continuar.</p>

                  <form onSubmit={formikLogin.handleSubmit} className="flex flex-col gap-2">
                    <InputText
                      label="Usuário"
                      inputName="username"
                      id="username"
                      placeholder="Seu email ou usuário"
                      value={formikLogin.values.username}
                      onChange={formikLogin.handleChange}
                      onBlur={formikLogin.handleBlur}
                      error={formikLogin.errors.username}
                      touched={formikLogin.touched.username}
                    />
                    <InputPassword
                      label="Senha"
                      inputName="password"
                      id="password"
                      placeholder="Sua senha"
                      value={formikLogin.values.password}
                      onChange={formikLogin.handleChange}
                      onBlur={formikLogin.handleBlur}
                      error={formikLogin.errors.password}
                      touched={formikLogin.touched.password}
                    />

                    <Button type="submit" className="w-full py-3 mt-4 fw-bold shadow-lg hover:scale-[1.02] transition-transform text-white" style={{ background: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}>
                      ENTRAR
                    </Button>
                  </form>
                </div>
              </Tab>

              <Tab eventKey="cadastro" title="Criar Conta" tabClassName={key === 'cadastro' ? '!bg-orange-500 !text-white shadow-md font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}>
                <div className="animate-fade-in mt-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Junte-se a nós</h3>
                  <p className="text-gray-500 mb-4 text-sm">Preencha os dados para começar a negociar.</p>

                  <form onSubmit={formikRegister.handleSubmit} className="flex flex-col gap-3">
                    <InputText
                      label="Nome Completo / Razão Social"
                      inputName="name"
                      id="register-name"
                      placeholder="Nome da empresa ou produtor"
                      value={formikRegister.values.name}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      error={formikRegister.errors.name}
                      touched={formikRegister.touched.name}
                    />

                    <InputText
                      label="E-mail Comercial"
                      inputName="email"
                      id="register-email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formikRegister.values.email}
                      onChange={formikRegister.handleChange}
                      onBlur={formikRegister.handleBlur}
                      error={formikRegister.errors.email}
                      touched={formikRegister.touched.email}
                    />

                    <Form.Group className="mb-1">
                      <Form.Label className="font-medium text-gray-700 text-sm">Tipo de Usuário</Form.Label>
                      <Form.Select
                        name="userType"
                        value={formikRegister.values.userType}
                        onChange={handleUserTypeChange}
                        onBlur={formikRegister.handleBlur}
                        className="shadow-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
                      >
                        <option value="producer">Produtor Rural</option>
                        <option value="market">Mercado Local</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputText
                        label={docLabel}
                        inputName="cpfCnpj"
                        id="doc"
                        placeholder={cpfCnpjPlaceholder}
                        value={formikRegister.values.cpfCnpj}
                        onChange={formikRegister.handleChange}
                        onBlur={formikRegister.handleBlur}
                        error={formikRegister.errors.cpfCnpj}
                        touched={formikRegister.touched.cpfCnpj}
                      />
                      <InputText
                        label="Telefone"
                        inputName="phone"
                        id="phone"
                        placeholder="(00) 00000-0000"
                        value={formikRegister.values.phone}
                        onChange={formikRegister.handleChange}
                        onBlur={formikRegister.handleBlur}
                        error={formikRegister.errors.phone}
                        touched={formikRegister.touched.phone}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputPassword
                        label="Senha"
                        inputName="password"
                        id="reg-pass"
                        placeholder="******"
                        value={formikRegister.values.password}
                        onChange={formikRegister.handleChange}
                        onBlur={formikRegister.handleBlur}
                        error={formikRegister.errors.password}
                        touched={formikRegister.touched.password}
                      />
                      <InputPassword
                        label="Confirmar"
                        inputName="confirmPassword"
                        id="reg-confirm"
                        placeholder="******"
                        value={formikRegister.values.confirmPassword}
                        onChange={formikRegister.handleChange}
                        onBlur={formikRegister.handleBlur}
                        error={formikRegister.errors.confirmPassword}
                        touched={formikRegister.touched.confirmPassword}
                      />
                    </div>

                    <Button type="submit" className="w-full py-3 mt-2 fw-bold text-white shadow-lg hover:scale-[1.02] transition-transform" style={{ background: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}>
                      Finalizar Cadastro
                    </Button>
                  </form>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-50/80 to-green-100/80 items-center justify-center p-12 relative">
          <div className="relative z-10 text-center">
            <div className="inline-flex p-8 bg-white rounded-[3rem] shadow-xl mb-8 animate-float">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <img
                  src="/logoRC.png"  // COLOCAR LOGO TOP E COLOCAR NO ASSETS
                  alt="Logo Raiz Conecta"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('text-green-600');
                  }}
                />
                <Leaf size={96} className="text-green-600 absolute -z-10 opacity-20" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-green-900 mb-4 tracking-tight">Raiz Conecta</h2>
            <p className="text-green-800 text-lg max-w-md mx-auto leading-relaxed font-medium">
              A ponte digital que faltava entre quem planta com amor e quem vende com qualidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}