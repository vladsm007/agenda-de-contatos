'use client';

import React from 'react';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

/**
 * Página: GruposPage (Em Desenvolvimento)
 * 
 * Atualmente funciona como um "placeholder" ou "coming soon" para a funcionalidade de grupos.
 * Demonstra o uso de estados vazios para funcionalidades planejadas, melhorando a percepção do usuário sobre o Roadmap.
 */
export default function GruposPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-[fadeIn_0.5s_ease-out]">
      <EmptyState
        iconSrc="/users-white.svg"
        title="Organize seus contatos em grupos"
        description="Em breve você poderá criar grupos como 'Trabalho', 'Família' e 'Amigos' para localizar seus contatos ainda mais rápido."
        action={
          <div className="flex flex-col items-center gap-4">
            {/* Visual Preview: Demonstra como os grupos poderiam ser exibidos. */}
            <div className="flex gap-2.5">
              {['Família', 'Trabalho', 'Amigos'].map((g) => (
                <span key={g}
                  className="px-4 py-2 rounded-2xl border border-surface-700/60
                    text-surface-500 text-xs font-semibold bg-surface-800/40
                    shadow-sm opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                >
                  {g}
                </span>
              ))}
            </div>
            
            {/* Botão de Retorno */}
            <Link 
              href="/"
              className="mt-4 px-8 py-3.5 bg-surface-800/60 border border-surface-700/50
                text-surface-300 text-sm font-bold rounded-2xl
                hover:border-primary-400/40 hover:text-primary-300 transition-all duration-300"
            >
              Voltar para a Agenda
            </Link>
          </div>
        }
      />
    </div>
  );
}
