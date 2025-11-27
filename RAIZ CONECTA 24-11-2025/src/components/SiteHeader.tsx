"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import { Leaf, User, LogOut, Package } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // --- ESTADO DE LOGIN (SIMULAÇÃO) ---
  // Mude para 'false' para ver como fica quando o usuário não está logado.
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    // Lógica de logout aqui
    setIsLoggedIn(false);
    router.push("/"); // Redireciona para a home (/) após sair
  };

  // Não renderiza o header na página de login
  if (pathname === "/login") {
    return null;
  }

  return (
    <Navbar
      bg="light"
      expand="lg"
      sticky="top"
      className="border-bottom shadow-sm"
      style={
        {
          "--bs-navbar-toggler-border-color": "transparent",
          borderColor: "var(--color-border)",
        } as React.CSSProperties
      }
    >
      <Container>
        {/* --- LOGO --- */}
        <Navbar.Brand
          as={Link}
          href="/"
          className="d-flex align-items-center gap-2 text-decoration-none me-auto"
        >
          <div
            className="flex h-8 w-8 items-center justify-content-center rounded-lg"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Leaf
              className="h-5 w-5"
              style={{ color: "var(--color-primary-foreground)" }}
            />
          </div>
          <span
            className="fs-5 fw-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Raiz Conecta
          </span>
        </Navbar.Brand>

        {/* --- TOGGLER MOBILE --- */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* --- CONTEÚDO DA NAVBAR --- */}
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {/* Links Centrais */}
          <Nav className="ms-auto me-3 my-2 my-lg-0 gap-lg-3 align-items-center">
            <Nav.Link
              as={Link}
              href="/#inicio"
              className={pathname === "/#inicio" ? "active" : ""} // "/#funcionalidade"
            >
              início
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/#sobre"
              className={pathname === "/#sobre" ? "active" : ""}
            >
              Sobre
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/#funcionalidades"
              className={pathname === "/#funcionalidades" ? "active" : ""} // "/#como-funciona"
            >
              Funcionalidades
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/#como-funciona"
              className={pathname === "/#como-funciona" ? "active" : ""} // "/#contato"
            >
              Como Funciona
            </Nav.Link>
          </Nav>

          {/* --- ÁREA DO USUÁRIO (CONDICIONAL) --- */}
          {isLoggedIn && pathname !== "/" ? (
            // SE LOGADO E NÃO ESTÁ NA HOME: Mostra Dropdown do Usuário
            <NavDropdown
              title={
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      width: "32px",
                      height: "32px",
                      color: "white",
                    }}
                  >
                    <User size={18} />
                  </div>
                  <span className="fw-medium d-none d-lg-inline">
                    Minha Conta
                  </span>
                </div>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Header>Olá, Usuário!</NavDropdown.Header>
              <NavDropdown.Item as={Link} href="/perfil">
                <User size={16} className="me-2" /> Meus Dados
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={handleLogout}
                className="text-danger d-flex align-items-center"
              >
                <LogOut size={16} className="me-2" /> Sair
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Link href="/login">
              <Button
                variant="success"
              >
                Entrar / Cadastrar
              </Button>
            </Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
