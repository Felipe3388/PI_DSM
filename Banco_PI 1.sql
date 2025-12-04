-- ==========================================
-- BANCO DE DADOS: Raiz_Coneta
-- ==========================================

CREATE DATABASE Raiz_Coneta;
GO
USE Raiz_Coneta;
GO

-- ==========================================
-- TABELAS
-- ==========================================

CREATE TABLE cliente (
    CdCliente       INT PRIMARY KEY,
    NomeFantasia    NVARCHAR(100),
    RazaoSocial     NVARCHAR(150),
    Documento       NVARCHAR(20),
    TipoDoc         NVARCHAR(10),
    Ie              NVARCHAR(20),
    Rua             NVARCHAR(120),
    Numero          NVARCHAR(10),
    Bairro          NVARCHAR(80),
    Cidade          NVARCHAR(80),
    Estado          NCHAR(2),
    Complemento     NVARCHAR(50),
    Cep             NCHAR(8),
    Email           NVARCHAR(100),
    Telefone        NVARCHAR(20),
    Status          NCHAR(1)
);

CREATE TABLE vendedor (
    CdVendedor      INT PRIMARY KEY,
    NomeFantasia    NVARCHAR(100),
    RazaoSocial     NVARCHAR(150),
    Documento       NVARCHAR(20),
    TipoDoc         NVARCHAR(10),
    Ie              NVARCHAR(20),
    Rua             NVARCHAR(120),
    Numero          NVARCHAR(10),
    Bairro          NVARCHAR(80),
    Cidade          NVARCHAR(80),
    Estado          NCHAR(2),
    Complemento     NVARCHAR(50),
    Cep             NCHAR(8),
    Email           NVARCHAR(100),
    Telefone        NVARCHAR(20),
    Status          NCHAR(1)
);

CREATE TABLE entregador (
    CdEntregador    INT PRIMARY KEY,
    DataRegistro    DATE,
    DataAprovacao   DATE,
    Nome            NVARCHAR(120),
    Documento       NVARCHAR(20),
    TipoDoc         NVARCHAR(10),
    Rua             NVARCHAR(120),
    Numero          NVARCHAR(10),
    Bairro          NVARCHAR(80),
    Cidade          NVARCHAR(80),
    Estado          NCHAR(2),
    Complemento     NVARCHAR(50),
    Cep             NCHAR(8),
    Status          NCHAR(1)
);

CREATE TABLE acesso (
    Id              INT PRIMARY KEY,
    CdUser          INT,
    Login           NVARCHAR(50),
    Hash            NVARCHAR(200),
    TipoUser        NVARCHAR(20),
    Status          NCHAR(1),
    DtUltimoAcesso  DATE,
    cdCliente       INT FOREIGN KEY REFERENCES cliente (CdCliente),
    cdVendedor      INT FOREIGN KEY REFERENCES vendedor (CdVendedor),
    cdEntregador    INT FOREIGN KEY REFERENCES entregador (CdEntregador)
);

CREATE TABLE produtos (
    CdProduto       INT PRIMARY KEY,
    dtCadastro      DATE,
    Nome            NVARCHAR(120),
    Tipo            NVARCHAR(50),
    Preco           DECIMAL(10,2),
    QtdTotal        INT,
    DtUltimaAtz     DATE,
    Status          NCHAR(1)
);

CREATE TABLE pedidos (
    CdPedido        INT PRIMARY KEY,
    DtInicio        DATE,
    DtEntrega       DATE,
    DtFim           DATE,
    QtdItens        INT,
    VolumeAprox     DECIMAL(10,2),
    ValorTotal      DECIMAL(12,2),
    Status          NCHAR(1),
    VlFrete         DECIMAL(10,2),
    cdCliente       INT FOREIGN KEY REFERENCES cliente (CdCliente)
);

CREATE TABLE ItemPedido_Tem (
    ID              INT PRIMARY KEY,
    QTD             INT,
    Preco           DECIMAL(10,2),
    UN              NCHAR(2),
    cdVendedor      INT FOREIGN KEY REFERENCES vendedor (CdVendedor),
    cdProduto       INT FOREIGN KEY REFERENCES produtos (CdProduto),
    cdPedidos       INT FOREIGN KEY REFERENCES pedidos (CdPedido)
);

