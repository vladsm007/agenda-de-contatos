import React from 'react';
import Link from 'next/link';
import ContactAvatar from './ContactAvatar';

/**
 * Formata uma string de telefone para exibição amigável.
 * Suporta formatos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
 * 
 * @param {string} tel - String de telefone bruta (apenas números).
 * @returns {string} Telefone formatado.
 */
function formatPhone(tel = '') {
  const d = tel.replace(/\D/g, ''); // Garante que temos apenas dígitos.
  
  if (d.length === 11) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  
  return tel; // Retorna original se não bater com o padrão esperado.
}

/**
 * Componente ContactCard
 * 
 * Exibe um resumo visual de um contato em listas (Home, Favoritos, Recentes).
 * É clicável e redireciona para a página de detalhes do contato.
 * 
 * @param {Object} props.contato - Objeto com os dados do contato do backend.
 */
const ContactCard = ({ contato }) => {
  if (!contato) return null;
  const { id, nome, telefone } = contato;

  return (
    <Link 
      href={`/contato/${id}`} 
      id={`contact-card-${id}`}
      aria-label={`Ver detalhes de ${nome}`}
    >
      <div className="
        flex items-center gap-3 px-4 py-3
        bg-surface-800/40 hover:bg-surface-700/50
        border border-surface-700/30 hover:border-primary-400/30
        rounded-2xl transition-all duration-200 active:scale-[0.98]
        group cursor-pointer
      ">
        {/* Usamos o Avatar para identificação rápida do contato. */}
        <ContactAvatar nome={nome} size="md" />
        
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-base truncate group-hover:text-primary-300 transition-colors">
            {nome}
          </p>
          <p className="text-surface-500 text-sm truncate">
            {formatPhone(telefone)}
          </p>
        </div>

        {/* Ícone de seta para indicar que o item é clicável. */}
        <span 
          aria-hidden="true" 
          className="text-surface-600 group-hover:text-surface-400 transition-colors text-lg"
        >
          ›
        </span>
      </div>
    </Link>
  );
};

export default ContactCard;
export { formatPhone };
