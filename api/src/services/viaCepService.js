const axios = require('axios');

/**
 * Busca endereço a partir do CEP usando a API ViaCEP
 * @param {string} cep - CEP sem traço
 * @returns {Promise<object>} Dados do endereço
 */
const buscarEnderecoPorCep = async (cep) => {
  try {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new Error('CEP inválido.');
    }

    const response = await axios.get(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    if (response.data.erro) {
      throw new Error('CEP não encontrado.');
    }

    return {
      logradouro: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      uf: response.data.uf,
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error.message);
    throw error;
  }
};

module.exports = { buscarEnderecoPorCep };
