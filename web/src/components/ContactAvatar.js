import React from 'react';

/**
 * Cores pré-definidas para os Avatares.
 * Cada cor possui um fundo e uma sombra correspondente para o efeito de "glow".
 */
const COLORS = [
  { bg: '#1d4ed8', shadow: '#3b82f6' }, // Azul
  { bg: '#7c3aed', shadow: '#8b5cf6' }, // Roxo
  { bg: '#db2777', shadow: '#ec4899' }, // Rosa
  { bg: '#0891b2', shadow: '#06b6d4' }, // Ciano
  { bg: '#059669', shadow: '#10b981' }, // Verde
  { bg: '#d97706', shadow: '#f59e0b' }, // Amarelo
  { bg: '#dc2626', shadow: '#ef4444' }, // Vermelho
  { bg: '#7e22ce', shadow: '#a855f7' }, // Violeta
];

/**
 * Escolhe uma cor da lista baseada no nome do contato.
 * Isso garante que o mesmo nome sempre tenha a mesma cor (consistência visual).
 * 
 * @param {string} name - Nome do contato.
 * @returns {Object} Objeto com bg e shadow.
 */
function getColor(name = '') {
  // Utilizamos o código do primeiro caractere para selecionar o índice da cor.
  const code = (name.trim().toUpperCase().charCodeAt(0) || 65);
  return COLORS[code % COLORS.length];
}

/**
 * Extrai as iniciais de um nome. (Ex: "Victor Hugo" -> "VH")
 * 
 * @param {string} name - Nome completo.
 * @returns {string} Iniciais em caixa alta.
 */
function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0]?.slice(0, 2) || '?').toUpperCase();
}

/**
 * Tamanhos pré-configurados para o Avatar.
 */
const SIZES = {
  sm: { wh: 36, font: 13 },
  md: { wh: 48, font: 17 },
  lg: { wh: 72, font: 26 },
  xl: { wh: 96, font: 36 },
};

/**
 * Componente ContactAvatar
 * 
 * Renderiza um círculo colorido com as iniciais do contato.
 * Ideal para listas onde o usuário não possui uma foto de perfil.
 * 
 * @param {string} props.nome - O nome do contato para gerar iniciais e cor.
 * @param {string} props.size - Tamanho (sm, md, lg, xl). Padrão: md.
 * @param {string} props.className - Classes CSS extras.
 */
const ContactAvatar = ({ nome = '', size = 'md', className = '' }) => {
  const { bg, shadow } = getColor(nome);
  const { wh, font } = SIZES[size] || SIZES.md;

  return (
    <div
      aria-hidden="true" // Esconde do leitor de tela pois o nome já é lido no texto ao lado.
      className={`flex items-center justify-center rounded-full font-bold select-none flex-shrink-0 ${className}`}
      style={{
        width: wh, height: wh, minWidth: wh,
        backgroundColor: bg,
        boxShadow: `0 0 18px ${shadow}55`, // Efeito de glow sutil.
        fontSize: font,
        color: '#fff',
        letterSpacing: '0.05em',
      }}
    >
      {getInitials(nome)}
    </div>
  );
};

export default ContactAvatar;
