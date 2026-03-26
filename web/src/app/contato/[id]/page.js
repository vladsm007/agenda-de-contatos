'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { contatoApi } from '@/lib/api';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { addRecente } from '@/lib/recentes';
import { useToast } from '@/contexts/ToastContext';
import ContactAvatar from '@/components/ContactAvatar';

/**
 * Utilitários locais de formatação para exibição.
 */
function formatPhone(tel = '') {
  const d = tel.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return tel;
}

function formatCep(cep = '') {
  const d = cep.replace(/\D/g, '');
  if (d.length === 8) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return cep;
}

/**
 * Componente: InfoRow
 * 
 * Uma linha de informação reutilizável para o perfil do contato.
 * 
 * @param {string} props.emoji - Ícone representativo.
 * @param {string} props.label - Rótulo da informação (Ex: "E-mail").
 * @param {string} props.value - O dado em si.
 * @param {string} props.href - Link opcional (tel:, mailto:).
 */
const InfoRow = ({ emoji, label, value, href }) => (
  <a 
    href={href || undefined}
    className={`flex items-start gap-4 p-4 rounded-2xl
      bg-surface-800/40 border border-surface-700/30
      ${href ? 'hover:bg-surface-700/50 hover:border-primary-400/20 active:scale-[0.98] cursor-pointer' : 'cursor-default'}
      transition-all duration-200`}
  >
    <span className="text-xl flex-shrink-0 mt-0.5">{emoji}</span>
    <div className="flex-1 min-w-0">
      <p className="text-surface-500 text-[10px] font-bold mb-0.5 uppercase tracking-widest">{label}</p>
      <p className="text-surface-200 text-sm leading-relaxed font-medium">{value}</p>
    </div>
  </a>
);

/**
 * Página: ContatoDetailPage
 * 
 * Exibe o perfil completo de um contato individual.
 * Funcionalidades:
 * - Renderiza dados detalhados (Endereço, Tel, Email).
 * - Ações rápidas: Ligar, WhatsApp, Email.
 * - Gerenciamento de Favoritos (LocalStorage).
 * - Controle de Histórico (Recentes).
 * - Exclusão com confirmação visual dinâmica.
 */
