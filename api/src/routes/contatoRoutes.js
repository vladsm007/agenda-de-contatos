const express = require('express');
const contatoController = require('../controllers/contatoController');
const validarContato = require('../middlewares/validarContato');

const router = express.Router();

//Rotas da API
router.post('/', validarContato, contatoController.create);
router.get('/', contatoController.findAll);
router.get('/buscar', contatoController.search);
router.get('/:id', contatoController.findOne);
router.put('/:id', validarContato, contatoController.update);
router.delete('/:id', contatoController.delete);

module.exports = router;