CREATE TABLE Prod_Vendedor_Possui (
    IdRegistro      INT PRIMARY KEY,
    DtAdesao        DATE,
    Saldo           INT,
    DtAtzSaldo      DATE,
    Preco           DECIMAL(10,2),
    DtAtzPreco      DATE,
    cdVendedor      INT FOREIGN KEY REFERENCES vendedor (CdVendedor),
    cdProduto       INT FOREIGN KEY REFERENCES produtos (CdProduto)
);

CREATE TABLE Rota (
    CdRota          INT PRIMARY KEY,
    DRegistro       DATE,
    DtFim           DATE,
    PercursoKM      DECIMAL(8,2),
    Valor           DECIMAL(10,2),
    QtdColetas      INT,
    QtdEntregas     INT,
    DuracaoHoras    DECIMAL(5,2),
    cdEntregador    INT FOREIGN KEY REFERENCES entregador (CdEntregador)
);

CREATE TABLE ColetaEntrega (
    CdColEntrega    INT PRIMARY KEY,
    Tipo            NVARCHAR(20),
    DtRegistro      DATE,
    DtPrevista      DATE,
    Status          NCHAR(1),
    Valor           DECIMAL(10,2),
    cdPedidos       INT FOREIGN KEY REFERENCES pedidos (CdPedido),
    cdRota          INT FOREIGN KEY REFERENCES Rota (CdRota)
);

-- ==========================================
-- INSERÇÕES DE DADOS
-- ==========================================

INSERT INTO cliente VALUES
(1, 'Padaria Sol Nascente', 'Sol Nascente Ltda', '12345678000111', 'CNPJ', 'IS12345', 'Rua das Flores', '101', 'Centro', 'São Paulo', 'SP', '', '01001000', 'contato@solnascente.com', '(11)98877-1234', 'A'),
(2, 'Mercado Bom Preço', 'Bom Preço Alimentos SA', '22345678000122', 'CNPJ', 'IS22345', 'Av Paulista', '2000', 'Bela Vista', 'São Paulo', 'SP', '', '01311000', 'vendas@bompreco.com', '(11)90011-1122', 'A'),
(3, 'Restaurante Sabor Caseiro', 'Sabor Caseiro Ltda', '33456789000133', 'CNPJ', 'IS33456', 'Rua das Laranjeiras', '55', 'Centro', 'Campinas', 'SP', '', '13010000', 'contato@saborcaseiro.com', '(19)99888-2222', 'A'),
(4, 'Supermercado Estrela', 'Estrela Distribuidora', '44567890000144', 'CNPJ', 'IS44567', 'Rua dos Andradas', '888', 'Centro', 'Porto Alegre', 'RS', '', '90020000', 'estrela@super.com', '(51)97777-3333', 'A'),
(5, 'Lanchonete Express', 'Express Alimentos Ltda', '55678900000155', 'CNPJ', 'IS55678', 'Av Central', '150', 'Centro', 'Curitiba', 'PR', '', '80010000', 'contato@express.com', '(41)98888-9999', 'A');

INSERT INTO vendedor VALUES
(1, 'Distribuidora Alpha', 'Alpha Comércio Ltda', '11111111000111', 'CNPJ', 'IE11111', 'Rua B', '15', 'Centro', 'São Paulo', 'SP', '', '01001001', 'vendas@alpha.com', '(11)91111-1111', 'A'),
(2, 'Vendas Beta', 'Beta Alimentos Ltda', '22222222000122', 'CNPJ', 'IE22222', 'Av Brasil', '22', 'Zona Norte', 'Rio de Janeiro', 'RJ', '', '20040000', 'contato@beta.com', '(21)92222-2222', 'A'),
(3, 'Comercial Gama', 'Gama Produtos SA', '33333333000133', 'CNPJ', 'IE33333', 'Rua C', '33', 'Centro', 'Campinas', 'SP', '', '13020000', 'gama@gama.com', '(19)93333-3333', 'A'),
(4, 'Food Delta', 'Delta Distribuição', '44444444000144', 'CNPJ', 'IE44444', 'Rua D', '44', 'Industrial', 'Curitiba', 'PR', '', '80020000', 'delta@food.com', '(41)94444-4444', 'A'),
(5, 'Mix Epsilon', 'Epsilon Mix Ltda', '55555555000155', 'CNPJ', 'IE55555', 'Av Oeste', '55', 'Centro', 'Porto Alegre', 'RS', '', '90030000', 'epsilon@mix.com', '(51)95555-5555', 'A');

