'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Definição dos itens de navegação da barra inferior.
 * Melhora a manutenção, facilitando a adição/remoção de abas futuramente.
 */
const NAV_ITEMS = [
  { 
    id: 'contatos',  
    label: 'Contatos',  
    href: '/',          
    icon: '/user-white.svg',    
    iconActive: '/user.svg'    
  },
  { 
    id: 'favoritos', 
    label: 'Favoritos', 
    href: '/favoritos', 
    icon: '/star-white.svg',    
    iconActive: '/star.svg'    
  },
  { 
    id: 'grupos',    
    label: 'Grupos',    
    href: '/grupos',    
    icon: '/users-white.svg',   
    iconActive: '/users.svg'   
  },
  { 
    id: 'recentes',  
    label: 'Recentes',  
    href: '/recentes',  
    icon: '/archive-white.svg', 
    iconActive: '/archive.svg' 
  },
];

/**
 * Lista das rotas onde a barra de navegação deve ser exibida.
 * No ambiente mobile-first, escondemos a barra em páginas de detalhe/edição
 * para maximizar o espaço útil do conteúdo.
 */
const VISIBLE_ROUTES = ['/', '/favoritos', '/grupos', '/recentes'];

/**
 * Componente MenuBar (Bottom Navigation Bar)
 * 
 * Barra de navegação inferior estilo nativo (iOS/Android).
 * - Utiliza Link do Next.js para navegação rápida.
 * - Destaca a aba ativa com animações suaves e efeito de glow.
 * - Possui efeito glassmorphism (backdrop-blur) para visual moderno.
 */
const MenuBar = () => {
  const pathname = usePathname();
  
  // Decide se deve renderizar a barra baseada na rota atual.
  const isVisible = VISIBLE_ROUTES.includes(pathname);
  if (!isVisible) return null;

  return (
    <nav
      aria-label="Menu principal de navegação"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around
        h-16 px-2 bg-surface-800/80 backdrop-blur-md
        border-t border-surface-700/60 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
    >
      {NAV_ITEMS.map((item) => {
        // Aba é considerada ativa se o pathname for idêntico ao link.
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.id}
            href={item.href}
            id={`nav-${item.id}`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1
              flex-1 h-full rounded-xl transition-all duration-300 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400
              ${isActive ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100 hover:scale-105'}`}
          >
            {/* Indicador de linha superior para o item selecionado */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary-400 animate-[fadeIn_0.3s_ease-out]" />
            )}
            
            {/* Fundo de destaque suave no item selecionado */}
            {isActive && (
              <span className="absolute inset-x-1 inset-y-1 rounded-xl bg-primary-500/15 border border-primary-400/20" />
            )}

            {/* Ícone: muda para a versão colorida quando ativo */}
            <span className="relative z-10">
              <Image
                src={isActive ? item.iconActive : item.icon}
                alt="" // O rótulo abaixo já é lido, então este ícone é decorativo aqui.
                width={22} 
                height={22}
                className={`transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_6px_rgba(99,149,255,0.8)]' : ''}`}
              />
            </span>

            {/* Texto da aba */}
            <span className={`relative z-10 text-[10px] font-semibold tracking-wide leading-none transition-all duration-300
              ${isActive ? 'text-primary-300' : 'text-surface-500'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MenuBar;
