const express = require('express');
const cors = require('cors');
require('dotenv').config();

const contatoRoutes = require('./src/routes/contatoRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares globais
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Permite receber JSON no body

// Rotas
app.use('/api/v1/contato', contatoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API da Agenda de Contatos funcionando!' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
