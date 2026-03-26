const express = require('express');
const contatoController = require('../controllers/contatoController');
const validarContato = require('../middlewares/validarContato');

/**
 * Roteamento para as operações de Contato.
 * 
 * Este arquivo vincula as URLs (endpoints) aos métodos correspondentes do Controller.
 * Também aplica middlewares de validação onde dados sensíveis são enviados (POST/PUT).
 */
const router = express.Router();

/**
 * @route   POST /api/v1/contato
 * @desc    Cria um novo contato na agenda.
 * @access  Público
 */
router.post('/', validarContato, contatoController.create);

/**
 * @route   GET /api/v1/contato
 * @desc    Busca a lista completa de contatos (A-Z).
 * @access  Público
 */
router.get('/', contatoController.findAll);

/**
 * @route   GET /api/v1/contato/buscar?termo=...
 * @desc    Realiza uma pesquisa de contatos por nome ou e-mail.
 * @access  Público
 */
router.get('/buscar', contatoController.search);

/**
 * @route   GET /api/v1/contato/:id
 * @desc    Obtém os detalhes completos de um contato específico.
 * @access  Público
 */
router.get('/:id', contatoController.findOne);

/**
 * @route   PUT /api/v1/contato/:id
 * @desc    Atualiza as informações de um contato existente.
 * @access  Público
 */
router.put('/:id', validarContato, contatoController.update);

/**
 * @route   DELETE /api/v1/contato/:id
 * @desc    Exclui um contato da agenda permanentemente.
 * @access  Público
 */
router.delete('/:id', contatoController.delete);

module.exports = router;
