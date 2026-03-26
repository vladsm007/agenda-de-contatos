/**
 * Configuração centralizada para comunicação com a API Backend.
 * Centralizamos as chamadas de rede aqui para facilitar a manutenção e o tratamento de erros.
 */

// A URL base é lida do arquivo .env.local via Next.js.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Wrapper genérico sobre o fetch nativo para padronizar erros e cabeçalhos.
 * 
 * @param {string} endpoint - O caminho final da API (ex: '/contato').
 * @param {Object} options - Opções comuns do fetch (method, body, etc).
 * @returns {Promise<Object>} Resposta da API formatada como JSON.
 * @throws {Error} Lança um erro se a resposta não for 2xx, extraindo a mensagem da API.
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 
        'Content-Type': 'application/json' 
      },
      ...options,
    });

    const data = await res.json();

    // Se o backend retornou um erro (status 400 ou 500), tratamos aqui.
    if (!res.ok) {
      // Priorizamos a mensagem do backend ou uma mensagem padrão.
      const errorMsg = data.message || `Erro do servidor: ${res.status}`;
      
      // Se houver uma lista de erros específicos (validação), anexamos ao erro.
      const error = new Error(errorMsg);
      error.details = data.errors || [];
      throw error;
    }

    return data;
  } catch (err) {
    // Se não for um erro lançado por nós, é um erro de rede/conexão.
    if (!err.details) {
      console.error('Falha de rede na API:', err.message);
      throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
    }
    throw err;
  }
}

/**
 * Objeto com métodos mapeados para os endpoints do recurso 'Contato'.
 */
export const contatoApi = {
  /** Lista todos os contatos */
  listar: () =>
    apiFetch('/contato'),

  /** Busca contatos por um termo (pesquisa) */
  buscar: (termo) =>
    apiFetch(`/contato/buscar?termo=${encodeURIComponent(termo)}`),

  /** Obtém detalhes de um único contato pelo ID */
  findOne: (id) =>
    apiFetch(`/contato/${id}`),

  /** Envia dados para criar um novo contato */
  criar: (body) =>
    apiFetch('/contato', { method: 'POST', body: JSON.stringify(body) }),

  /** Atualiza um contato existente pelo ID */
  atualizar: (id, body) =>
    apiFetch(`/contato/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  /** Remove um contato permanentemente */
  deletar: (id) =>
    apiFetch(`/contato/${id}`, { method: 'DELETE' }),
};
