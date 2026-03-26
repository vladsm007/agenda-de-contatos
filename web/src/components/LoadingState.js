import React from 'react';

/**
 * Componente SkeletonCard
 * 
 * Um item individual carregando que imita o formato do ContactCard.
 * Usado para reduzir a percepção de espera do usuário (UX).
 */
const SkeletonCard = () => (
  <div 
    aria-hidden="true" 
    className="flex items-center gap-3 p-4 bg-surface-800/40 rounded-2xl border border-surface-700/30 animate-pulse"
  >
    {/* Avatar skeleton */}
    <div className="w-12 h-12 rounded-full bg-surface-700/80 flex-shrink-0" />
    
    <div className="flex-1 space-y-2">
      {/* Título skeleton */}
      <div className="h-4 bg-surface-700/80 rounded-full w-3/5" />
      {/* Subtítulo skeleton */}
      <div className="h-3 bg-surface-700/50 rounded-full w-2/5" />
    </div>
    
    {/* Ícone de seta skeleton */}
    <div className="w-4 h-4 rounded bg-surface-700/40" />
  </div>
);

/**
 * Componente LoadingState
 * 
 * Exibido enquando a API responde com os dados da lista de contatos.
 * 
 * @param {number} props.count - Quantos cards de esqueleto mostrar. Padrão: 6.
 */
const LoadingState = ({ count = 6 }) => (
  <div 
    className="flex flex-col gap-2 px-4 pt-3"
    aria-label="Carregando lista de contatos..."
    role="status" // Informa ao leitor de tela que um processo está ocorrendo.
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingState;
