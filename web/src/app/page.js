'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { contatoApi } from '@/lib/api';
import ContactCard from '@/components/ContactCard';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';

/**
 * Agrupa uma lista de contatos pela primeira letra do nome.
 * 
 * Exemplo: { "A": [Ana, Alan], "B": [Bruno] }
 * 
 * @param {Object[]} contacts - Array de contatos da API.
 * @returns {Object} Contatos agrupados por letra (chave).
 */
function groupByLetter(contacts) {
  return contacts.reduce((acc, c) => {
    // Pegamos o primeiro caractere em maiúsculo ou '#' se não for letra.
    const letter = c.nome?.trim()[0]?.toUpperCase() || '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});
}

/**
 * Página Principal (Home)
 * 
 * Exibe a lista completa de contatos cadastrados.
 * Funcionalidades:
 * - Busca local em tempo real (Filtra por Nome e E-mail).
 * - Agrupamento alfabético (A-Z).
 * - Estados de carregamento (Skeleton) e erro.
 */
export default function ContatosPage() {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  /**
   * [EFEITO] Busca a lista de contatos do backend logo após carregar a página.
   */
  useEffect(() => {
    contatoApi.listar()
      .then((res) => {
        // Sucesso: Guardamos os contatos recebidos em estado.
        setContatos(res.data || []);
      })
      .catch((err) => {
        // Erro: Definimos uma mensagem informativa.
        setError('Não foi possível carregar os contatos do servidor.');
        console.error('Falha ao buscar contatos:', err);
      })
      .finally(() => {
        // Sempre: Desativamos o estado de carregamento após a resposta.
        setLoading(false);
      });
  }, []);

  /**
   * [MEMO] Realiza a filtragem dos contatos conforme o termo de busca.
   * O useMemo evita reprocessar a lista se nada mudou, melhorando o desempenho.
   */
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return contatos;
    
    return contatos.filter(
      (c) => c.nome?.toLowerCase().includes(query) || 
             c.email?.toLowerCase().includes(query)
    );
  }, [contatos, search]);

  /**
   * [MEMO] Gera o agrupamento alfabético dos contatos filtrados.
   */
  const grouped = useMemo(() => groupByLetter(filtered), [filtered]);
  const letters = Object.keys(grouped).sort(); // Lista ordenada de letras (A, B, C...).

  return (
    <div className="flex flex-col animate-[fadeIn_0.5s_ease-out]">
      
      {/* Barra de Pesquisa */}
      <div className="px-4 pt-4 pb-2 sticky top-14 z-30 bg-background/95 backdrop-blur-sm">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 text-sm group-focus-within:text-primary-400 transition-colors">🔍</span>
          <input
            id="search-input"
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-800/70 border border-surface-700/50
              rounded-2xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-surface-500
              focus:outline-none focus:border-primary-400/60 focus:bg-surface-800
              transition-all duration-200 shadow-sm"
          />
        </div>
      </div>

      {/* Caso: Carregando (Esqueleto) */}
      {loading && <LoadingState count={8} />}

      {/* Caso: Erro de Conexão */}
      {!loading && error && (
        <EmptyState
          iconSrc="/x-white.svg"
          title="Servidor indisponível"
          description={error}
        />
      )}

      {/* Caso: Nenhum Resultado Encontrado */}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          iconSrc="/user-white.svg"
          title={search ? 'Nenhum resultado encontrado' : 'Sua agenda está vazia'}
          description={
            search
              ? `Não encontramos ninguém com o termo "${search}".`
              : 'Comece adicionando novos contatos através do botão "+" no topo da tela.'
          }
        />
      )}

      {/* Caso: Renderização da Lista Agrupada */}
      {!loading && !error && letters.map((letter) => (
        <section key={letter} className="mb-4">
          {/* Cabeçalho da Letra (Ex: A) */}
          <div className="px-6 pt-4 pb-2">
            <span className="text-primary-400 text-xs font-bold tracking-[0.2em] uppercase bg-primary-500/10 px-2 py-0.5 rounded">
              {letter}
            </span>
          </div>
          
          {/* Renderização dos Item-Cards daquela letra */}
          <div className="flex flex-col gap-2 px-4">
            {grouped[letter].map((c) => (
              <ContactCard key={c.id} contato={c} />
            ))}
          </div>
        </section>
      ))}

      {/* Espaçamento extra no final para não sumir atrás da barra inferior */}
      <div className="h-8" />
    </div>
  );
}
