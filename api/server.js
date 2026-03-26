const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// [MODULARIZAÇÃO] Importamos as rotas de contatos para manter o server.js limpo.
const contatoRoutes = require('./src/routes/contatoRoutes');

const app = express();
const port = process.env.PORT || 5000;

/**
 * CONFIGURAÇÃO DE MIDDLEWARES GLOBAIS
 */

// 1. Helmet: Adiciona cabeçalhos de segurança básicos para proteger contra ameaças comuns de rede.
app.use(helmet());

// 2. CORS: Define de onde o nosso frontend pode enviar requisições. 
// Isso é essencial para navegadores modernos permitirem a comunicação API <-> Web.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

// 3. Morgan: Faz o log de cada requisição recebida no console (ex: "GET /api/v1/contato 200").
app.use(morgan('combined'));

// 4. Body Parsers: Permite que o Express entenda JSON e dados enviados por formulários no corpo da requisição.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CONFIGURAÇÃO DE ROTAS
 */

// Prefixo '/api/v1/contato' para todos os endpoints da agenda.
app.use('/api/v1/contato', contatoRoutes);

// Rota de saúde: verifica se o servidor está ativo.
app.get('/health', (req, res) => {
  res.json({ message: 'API conectada com sucesso!' });
});

/**
 * TRATAMENTO DE ERROS
 */

// 1. Not Found (404): Executa se nenhuma rota acima corresponder à URL solicitada.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Essa rota não existe na nossa API.',
  });
});

// 2. Handler Global de Erros (500): Captura qualquer erro não tratado durante o fluxo das requisições.
app.use((err, req, res, next) => {
  console.error('ERRO NÃO TRATADO:', err);
  res.status(500).json({
    success: false,
    message: 'Ocorreu um problema inesperado no servidor. Tente novamente mais tarde.',
  });
});

// Inicializa o servidor na porta configurada.
app.listen(port, () => {
  console.log(`🚀 Servidor pronto e rodando na porta ${port}`);
});
