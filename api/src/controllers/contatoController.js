const prisma = require('../config/database');
const viaCepService = require('../services/viaCepService');

/**
 * Controller para manipular as operações de Contato.
 * Gerencia a lógica de negócio entre as rotas e o banco de dados via Prisma.
 */
const contatoController = {
  /**
   * Cria um novo contato no banco de dados.
   * 
   * @param {Object} req - Objeto de requisição do Express.
   * @param {Object} req.body - Dados do contato (nome, email, telefone, cep).
   * @param {Object} res - Objeto de resposta do Express.
   */
  async create(req, res) {
    try {
      const { nome, email, telefone, cep } = req.body;

      // [REGRA DE NEGÓCIO] Verificar se o e-mail já está cadastrado.
      // O campo email é único no esquema do Prisma (@unique).
      const emailExistente = await prisma.contato.findUnique({
        where: { email },
      });

      if (emailExistente) {
        return res.status(400).json({
          success: false,
          message: 'Este e-mail já está cadastrado em nossa agenda.',
        });
      }

      // [INTEGRAÇÃO EXTERNA] Buscar endereço completo pelo CEP usando ViaCEP.
      // Caso o serviço falhe ou o CEP seja inválido, uma exceção será lançada.
      const endereco = await viaCepService.buscarEnderecoPorCep(cep);

      // [PERSISTÊNCIA] Salvar contato com os dados da requisição e do CEP.
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
      console.error('Erro ao criar contato:', error);

      res.status(500).json({
        success: false,
        message: error.message || 'Ocorreu um erro interno ao criar o contato.',
      });
    }
  },

  /**
   * Lista todos os contatos cadastrados, ordenados por nome de A-Z.
   * 
   * @param {Object} req - Objeto de requisição.
   * @param {Object} res - Objeto de resposta.
   */
  async findAll(req, res) {
    try {
      // Busca todos os registros e aplica ordenação alfabética.
      const contatos = await prisma.contato.findMany({
        orderBy: { nome: 'asc' },
      });

      res.json({
        success: true,
        data: contatos,
      });
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar a lista de contatos.',
      });
    }
  },

  /**
   * Busca um único contato pelo seu ID.
   * 
   * @param {Object} req - Requisição contendo o ID nos parâmetros.
   * @param {Object} res - Resposta.
   */
  async findOne(req, res) {
    try {
      const { id } = req.params;

      // Prisma.findUnique exige que o critério de busca seja único.
      const contato = await prisma.contato.findUnique({
        where: { id: parseInt(id) },
      });

      if (!contato) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado.',
        });
      }

      res.json({
        success: true,
        data: contato,
      });
    } catch (error) {
      console.error('Erro ao buscar contato individual:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar a busca do contato.',
      });
    }
  },

  /**
   * Atualiza os dados de um contato existente.
   * 
   * @param {Object} req - Requisição contendo ID e novos dados.
   * @param {Object} res - Resposta.
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, cep } = req.body;
      const idInt = parseInt(id);

      // 1. Verificar se o contato alvo existe.
      const contatoExiste = await prisma.contato.findUnique({
        where: { id: idInt },
      });

      if (!contatoExiste) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado.',
        });
      }

      // 2. [REGRA DE NEGÓCIO] Se o email mudou, verificar se o novo já está em uso por outro.
      if (email && email !== contatoExiste.email) {
        const emailDuplicado = await prisma.contato.findUnique({
          where: { email },
        });

        if (emailDuplicado) {
          return res.status(400).json({
            success: false,
            message: 'Este e-mail já está sendo usado por outro contato.',
          });
        }
      }

      // 3. Gerenciar mudança de endereço se o CEP for alterado.
      let dadosAtualizados = { nome, email, telefone, cep };

      if (cep && cep !== contatoExiste.cep) {
        // Busca novos dados de endereço apenas se houver mudança de CEP.
        const endereco = await viaCepService.buscarEnderecoPorCep(cep);
        dadosAtualizados = { ...dadosAtualizados, ...endereco };
      }

      const contatoAtualizado = await prisma.contato.update({
        where: { id: idInt },
        data: dadosAtualizados,
      });

      res.json({
        success: true,
        message: 'Contato atualizado com sucesso!',
        data: contatoAtualizado,
      });
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Não foi possível salvar as alterações.',
      });
    }
  },

  /**
   * Remove permanentemente um contato do banco de dados.
   * 
   * @param {Object} req - Requisição contendo ID.
   * @param {Object} res - Resposta.
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      // A deleção falha se o ID não existir no Prisma.
      await prisma.contato.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: 'Contato removido da agenda.',
      });
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      res.status(500).json({
        success: false,
        message: 'Ocorreu um erro ao tentar excluir o contato.',
      });
    }
  },

  /**
   * Busca contatos que correspondam a um termo no Nome ou E-mail.
   * 
   * @param {Object} req - Query contendo 'termo'.
   * @param {Object} res - Resposta com lista filtrada.
   */
  async search(req, res) {
    try {
      const { termo } = req.query;

      // Busca usando operador OR e filtro 'contains' (case-insensitive).
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
      console.error('Erro na pesquisa de contatos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar a pesquisa.',
      });
    }
  },
};

module.exports = contatoController;
