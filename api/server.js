const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const contatoRoutes = require('./src/routes/contatoRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/contato', contatoRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'API conectada com sucesso!' });
});

// Trata rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Handler global de erros
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
