const prisma = require('../config/database');
const viaCepService = require('../services/viaCepService');

const contatoController = {
  // Criar novo contato
  async create(req, res) {
    try {
      const { nome, email, telefone, cep } = req.body;

      // Buscar endereço pelo CEP
      const endereco = await viacepService.buscarEnderecoPorCep(cep);

      // Criar contato no banco
      const novoContato = await prisma.contato.create({
        data: {
          nome,
          email,
          telefone,
          cep,
          ...endereco,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Contato criado com sucesso!',
        data: novoContato,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar contato',
      });
    }
  },

  // Listar todos os contatos
  async findAll(req, res) {
    try {
      const contatos = await prisma.contato.findMany({
        orderBy: { nome: 'asc' },
      });

      res.json({
        success: true,
        data: contatos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar contatos',
      });
    }
  },

  // Buscar contato por ID
  async findOne(req, res) {
    try {
      const { id } = req.params;

      const contato = await prisma.contato.findUnique({
        where: { id },
      });

      if (!contato) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado',
        });
      }

      res.json({
        success: true,
        data: contato,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar contato',
      });
    }
  },

  // Atualizar contato
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, cep } = req.body;

      // Verificar se contato existe
      const contatoExiste = await prisma.contato.findUnique({
        where: { id },
      });

      if (!contatoExiste) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado',
        });
      }

      // Se o CEP foi alterado, buscar novo endereço
      let dadosAtualizados = { nome, email, telefone, cep };

      if (cep && cep !== contatoExiste.cep) {
        const endereco = await viacepService.buscarEnderecoPorCep(cep);
        dadosAtualizados = { ...dadosAtualizados, ...endereco };
      }

      const contatoAtualizado = await prisma.contato.update({
        where: { id },
        data: dadosAtualizados,
      });

      res.json({
        success: true,
        message: 'Contato atualizado com sucesso!',
        data: contatoAtualizado,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar contato',
      });
    }
  },

  // Deletar contato
  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.contato.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Contato deletado com sucesso!',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar contato',
      });
    }
  },

  // Buscar contatos por termo (nome ou email)
  async search(req, res) {
    try {
      const { termo } = req.query;

      const contatos = await prisma.contato.findMany({
        where: {
          OR: [
            { nome: { contains: termo, mode: 'insensitive' } },
            { email: { contains: termo, mode: 'insensitive' } },
          ],
        },
        orderBy: { nome: 'asc' },
      });

      res.json({
        success: true,
        data: contatos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar contatos',
      });
    }
  },
};

module.exports = contatoController;
