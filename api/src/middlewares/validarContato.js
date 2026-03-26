/**
 * Middleware para validar os dados de entrada de um Contato antes de processar no controller.
 * Garante que dados obrigatórios existam e tenham formato mínimo válido.
 * 
 * @param {Object} req - Objeto de requisição com corpo contendo dados do contato.
 * @param {Object} res - Objeto de resposta usado para retornar erros 400.
 * @param {Function} next - Função de callback para prosseguir com a execução.
 */
const validarContato = (req, res, next) => {
  const { nome, email, telefone, cep } = req.body;
  const errors = [];

  // 1. Validação de Nome: Mínimo 3 caracteres não-espaços.
  if (!nome || nome.trim().length < 3) {
    errors.push('O nome é obrigatório e precisa ter pelo menos 3 letras.');
  }

  // 2. Validação simples de E-mail: Verifica formato básico.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Insira um endereço de e-mail válido.');
  }

  // 3. Validação de Telefone: Mínimo 10 dígitos numéricos.
  // Exemplo: (11) 99999-9999 -> 11999999999 (11 dígitos ok)
  const telefoneLimpo = telefone ? telefone.replace(/\D/g, '') : '';
  if (telefoneLimpo.length < 10) {
    errors.push('O telefone é inválido (mínimo 10 dígitos numéricos).');
  }

  // 4. Validação de CEP: Exatamente 8 dígitos numéricos.
  const cepLimpo = cep ? cep.replace(/\D/g, '') : '';
  if (cepLimpo.length !== 8) {
    errors.push('O CEP é inválido (deve conter exatamente 8 números).');
  }

  // Se houver erros, interrompe e retorna a lista para o frontend.
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos. Por favor, corrija os erros abaixo.',
      errors: errors,
    });
  }

  // [NORMALIZAÇÃO] Limpa o CEP (remove traços/espaços) antes de passar para o controller.
  req.body.cep = cepLimpo;
  // [NORMALIZAÇÃO] Limpa o Telefone (opcional, aqui mantemos apenos os números).
  req.body.telefone = telefoneLimpo;

  next();
};

module.exports = validarContato;
