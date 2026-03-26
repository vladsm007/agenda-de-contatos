const axios = require('axios');

/**
 * Serviço de Integração com a API ViaCEP.
 * 
 * Este serviço é responsável por consumir dados de endereço a partir de um CEP.
 * Utilizamos este serviço para preencher automaticamente logradouro, bairro, cidade e UF do contato.
 */

/**
 * Busca dados de endereço completos a partir de um CEP string.
 * Consome a URL pública: https://viacep.com.br/ws/01001000/json/
 * 
 * @param {string} cep - O CEP a ser pesquisado (apenas números).
 * @returns {Promise<Object>} Um objeto contendo logradouro, bairro, cidade (localidade) e UF.
 * @throws {Error} Lança um erro se o CEP for inválido, não for encontrado ou se a API estiver fora do ar.
 */
const buscarEnderecoPorCep = async (cep) => {
  try {
    // 1. [NORMALIZAÇÃO] Remove qualquer caractere que não seja número.
    const cepLimpo = cep ? cep.replace(/\D/g, '') : '';

    // 2. [VALIDAÇÃO] CEPs brasileiros possuem exatamente 8 dígitos.
    if (cepLimpo.length !== 8) {
      throw new Error('O CEP informado é inválido. Certifique-se de digitar 8 números.');
    }

    // 3. [COMUNICAÇÃO HTTP] Faz uma requisição GET para o ViaCEP.
    const response = await axios.get(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    // 4. [TRATAMENTO] A API do ViaCEP retorna 'erro: true' caso o CEP não exista.
    if (response.data.erro) {
      throw new Error('Não encontramos nenhum endereço para o CEP informado.');
    }

    // 5. [RESULTADO] Mapeamos os campos retornados para os nomes de campos que usamos no nosso banco.
    return {
      logradouro: response.data.logradouro || '',
      bairro: response.data.bairro || '',
      cidade: response.data.localidade || '',
      uf: response.data.uf || '',
    };
  } catch (error) {
    // Registramos o erro detalhado no log do servidor para debug.
    console.error('Falha no serviço ViaCEP:', error.message);
    
    // Propagamos a mensagem amigável para o frontend.
    throw new Error(error.message || 'Houve uma falha na busca de endereço pelo CEP.');
  }
};

module.exports = { buscarEnderecoPorCep };
