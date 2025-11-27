"use client";

import React, { useState, useEffect } from "react"; // Importei React para usar React.Fragment
import { Container, Card, Button, Badge, Form, InputGroup, Modal } from "react-bootstrap";
import {
    Users,
    ShoppingBag,
    UserCheck,
    Search,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    LogOut,
    Leaf,
    AlertTriangle,
    Save,
    ChevronLeft,
    ChevronRight,
    Package
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- TIPOS ---
type Product = {
    id: number;
    name: string;
    quantity: number;
    price: number;
};

type User = {
    id: number;
    name: string;
    type: "Produtor" | "Mercado" | "Consumidor";
    status: "Ativo" | "Pendente" | "Inativo";
    email: string;
};

type Order = {
    id: string;
    customer: string;
    producer: string;
    status: "Pendente" | "Em Trânsito" | "Entregue" | "Cancelado";
    total: string;
    date: string;
    items: Product[];
};

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"validate" | "orders" | "users" | "manageOrders">("validate");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

    // --- DADOS MOCKADOS ---
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: "Fazenda Sol Nascente", type: "Produtor", status: "Pendente", email: "contato@solnascente.com" },
        { id: 2, name: "Mercadinho da Vila", type: "Mercado", status: "Ativo", email: "compras@mercadinho.com" },
        { id: 3, name: "João Silva", type: "Produtor", status: "Inativo", email: "joao@email.com" },
        { id: 4, name: "Sítio Boa Vista", type: "Produtor", status: "Pendente", email: "sitio@boavista.com" },
    ]);

    const [orders, setOrders] = useState<Order[]>([
        {
            id: "#ORD-001",
            customer: "Mercadinho da Vila",
            producer: "Fazenda Sol Nascente",
            status: "Em Trânsito",
            total: "R$ 450,00",
            date: "18/11/2025",
            items: [
                { id: 101, name: "Tomate Orgânico (cx)", quantity: 5, price: 40.00 },
                { id: 102, name: "Alface Americana (uni)", quantity: 50, price: 3.00 },
                { id: 103, name: "Cenoura (kg)", quantity: 20, price: 5.00 },
            ]
        },
        {
            id: "#ORD-002",
            customer: "João Silva",
            producer: "Sítio Boa Vista",
            status: "Pendente",
            total: "R$ 85,50",
            date: "19/11/2025",
            items: [
                { id: 201, name: "Cesta de Verduras Mista", quantity: 1, price: 60.00 },
                { id: 202, name: "Mel Orgânico", quantity: 1, price: 25.50 },
            ]
        },
        {
            id: "#ORD-003",
            customer: "Restaurante Sabor",
            producer: "Fazenda Sol Nascente",
            status: "Entregue",
            total: "R$ 1.200,00",
            date: "15/11/2025",
            items: [
                { id: 301, name: "Batata Inglesa (saca)", quantity: 10, price: 90.00 },
                { id: 302, name: "Cebola Roxa (kg)", quantity: 30, price: 10.00 },
            ]
        },
    ]);

    /* INTEGRAÇÃO API (Descomente quando tiver a URL real)
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          // const response = await fetch('SUA_API_URL');
          // const data = await response.json();
          // setOrders(data);
        } catch (error) {
          console.error("Erro ao carregar pedidos:", error);
        }
      };
      // fetchOrders(); 
    }, []);
    */

    // --- ESTADOS MODAIS ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number | string, type: 'user' | 'order' } | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUserTarget, setEditUserTarget] = useState<User | null>(null);
    const [editOrderTarget, setEditOrderTarget] = useState<Order | null>(null);

    // --- AÇÕES ---
    const handleLogout = () => router.push("/login");
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrderIds(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleValidateUser = (id: number, action: "approve" | "reject") => {
        setUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: action === "approve" ? "Ativo" : "Inativo" } : user
        ));
    };

    const openDeleteModal = (id: number | string, type: 'user' | 'order') => {
        setDeleteTarget({ id, type });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === 'user') {
            setUsers(prev => prev.map(u => u.id === deleteTarget.id ? { ...u, status: "Inativo" } : u));
        } else {
            setOrders(prev => prev.map(o => o.id === deleteTarget.id ? { ...o, status: "Cancelado" } : o));
        }
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const openEditUserModal = (user: User) => {
        setEditUserTarget({ ...user });
        setShowEditModal(true);
        setEditOrderTarget(null);
    };

    const openEditOrderModal = (order: Order) => {
        setEditOrderTarget({ ...order });
        setShowEditModal(true);
        setEditUserTarget(null);
    };

    const confirmEdit = () => {
        if (editUserTarget) {
            setUsers(prev => prev.map(u => u.id === editUserTarget.id ? editUserTarget : u));
        } else if (editOrderTarget) {
            setOrders(prev => prev.map(o => o.id === editOrderTarget.id ? editOrderTarget : o));
        }
        setShowEditModal(false);
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase()));

    // --- COMPONENTE SIDEBAR ITEM ---
    const SidebarItem = ({ id, icon: Icon, label, isHeader = false, onClick }: { id?: string, icon?: any, label: string, isHeader?: boolean, onClick?: () => void }) => {
        if (isHeader) {
            if (!isSidebarOpen) return <div className="h-px bg-gray-200 my-4 mx-2"></div>;
            return <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3 mt-6 first:mt-0 fade-in">{label}</p>;
        }

        const isActive = activeTab === id;
        return (
            <button
                onClick={onClick ? onClick : () => id && setActiveTab(id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all duration-200 font-medium relative group ${isActive
                        ? 'bg-green-50 text-green-700 shadow-sm'
                        : id === 'logout' ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                title={!isSidebarOpen ? label : ""}
            >
                <Icon size={20} className={`min-w-[20px] ${isActive ? 'text-green-600' : id === 'logout' ? 'text-red-500' : 'text-gray-400'}`} />
                {isSidebarOpen && <span className="whitespace-nowrap overflow-hidden fade-in">{label}</span>}
            </button>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "validate":
                const pendingUsers = users.filter(u => u.status === "Pendente");
                return (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Validar Cadastros</h2>
                            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-full text-sm font-medium shadow-sm">
                                {pendingUsers.length} Pendentes
                            </Badge>
                        </div>
                        {pendingUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                                <div className="p-4 bg-green-50 rounded-full mb-4"><CheckCircle size={48} className="text-green-400" /></div>
                                <h5 className="text-gray-800 font-bold">Tudo em dia!</h5>
                                <p className="text-gray-500">Nenhum cadastro pendente.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {pendingUsers.map(user => (
                                    <Card key={user.id} className="border-0 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden bg-white">
                                        <Card.Body className="flex flex-wrap justify-between items-center gap-4 p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg shadow-inner">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h5 className="mb-1 font-bold text-gray-800">{user.name}</h5>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <span className="px-2 py-0.5 bg-gray-100 rounded-md font-medium text-xs uppercase">{user.type}</span>
                                                        <span>•</span>
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button variant="link" className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg no-underline flex items-center gap-2 transition-colors font-medium" onClick={() => handleValidateUser(user.id, "reject")}>
                                                    <XCircle size={18} /> Recusar
                                                </Button>
                                                <Button className="bg-green-600 hover:bg-green-700 border-0 px-4 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 transition-all active:scale-95 font-medium text-white" onClick={() => handleValidateUser(user.id, "approve")}>
                                                    <CheckCircle size={18} /> Aprovar
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "orders":
            case "manageOrders":
                return (
                    <div className="animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{activeTab === "orders" ? "Consultar Pedidos" : "Gerenciar Pedidos"}</h2>
                                <p className="text-gray-500 text-sm mb-0">Acompanhe o fluxo de vendas e detalhes dos produtos.</p>
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Buscar pedido..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-full md:w-72 transition-all bg-white shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="bg-gray-50/80 border-b border-gray-100">
                                        <tr>
                                            <th className="py-4 ps-6 text-xs font-bold text-gray-500 uppercase">ID</th>
                                            <th className="text-xs font-bold text-gray-500 uppercase">Cliente</th>
                                            <th className="text-xs font-bold text-gray-500 uppercase">Produtor</th>
                                            <th className="text-xs font-bold text-gray-500 uppercase">Data</th>
                                            <th className="text-xs font-bold text-gray-500 uppercase">Total</th>
                                            <th className="text-xs font-bold text-gray-500 uppercase">Status</th>
                                            {activeTab === "manageOrders" && <th className="text-end pe-6 text-xs font-bold text-gray-500 uppercase">Ações</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredOrders.map(order => {
                                            const isExpanded = expandedOrderIds.includes(order.id);
                                            return (
                                                <React.Fragment key={order.id}>
                                                    <tr
                                                        className={`group transition-colors ${isExpanded ? 'bg-green-50/30' : 'hover:bg-gray-50/30'}`}
                                                    >
                                                        <td
                                                            className="ps-6 py-4 font-mono text-sm font-bold text-green-700 cursor-pointer hover:text-green-900 hover:underline"
                                                            onClick={() => toggleOrderDetails(order.id)}
                                                            title="Clique para ver detalhes"
                                                        >
                                                            {order.id}
                                                        </td>
                                                        <td className="font-medium text-gray-800">{order.customer}</td>
                                                        <td className="text-gray-600">{order.producer}</td>
                                                        <td className="text-gray-500 text-sm">{order.date}</td>
                                                        <td className="font-bold text-gray-800">{order.total}</td>
                                                        <td>
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${order.status === "Entregue" ? "bg-green-100 text-green-800 ring-1 ring-green-600/20" :
                                                                    order.status === "Em Trânsito" ? "bg-blue-100 text-blue-800 ring-1 ring-blue-600/20" :
                                                                        order.status === "Cancelado" ? "bg-red-100 text-red-800 ring-1 ring-red-600/20" : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20"
                                                                }`}>{order.status}</span>
                                                        </td>
                                                        {activeTab === "manageOrders" && (
                                                            <td className="text-end pe-6">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button variant="link" onClick={() => openEditOrderModal(order)} className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all"><Edit size={18} /></Button>
                                                                    <Button variant="link" onClick={() => openDeleteModal(order.id, 'order')} className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={18} /></Button>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                    {isExpanded && (
                                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                                            <td colSpan={8} className="p-0">
                                                                <div className="p-4 ps-12 animate-fade-in">
                                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                                                        <Package size={14} /> Produtos do Pedido
                                                                    </p>
                                                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                                                        <table className="table table-sm mb-0">
                                                                            <thead className="bg-gray-50">
                                                                                <tr>
                                                                                    <th className="ps-4 py-2 text-xs text-gray-500 border-0">Item</th>
                                                                                    <th className="text-xs text-gray-500 text-center border-0">Qtd</th>
                                                                                    <th className="text-xs text-gray-500 text-end pe-4 border-0">Valor Unit.</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {order.items.map(item => (
                                                                                    <tr key={item.id}>
                                                                                        <td className="ps-4 py-2 text-sm text-gray-700 border-0">{item.name}</td>
                                                                                        <td className="text-center text-sm text-gray-600 border-0">{item.quantity}</td>
                                                                                        <td className="text-end pe-4 text-sm text-gray-600 border-0">R$ {item.price.toFixed(2).replace('.', ',')}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case "users":
                return (
                    <div className="animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">Gerenciar Usuários</h2>
                                <p className="text-gray-500 text-sm mb-0">Administre as contas da plataforma.</p>
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Buscar usuário..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-full md:w-72 transition-all bg-white shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl p-4 flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${user.status === "Ativo" ? "bg-green-50 text-green-600" :
                                                user.status === "Inativo" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
                                            }`}><Users size={22} /></div>
                                        <div>
                                            <h6 className="mb-1 font-bold text-gray-800">{user.name}</h6>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs uppercase">{user.type}</span>
                                                <span>•</span>
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${user.status === "Ativo" ? "bg-green-50 text-green-700 border-green-200" :
                                                user.status === "Inativo" ? "bg-red-50 text-red-700 border-red-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            }`}>{user.status}</span>
                                        <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>
                                        <div className="flex gap-1">
                                            <Button variant="link" onClick={() => openEditUserModal(user)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Editar"><Edit size={18} /></Button>
                                            <Button variant="link" onClick={() => openDeleteModal(user.id, 'user')} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Desativar"><Trash2 size={18} /></Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen flex font-sans text-gray-900" style={{ backgroundColor: "#f8fafc" }}>

            {/* SIDEBAR */}
            <aside
                className={`bg-white border-r border-gray-100 flex flex-col fixed h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'}`}
            >
                {/* HEADER CLICÁVEL PARA TOGGLE */}
                <div
                    className="p-6 border-b border-gray-50 flex items-center cursor-pointer hover:bg-gray-50/50 transition-colors group"
                    onClick={toggleSidebar}
                    title={isSidebarOpen ? "Recolher Menu" : "Expandir Menu"}
                >
                    <div className={`p-2 bg-green-100 rounded-xl text-green-600 shadow-sm transition-transform group-hover:scale-110 ${!isSidebarOpen && 'mx-auto'}`}>
                        <Leaf size={24} />
                    </div>

                    {isSidebarOpen && (
                        <div className="ms-3 fade-in overflow-hidden whitespace-nowrap">
                            <h4 className="text-green-800 font-bold mb-0 text-lg tracking-tight leading-tight">Raiz Conecta</h4>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin Panel</span>
                        </div>
                    )}
                </div>

                <div className="p-4 overflow-y-auto flex-1 scrollbar-hide">
                    <nav className="flex flex-col gap-1">
                        <SidebarItem label="Principal" isHeader />
                        <SidebarItem id="validate" icon={UserCheck} label="Validar Perfis" />
                        <SidebarItem id="orders" icon={ShoppingBag} label="Consultar Pedidos" />
                        <SidebarItem label="Gerenciamento" isHeader />
                        <SidebarItem id="users" icon={Users} label="Usuários" />
                        <SidebarItem id="manageOrders" icon={Edit} label="Pedidos" />

                        <div className="mt-6 border-t border-gray-50 pt-2">
                            <SidebarItem id="logout" icon={LogOut} label="Sair da Conta" onClick={handleLogout} />
                        </div>
                    </nav>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={`flex-1 p-6 lg:p-10 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                <Container fluid className="max-w-7xl mx-auto">
                    {renderContent()}
                </Container>
            </main>

            {/* --- MODAIS --- */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="border-0 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-white p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {deleteTarget?.type === 'user' ? 'Desativar Usuário?' : 'Cancelar Pedido?'}
                    </h4>
                    <p className="text-gray-500 mb-6">
                        {deleteTarget?.type === 'user'
                            ? 'Tem certeza que deseja desativar este usuário? Ele perderá acesso à plataforma.'
                            : 'Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="light" onClick={() => setShowDeleteModal(false)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 border border-gray-200">Não, cancelar</Button>
                        <Button variant="danger" onClick={confirmDelete} className="px-6 py-2.5 rounded-xl font-medium bg-red-500 border-0 hover:bg-red-600 shadow-lg shadow-red-200">Sim, confirmar</Button>
                    </div>
                </div>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered contentClassName="border-0 rounded-2xl shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Edit size={20} /></div>
                        <h4 className="text-lg font-bold text-gray-800 mb-0">Editar Informações</h4>
                    </div>
                    {editUserTarget && (
                        <Form className="flex flex-col gap-4">
                            <Form.Group>
                                <Form.Label className="text-sm font-bold text-gray-700">Nome</Form.Label>
                                <Form.Control type="text" value={editUserTarget.name} onChange={e => setEditUserTarget({ ...editUserTarget, name: e.target.value })} className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-100" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sm font-bold text-gray-700">Email</Form.Label>
                                <Form.Control type="email" value={editUserTarget.email} onChange={e => setEditUserTarget({ ...editUserTarget, email: e.target.value })} className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-100" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sm font-bold text-gray-700">Status</Form.Label>
                                <Form.Select value={editUserTarget.status} onChange={e => setEditUserTarget({ ...editUserTarget, status: e.target.value as any })} className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-100">
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                    <option value="Pendente">Pendente</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    )}
                    {editOrderTarget && (
                        <Form className="flex flex-col gap-4">
                            <Form.Group>
                                <Form.Label className="text-sm font-bold text-gray-700">Status do Pedido</Form.Label>
                                <Form.Select value={editOrderTarget.status} onChange={e => setEditOrderTarget({ ...editOrderTarget, status: e.target.value as any })} className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-100">
                                    <option value="Pendente">Pendente</option>
                                    <option value="Em Trânsito">Em Trânsito</option>
                                    <option value="Entregue">Entregue</option>
                                    <option value="Cancelado">Cancelado</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sm font-bold text-gray-700">Total (R$)</Form.Label>
                                <Form.Control type="text" value={editOrderTarget.total} onChange={e => setEditOrderTarget({ ...editOrderTarget, total: e.target.value })} className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-100" />
                            </Form.Group>
                        </Form>
                    )}
                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-50">
                        <Button variant="light" onClick={() => setShowEditModal(false)} className="px-4 rounded-xl font-medium text-gray-600 hover:bg-gray-100">Cancelar</Button>
                        <Button variant="primary" onClick={confirmEdit} className="px-6 rounded-xl font-medium bg-blue-600 border-0 hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center gap-2"><Save size={18} /> Salvar Alterações</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}