const validarContato = (req, res, next) => {
  const { nome, email, telefone, cep } = req.body;
  const errors = [];

  if (!nome || nome.trim().length < 3) {
    errors.push('Nome é obrigatório e deve ter pelo menos 3 caracteres.');
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    errors.push('Email inválido');
  }

  if (!telefone || telefone.replace(/\D/g, '').length < 10) {
    errors.push('Telefone inválido (mínimo 10 dígitos)');
  }

  if (!cep || cep.replace(/\D/g, '').length !== 8) {
    errors.push('CEP inválido (deve ter 8 dígitos)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
    });
  }

  // Limpa o CEP (remove traços) antes de passar para o controller
  req.body.cep = cep.replace(/\D/g, '');
  next();
};

module.exports = validarContato;