INSERT INTO entregador VALUES
(1, '2023-01-01', '2023-01-05', 'Carlos Oliveira', '12345678900', 'CPF', 'Rua Azul', '10', 'Centro', 'São Paulo', 'SP', '', '01002000', 'A'),
(2, '2023-01-02', '2023-01-06', 'Marcos Lima', '98765432100', 'CPF', 'Rua Verde', '11', 'Zona Sul', 'São Paulo', 'SP', '', '04830000', 'A'),
(3, '2023-01-03', '2023-01-07', 'Ana Souza', '11223344556', 'CPF', 'Av Norte', '22', 'Centro', 'Campinas', 'SP', '', '13030000', 'A'),
(4, '2023-01-04', '2023-01-08', 'João Pedro', '66554433221', 'CPF', 'Rua das Oliveiras', '77', 'Centro', 'Curitiba', 'PR', '', '80040000', 'A'),
(5, '2023-01-05', '2023-01-09', 'Paula Reis', '99887766554', 'CPF', 'Av Central', '99', 'Centro', 'Porto Alegre', 'RS', '', '90040000', 'A');

INSERT INTO produtos VALUES
(1, '2024-01-01', 'Arroz Branco 5kg', 'Alimento', 25.90, 100, '2024-01-15', 'A'),
(2, '2024-01-02', 'Feijão Carioca 1kg', 'Alimento', 7.50, 200, '2024-01-10', 'A'),
(3, '2024-01-03', 'Macarrão Espaguete 500g', 'Alimento', 5.20, 150, '2024-01-11', 'A'),
(4, '2024-01-04', 'Óleo de Soja 900ml', 'Alimento', 6.90, 180, '2024-01-12', 'A'),
(5, '2024-01-05', 'Açúcar Refinado 1kg', 'Alimento', 4.80, 250, '2024-01-14', 'A');

INSERT INTO pedidos VALUES
(1, '2024-02-01', '2024-02-03', '2024-02-04', 3, 15.0, 89.50, 'E', 10.00, 1),
(2, '2024-02-02', '2024-02-04', '2024-02-05', 4, 20.0, 120.00, 'E', 12.50, 2),
(3, '2024-02-03', '2024-02-05', '2024-02-06', 2, 10.0, 48.00, 'E', 8.50, 3),
(4, '2024-02-04', '2024-02-06', '2024-02-07', 5, 25.0, 160.00, 'E', 15.00, 4),
(5, '2024-02-05', '2024-02-07', '2024-02-08', 1, 5.0, 25.00, 'E', 5.00, 5);

INSERT INTO Rota VALUES
(1, '2024-02-01', '2024-02-01', 30.5, 50.00, 3, 2, 4.5, 1),
(2, '2024-02-02', '2024-02-02', 25.0, 40.00, 2, 3, 3.8, 2),
(3, '2024-02-03', '2024-02-03', 40.2, 70.00, 4, 4, 5.2, 3),
(4, '2024-02-04', '2024-02-04', 15.3, 30.00, 1, 2, 2.5, 4),
(5, '2024-02-05', '2024-02-05', 50.7, 80.00, 5, 5, 6.0, 5);

INSERT INTO ColetaEntrega VALUES
(1, 'Coleta', '2024-02-01', '2024-02-02', 'E', 10.00, 1, 1),
(2, 'Entrega', '2024-02-02', '2024-02-03', 'E', 15.00, 2, 2),
(3, 'Coleta', '2024-02-03', '2024-02-04', 'E', 20.00, 3, 3),
(4, 'Entrega', '2024-02-04', '2024-02-05', 'E', 25.00, 4, 4),
(5, 'Coleta', '2024-02-05', '2024-02-06', 'E', 30.00, 5, 5);

