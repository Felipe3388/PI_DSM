"use client";

import Link from "next/link";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Leaf, Mail } from "lucide-react"; // Menos ícones

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="py-4 mt-auto" // Reduzido padding
      style={{
        backgroundColor: "var(--color-muted)",
        borderTop: `1px solid var(--color-border)`,
      }}
    >
      <Container>
        <Row className="g-3 align-items-center">
          {" "}
          {/* g-3 para menor espaçamento */}
          {/* Logo e Copyright */}
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <Link
              href="/"
              className="d-inline-flex align-items-center gap-2 mb-2 text-decoration-none"
            >
              <Leaf size={20} style={{ color: "var(--color-primary)" }} />
              <span
                className="fs-6 fw-bold"
                style={{ color: "var(--color-foreground)" }}
              >
                Raiz Conecta
              </span>
            </Link>
            <p
              className="text-muted mb-0"
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "0.8rem",
              }}
            >
              © {currentYear} Raiz Conecta. Todos os direitos reservados.
            </p>
          </Col>
          {/* Links e Contato */}
          <Col md={6}>
            <Nav className="justify-content-center justify-content-md-end gap-3 gap-md-4">
              <Nav.Link
                as={Link}
                href="/#sobre"
                className="p-0 text-muted"
                style={{
                  color: "var(--color-muted-foreground)",
                  fontSize: "0.9rem",
                }}
              >
                Sobre
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/#como-funciona"
                className="p-0 text-muted"
                style={{
                  color: "var(--color-muted-foreground)",
                  fontSize: "0.9rem",
                }}
              >
                Como Funciona
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/login"
                className="p-0 text-muted"
                style={{
                  color: "var(--color-muted-foreground)",
                  fontSize: "0.9rem",
                }}
              >
                Login
              </Nav.Link>
              <Nav.Link
                href="mailto:contato@raizconecta.com.br"
                className="p-0 text-muted d-inline-flex align-items-center gap-1"
                style={{
                  color: "var(--color-muted-foreground)",
                  fontSize: "0.9rem",
                }}
              >
                <Mail size={14} /> Contato
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
