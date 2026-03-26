'use client';

import React, { useState, useEffect } from 'react';
import { getRecentes, clearRecentes } from '@/lib/recentes';
import ContactCard from '@/components/ContactCard';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

/**
 * Página: RecentesPage
 * 
 * Exibe o histórico de contatos que o usuário visualizou recentemente.
 * Os dados são carregados apenas do localStorage para garantir rapidez e privacidade.
 */
export default function RecentesPage() {
  const [recentes, setRecentes] = useState([]);

  /**
   * [EFEITO] Sincroniza o estado com o banco de dados local do navegador.
   */
  useEffect(() => {
    setRecentes(getRecentes());
  }, []);

  /**
   * Remove todo o histórico de contatos visualizados.
   */
  const handleClear = () => {
    // 1. Limpa o storage.
    clearRecentes();
    // 2. Atualiza a interface (UI).
    setRecentes([]);
  };

  return (
    <div className="flex flex-col animate-[fadeIn_0.4s_ease-out]">
      
      {/* Caso: Nenhum contato registrado no histórico. */}
      {recentes.length === 0 ? (
        <EmptyState
          iconSrc="/archive-white.svg"
          title="Histórico de visitas limpo"
          description="Os últimos contatos que você visualizar aparecerão nesta lista para acesso rápido."
          action={
            <Link 
              href="/"
              className="px-8 py-3.5 bg-primary-500/10 border border-primary-400/30
                text-primary-300 text-sm font-semibold rounded-2xl
                hover:bg-primary-500/20 active:scale-95 transition-all duration-200"
            >
              Consultar Agenda
            </Link>
          }
        />
      ) : (
        <>
          {/* Cabeçalho de Controle do Histórico */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <span className="text-surface-500 text-[10px] font-bold uppercase tracking-widest">
              {recentes.length} contatos visualizados
            </span>
            <button
              onClick={handleClear}
              className="text-[10px] font-bold text-red-400/70 hover:text-red-400 
                bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/20
                hover:border-red-500/40 transition-all duration-300 uppercase leading-none"
            >
              Limpar Tudo
            </button>
          </div>
          
          {/* Renderização da Lista de Recentes */}
          <div className="flex flex-col gap-2 px-4 mt-2">
            {recentes.map((c) => (
              <ContactCard key={c.id} contato={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
