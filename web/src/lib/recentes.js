/**
 * Gerenciamento do Histórico de Contatos Recentes.
 * 
 * Mantemos uma lista dos últimos contatos visualizados no dispositivo do usuário.
 * Para evitar latência, salvamos o objeto do contato completo no localStorage.
 */

const KEY = 'agenda_recentes';
const MAX_ITENS = 20;

/**
 * Retorna a lista de contatos Recentes.
 * 
 * @returns {Object[]} Array de objetos Contato.
 */
export function getRecentes() {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Falha ao ler contatos recentes:', error);
    return [];
  }
}

/**
 * Adiciona um contato ao topo da lista de Recentes.
 * 
 * @param {Object} contato - Objeto completo do contato visualizado.
 */
export function addRecente(contato) {
  if (typeof window === 'undefined' || !contato) return;

  try {
    // 1. Buscamos a lista atual e removemos o contato se ele já existir (para reinseri-lo no topo).
    const list = getRecentes().filter((r) => r.id !== contato.id);

    // 2. Colocamos o novo contato na primeira posição (índice 0).
    list.unshift(contato);

    // 3. Limitamos a lista ao tamanho máximo definido para não sobrecarregar o storage.
    const limitedList = list.slice(0, MAX_ITENS);

    localStorage.setItem(KEY, JSON.stringify(limitedList));
  } catch (error) {
    console.error('Falha ao salvar contato recente:', error);
  }
}

/**
 * Limpa todo o histórico de contatos Recentes do navegador.
 */
export function clearRecentes() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
