/**
 * Gerenciamento de Favoritos (Persistência Local).
 * 
 * Utilizamos o localStorage do navegador para que o usuário possa marcar contatos
 * como favoritos sem a necessidade de uma conta de usuário ou banco de dados complexo.
 */

const KEY = 'agenda_favoritos';

/**
 * Retorna a lista de IDs de contatos favoritados.
 * 
 * @returns {number[]} Array contendo os IDs numéricos dos favoritos.
 */
export function getFavorites() {
  // O localStorage só existe no lado do cliente (navegador).
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Falha ao ler favoritos do localStorage:', error);
    return [];
  }
}

/**
 * Alterna (adiciona ou remove) um ID da lista de favoritos.
 * 
 * @param {number} id - O ID do contato a ser alternado.
 * @returns {number[]} A nova lista completa de IDs favoritados.
 */
export function toggleFavorite(id) {
  const favs = getFavorites();
  const idNum = parseInt(id, 10);
  
  const index = favs.indexOf(idNum);

  if (index > -1) {
    // Se já estiver na lista, removemos.
    favs.splice(index, 1);
  } else {
    // Se não estiver, adicionamos ao array.
    favs.push(idNum);
  }

  // Persistimos a lista atualizada no navegador.
  localStorage.setItem(KEY, JSON.stringify(favs));
  
  return favs;
}

/**
 * Verifica se um contato específico é favorito.
 * 
 * @param {number} id - O ID a ser verificado.
 * @returns {boolean} Verdadeiro se o ID constar na lista.
 */
export function isFavorite(id) {
  const idNum = parseInt(id, 10);
  return getFavorites().includes(idNum);
}