INSERT INTO Prod_Vendedor_Possui VALUES
(1, '2024-01-01', 100, '2024-01-10', 24.90, '2024-01-15', 1, 1),
(2, '2024-01-02', 200, '2024-01-11', 7.00, '2024-01-15', 2, 2),
(3, '2024-01-03', 150, '2024-01-12', 5.00, '2024-01-15', 3, 3),
(4, '2024-01-04', 180, '2024-01-13', 6.50, '2024-01-15', 4, 4),
(5, '2024-01-05', 250, '2024-01-14', 4.50, '2024-01-15', 5, 5);

-- CORRIGIDO: agora insere todos os campos corretamente
INSERT INTO ItemPedido_Tem (ID, QTD, Preco, UN, cdVendedor, cdProduto, cdPedidos) VALUES
(1, 2, 25.90, 'UN', 1, 1, 1),
(2, 1, 7.50,  'UN', 2, 2, 2),
(3, 3, 5.20,  'UN', 3, 3, 3),
(4, 4, 6.90,  'UN', 4, 4, 4),
(5, 5, 4.80,  'UN', 5, 5, 5);

INSERT INTO acesso VALUES
(1, 1, 'cliente1', 'hash123', 'cliente', 'A', '2024-02-01', 1, NULL, NULL),
(2, 2, 'cliente2', 'hash234', 'cliente', 'A', '2024-02-02', 2, NULL, NULL),
(3, 3, 'vendedor1', 'hash345', 'vendedor', 'A', '2024-02-03', NULL, 1, NULL),
(4, 4, 'entregador1', 'hash456', 'entregador', 'A', '2024-02-04', NULL, NULL, 1),
(5, 5, 'cliente3', 'hash567', 'cliente', 'A', '2024-02-05', 3, NULL, NULL);

-- ==========================================
-- SELECTS
-- ==========================================

SELECT * FROM cliente;

SELECT Nome, Preco FROM produtos ORDER BY Preco DESC;

SELECT COUNT(*) AS TotalPedidos FROM pedidos;

SELECT p.CdPedido, c.NomeFantasia, p.ValorTotal, p.VlFrete
FROM pedidos p
JOIN cliente c ON p.cdCliente = c.CdCliente;

SELECT v.NomeFantasia AS Vendedor, pr.Nome AS Produto, pv.Preco
FROM Prod_Vendedor_Possui pv
JOIN vendedor v ON pv.cdVendedor = v.CdVendedor
JOIN produtos pr ON pv.cdProduto = pr.CdProduto;

SELECT c.NomeFantasia, COUNT(p.CdPedido) AS TotalPedidos, SUM(p.ValorTotal) AS ValorGasto
FROM pedidos p
JOIN cliente c ON p.cdCliente = c.CdCliente
GROUP BY c.NomeFantasia
ORDER BY ValorGasto DESC;

SELECT r.CdRota, e.Nome, r.PercursoKM, r.Valor
FROM Rota r
JOIN entregador e ON r.cdEntregador = e.CdEntregador
WHERE r.PercursoKM > 30;

SELECT Nome, Preco
FROM produtos
WHERE Preco > (SELECT AVG(Preco) FROM produtos);

SELECT p.CdPedido, c.NomeFantasia, c.Cidade, p.ValorTotal
FROM pedidos p
JOIN cliente c ON p.cdCliente = c.CdCliente
WHERE p.ValorTotal > 100 AND c.Cidade = 'São Paulo';

SELECT ce.CdColEntrega, ce.Tipo, ce.DtPrevista, e.Nome AS Entregador
FROM ColetaEntrega ce
JOIN Rota r ON ce.cdRota = r.CdRota
JOIN entregador e ON r.cdEntregador = e.CdEntregador
WHERE ce.DtPrevista BETWEEN '2024-02-03' AND '2024-02-05';
