"use client";

import { useState } from "react";
import { Card, Button, Form, Tabs, Tab, Modal } from "react-bootstrap";
import { User, KeyRound, Trash2, Save } from "lucide-react";

export default function PerfilPage() {
    // Estados simulados (depois integram com API)
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [dados, setDados] = useState({
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "1199999-9999",
        tipoPerfil: "Produtor",
    });

    const [senha, setSenha] = useState({
        atual: "",
        nova: "",
    });

    // Atualiza valores do formulário
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setDados({ ...dados, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        alert("Dados atualizados com sucesso!");
    };

    const handlePasswordChange = () => {
        alert("Senha alterada com sucesso!");
    };

    const handleDeleteAccount = () => {
        alert("Conta excluída! (exclusão lógica)");
        setShowDeleteModal(false);
    };

    return (
        <div className="container py-5">
            <Card className="shadow-lg border-0">
                <Card.Body>
                    <h3 className="fw-bold mb-4 d-flex align-items-center gap-2"
                        style={{ color: "var(--color-primary)" }}>
                        <User /> Meus Dados
                    </h3>

                    {/* ABAS DO PERFIL */}
                    <Tabs defaultActiveKey="perfil" id="perfil-tabs" className="mb-3">

                        {/* ================== TAB 1: PERFIL ================== */}
                        <Tab eventKey="perfil" title="Perfil">
                            <Form className="mt-4">

                                <Form.Group className="mb-3">
                                    <Form.Label>Nome Completo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nome"
                                        value={dados.nome}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={dados.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="telefone"
                                        value={dados.telefone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Perfil</Form.Label>
                                    <Form.Select
                                        name="tipoPerfil"
                                        value={dados.tipoPerfil}
                                        onChange={handleChange}
                                    >
                                        <option>Produtor</option>
                                        <option>Mercado</option>
                                    </Form.Select>
                                </Form.Group>

                                <Button
                                    className="mt-3"
                                    style={{
                                        backgroundColor: "var(--color-primary)",
                                        borderColor: "var(--color-primary)",
                                    }}
                                    onClick={handleSaveProfile}
                                >
                                    <Save className="me-2" size={18} /> Salvar Alterações
                                </Button>
                            </Form>
                        </Tab>

                        {/* ================== TAB 2: SENHA ================== */}
                        <Tab eventKey="senha" title="Modificar Senha">
                            <Form className="mt-4">

                                <Form.Group className="mb-3">
                                    <Form.Label>Senha Atual</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={senha.atual}
                                        onChange={(e) =>
                                            setSenha({ ...senha, atual: e.target.value })
                                        }
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nova Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={senha.nova}
                                        onChange={(e) =>
                                            setSenha({ ...senha, nova: e.target.value })
                                        }
                                    />
                                </Form.Group>

                                <Button
                                    className="mt-3"
                                    style={{
                                        backgroundColor: "var(--color-primary)",
                                        borderColor: "var(--color-primary)",
                                    }}
                                    onClick={handlePasswordChange}
                                >
                                    <KeyRound className="me-2" size={18} /> Alterar Senha
                                </Button>

                            </Form>
                        </Tab>

                        {/* ================== TAB 3: EXCLUIR CONTA ================== */}
                        <Tab eventKey="excluir" title="Excluir Perfil">
                            <div className="mt-4">
                                <p className="text-danger fw-bold">
                                    Atenção: A exclusão é lógica. Seu perfil será desativado,
                                    mas poderá ser reativado posteriormente.
                                </p>

                                <Button
                                    variant="danger"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="me-2" size={18} />
                                    Excluir Conta
                                </Button>
                            </div>
                        </Tab>

                    </Tabs>
                </Card.Body>
            </Card>

            {/* MODAL DE CONFIRMAÇÃO */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Tem certeza de que deseja excluir (desativar) sua conta?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Confirmar Exclusão
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