export default function ContatoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [contato, setContato] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  /**
   * [EFEITO] Busca dados do contato e registra no histórico de recentes.
   */
  useEffect(() => {
    contatoApi.findOne(id)
      .then((res) => {
        const c = res.data;
        setContato(c);
        setFav(isFavorite(c.id));
        
        // [HISTÓRICO] Registramos a visita neste contato.
        addRecente(c);
      })
      .catch(() => {
        showToast('Contato não encontrado ou erro de rede.', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  /**
   * Inverte o estado de favorito do contato.
   */
  const handleToggleFav = () => {
    if (!contato) return;
    toggleFavorite(contato.id);
    setFav((f) => !f);
    showToast(fav ? 'Contato removido dos favoritos.' : 'Contato adicionado aos favoritos!', 'info');
  };

  /**
   * Processa a remoção do contato.
   */
  const handleDelete = async () => {
    // 1. Primeira interação apenas muda para modo de confirmação.
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    // 2. Segunda interação confirma a exclusão.
    setIsDeleting(true);
    try {
      await contatoApi.deletar(id);
      showToast('O contato foi removido da sua agenda.', 'success');
      router.push('/');
    } catch {
      showToast('Ocorreu um erro ao tentar excluir o contato.', 'error');
      setIsDeleting(false);
    }
  };

  // Estado: Carregando
  if (isLoading) return (
    <div className="flex flex-col items-center gap-6 pt-16 px-4 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-surface-700/80" />
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-48 bg-surface-700/80 rounded-full" />
        <div className="h-3 w-32 bg-surface-700/50 rounded-full" />
      </div>
    </div>
  );

  // Estado: Não encontrado
  if (!contato) return (
    <div className="flex flex-col items-center justify-center pt-24 gap-4 px-8 text-center">
      <p className="text-surface-500 text-sm italic">O contato buscado não foi encontrado em nossa base de dados.</p>
      <Link href="/" className="px-6 py-3 bg-surface-800 border border-surface-700 rounded-2xl text-primary-400 text-sm font-bold active:scale-95 transition-all">
        Voltar para a Lista
      </Link>
    </div>
  );

  return (
    <div className="px-4 pt-6 pb-8 flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Cabeçalho do Perfil (Avatar + Nome + Localização) */}
      <div className="flex flex-col items-center gap-4 pb-2">
        <ContactAvatar nome={contato.nome} size="xl" className="shadow-2xl" />
        
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold tracking-tight">{contato.nome}</h2>
          <p className="text-surface-500 text-sm mt-1.5 font-medium">
            {contato.cidade} — {contato.uf}
          </p>
        </div>

        {/* Grupo de Ações Rápidas (Chamada, WhatsApp, Email) */}
        <div className="flex gap-4 mt-2">
          {[
            { label: 'Ligar', emoji: '📞', href: `tel:${contato.telefone}` },
            { label: 'WhatsApp', emoji: '💬', href: `https://wa.me/55${contato.telefone.replace(/\D/g,'')}` },
            { label: 'E-mail', emoji: '✉️', href: `mailto:${contato.email}` },
          ].map((a) => (
            <a key={a.label} href={a.href} target="_blank" rel="noreferrer"
              className="flex flex-col items-center gap-2 px-5 py-3.5
                bg-surface-800/60 border border-surface-700/40 rounded-3xl
                hover:border-primary-400/40 hover:bg-surface-700/50
                active:scale-[0.94] transition-all duration-200 shadow-md">
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-surface-400 text-[10px] font-bold uppercase tracking-widest">{a.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Seção: Informações Detalhadas */}
      <div className="flex flex-col gap-2.5">
        <InfoRow emoji="📞" label="Telefone" value={formatPhone(contato.telefone)} href={`tel:${contato.telefone}`} />
        <InfoRow emoji="✉️" label="E-mail Pessoal" value={contato.email} href={`mailto:${contato.email}`} />
        <InfoRow 
          emoji="📍" 
          label="Endereço de Correspondência" 
          value={`${contato.logradouro}, ${contato.bairro}\n${contato.cidade} — ${contato.uf}\nCEP ${formatCep(contato.cep)}`} 
        />
      </div>

      {/* Botões de Ação de Conta (Favoritar / Editar) */}
      <div className="flex gap-3.5 pt-2">
        <button
          id="btn-favorito"
          onClick={handleToggleFav}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest
            transition-all duration-300 active:scale-[0.97] shadow-sm
            ${fav
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
              : 'bg-surface-800/60 border-surface-700/40 text-surface-400 hover:border-surface-600'}`}
        >
          <span className="text-base leading-none">{fav ? '★' : '☆'}</span>
          {fav ? 'Favoritado' : 'Favoritar'}
        </button>

        <Link
          href={`/contato/${id}/editar`}
          id="btn-editar"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest
            bg-primary-500/15 border-primary-400/30 text-primary-300 shadow-sm
            hover:bg-primary-500/25 active:scale-[0.97] transition-all duration-200"
        >
          ✏️ Editar Perfil
        </Link>
      </div>

      {/* Botão de Exclusão com Confirmação em Duas Etapas */}
      <button
        id="btn-deletar"
        onClick={handleDelete}
        disabled={isDeleting}
        className={`w-full py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest
          transition-all duration-300 active:scale-[0.97] disabled:opacity-50 shadow-md mt-2
          ${confirmDelete
            ? 'bg-red-500/25 border-red-500/50 text-red-300 animate-[pulse_1s_infinite]'
            : 'bg-surface-800/40 border-surface-700/40 text-surface-500 hover:border-red-500/30 hover:text-red-400'}`}
      >
        {isDeleting ? '⚙️ Processando...' : confirmDelete ? '⚠️ Confirmar Exclusão Definitiva' : 'Excluir Este Contato'}
      </button>
      
      {confirmDelete && (
        <button 
          onClick={() => setConfirmDelete(false)}
          className="text-surface-600 text-[10px] font-bold uppercase tracking-widest text-center hover:text-surface-400 transition-colors -mt-3"
        >
          Cancelar e manter contato
        </button>
      )}
    </div>
  );
}
