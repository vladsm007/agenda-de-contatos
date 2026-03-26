import React from 'react';

/**
 * Componente EmptyState
 * 
 * Exibido quando uma lista está vazia ou quando ocorre um erro.
 * Proporciona uma interface amigável com um ícone, título descritivo e uma ação opcional.
 * 
 * @param {React.ElementType} props.icon - Componente de ícone (ex: Lucide).
 * @param {string} props.iconSrc - Caminho para um arquivo de imagem SVG/PNG.
 * @param {string} props.title - Título principal em destaque.
 * @param {string} props.description - Texto explicativo secundário.
 * @param {React.ReactNode} props.action - Botão ou link de ação para o usuário.
 */
const EmptyState = ({ icon: Icon, iconSrc, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center animate-[fadeIn_0.5s_ease-out]">
      {/* Container de ícone circular desbotado */}
      {iconSrc && (
        <div className="mb-6 p-5 rounded-full bg-surface-800/60 border border-surface-700/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} alt="" width={40} height={40} className="opacity-30" />
        </div>
      )}
      
      {/* Caso passe um componente de ícone (ex: lucide-react) */}
      {Icon && (
        <div className="mb-6 p-5 rounded-full bg-surface-800/60 border border-surface-700/40">
          <Icon size={40} className="opacity-30 text-surface-400" />
        </div>
      )}

      <h3 className="text-surface-200 text-lg font-semibold mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-surface-500 text-sm leading-relaxed mb-6 max-w-xs">
          {description}
        </p>
      )}

      {/* Renderiza o botão/ação se fornecido. */}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
