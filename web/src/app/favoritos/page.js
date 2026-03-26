'use client';

import React, { useState, useEffect } from 'react';
import { getFavorites } from '@/lib/favorites';
import { contatoApi } from '@/lib/api';
import ContactCard from '@/components/ContactCard';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

/**
 * Página: FavoritosPage
 * 
 * Exibe apenas os contatos que o usuário marcou como favoritos.
 * 
 * Lógica do Client-Side:
 * - Busca a lista completa de IDs favoritados no localStorage.
 * - Busca a lista completa de contatos cadastrados no servidor.
 * - Cruza as duas informações para exibir apenas o que o usuário quer.
 */
export default function FavoritosPage() {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * [EFEITO] Filtra contatos favoritados ao carregar a página.
   */
  useEffect(() => {
    // 1. Obtém os IDs do banco local do navegador.
    const idsFavoritos = getFavorites();
    
    // Pequena otimização: se não houver favoritados, nem buscamos no servidor.
    if (idsFavoritos.length === 0) {
      setLoading(false);
      return;
    }

    // 2. Busca lista atualizada de contatos.
    contatoApi.listar()
      .then((res) => {
        const all = res.data || [];
        // Filtramos para manter apenas quem está na lista de favoritos.
        const filtered = all.filter((c) => idsFavoritos.includes(c.id));
        setContatos(filtered);
      })
      .catch((err) => {
        console.error('Falha ao sincronizar favoritos:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col animate-[fadeIn_0.4s_ease-out]">
      
      {/* Estado: Carregando */}
      {loading && <LoadingState count={4} />}

      {/* Estado: Lista Vazia */}
      {!loading && contatos.length === 0 && (
        <EmptyState
          iconSrc="/star-white.svg"
          title="Nenhum contato favorito"
          description="Os contatos que você marcar com uma estrela aparecerão aqui para acesso rápido."
          action={
            <Link 
              href="/"
              className="px-8 py-3.5 bg-primary-500/10 border border-primary-400/30
                text-primary-300 text-sm font-semibold rounded-2xl
                hover:bg-primary-500/20 active:scale-95 transition-all duration-200"
            >
              Explorar Agenda
            </Link>
          }
        />
      )}

      {/* Estado: Renderização dos Favoritos */}
      {!loading && contatos.length > 0 && (
        <div className="flex flex-col gap-2 px-4 pt-4">
          <p className="px-2 pb-2 text-surface-500 text-[10px] font-bold uppercase tracking-widest">
            {contatos.length} contatos favoritados
          </p>
          {contatos.map((c) => (
            <ContactCard key={c.id} contato={c} />
          ))}
        </div>
      )}
    </div>
  );
}
