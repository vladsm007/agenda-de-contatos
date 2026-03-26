'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Mapeamento de rotas primárias para títulos amigáveis.
 */
const TITLES = {
  '/': 'Agenda',
  '/favoritos': 'Favoritos',
  '/grupos': 'Grupos',
  '/recentes': 'Recentes',
  '/contato/novo': 'Novo Contato',
};

/**
 * Define o título do Header baseado na rota atual.
 * 
 * @param {string} pathname - A rota atual do Next.js.
 * @returns {string} O título formatado.
 */
function getTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.endsWith('/editar')) return 'Editar Contato';
  if (pathname.startsWith('/contato/')) return 'Detalhes';
  return 'Agenda';
}

/**
 * Lista de rotas que são consideradas abas principais (tabs).
 * Nestas rotas, o botão de "voltar" não deve ser exibido.
 */
const TAB_ROUTES = ['/', '/favoritos', '/grupos', '/recentes'];

/**
 * Componente Header
 * 
 * Barra superior persistente que se adapta à navegação.
 * - Exibe botão de voltar em páginas internas.
 * - Exibe botão de "Novo Contato" na página inicial.
 * - Exibe o título contextual da página.
 */
const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Verifica se estamos em uma aba principal para esconder o botão de voltar.
  const isTab = TAB_ROUTES.includes(pathname);

  return (
    <header className="
      sticky top-0 z-40 flex items-center justify-between
      h-14 px-4
      bg-surface-800/80 backdrop-blur-md
      border-b border-surface-700/50
      shadow-[0_2px_16px_rgba(0,0,0,0.35)]
    ">
      {/* Lado Esquerdo: Botão Voltar (aparece apenas em subpáginas) */}
      <div className="w-10 flex items-center">
        {!isTab && (
          <button
            id="header-back-btn"
            onClick={() => router.back()}
            aria-label="Voltar para a página anterior"
            className="flex items-center justify-center w-9 h-9 rounded-xl
              hover:bg-surface-700/60 active:scale-95 transition-all duration-150"
          >
            <Image 
              src="/arrow-left-white.svg" 
              alt="Ícone de voltar" 
              width={18} 
              height={18} 
            />
          </button>
        )}
      </div>

      {/* Centro: Título Dinâmico */}
      <h1 className="text-white font-bold text-base tracking-wide">
        {getTitle(pathname)}
      </h1>

      {/* Lado Direito: Botão Adicionar (aparece apenas na Home) */}
      <div className="w-10 flex items-center justify-end">
        {pathname === '/' && (
          <Link
            href="/contato/novo"
            id="header-add-btn"
            aria-label="Adicionar novo contato"
            className="flex items-center justify-center w-9 h-9 rounded-xl
              hover:bg-primary-500/20 active:scale-95 transition-all duration-150"
          >
            <Image 
              src="/plus-square-white.svg" 
              alt="Ícone de adicionar" 
              width={20} 
              height={20} 
            />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
