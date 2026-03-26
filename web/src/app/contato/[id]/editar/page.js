'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contatoApi } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

/**
 * Constantes de Estilização Reutilizáveis (Design System).
 */
const INPUT_STYLE = `w-full bg-surface-900/80 border border-surface-700/50 rounded-2xl
  px-4 py-3.5 text-white text-sm placeholder-surface-600
  focus:outline-none focus:border-primary-400/70 focus:bg-surface-900
  transition-all duration-200`;

const LABEL_STYLE = `block text-surface-400 text-xs font-semibold mb-1.5 tracking-wide uppercase`;

/**
 * Utilitários de Máscaras (UX).
 */
const maskPhone = (value) => {
  if (!value) return '';
  const val = value.replace(/\D/g, '');
  if (val.length <= 10) return val.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return val.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
};

const maskCep = (value) => {
  if (!value) return '';
  const val = value.replace(/\D/g, '').slice(0, 8);
  return val.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Busca de endereço via API ViaCEP.
 */
async function lookupCep(cep) {
  const raw = cep.replace(/\D/g, '');
  if (raw.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return { 
      logradouro: data.logradouro, 
      bairro: data.bairro, 
      cidade: data.localidade, 
      uf: data.uf 
    };
  } catch { return null; }
}

/**
 * Página: EditarContatoPage
 * 
 * Permite ao usuário alterar as informações de um contato existente.
 * - Pré-popula os dados a partir da API.
 * - Inclui validação de campos obrigatórios.
 * - Inclui máscaras visuais (Telefone/CEP) e consulta de endereço automática.
 */
export default function EditarContatoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({ 
    nome: '', 
    email: '', 
    telefone: '', 
    cep: '' 
  });
  
  const [originalCep, setOriginalCep] = useState('');
  const [endereco, setEndereco] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * [EFEITO] Carrega os dados do contato quando a página inicia.
   */
  useEffect(() => {
    contatoApi.findOne(id)
      .then((res) => {
        const c = res.data;
        setForm({ 
          nome: c.nome, 
          email: c.email, 
          telefone: maskPhone(c.telefone), // Aplicamos a máscara no dado bruto vindo da API.
          cep: maskCep(c.cep) // Aplicamos a máscara no dado bruto vindo da API.
        });
        setOriginalCep(c.cep);
        setEndereco({ 
          logradouro: c.logradouro, 
          bairro: c.bairro, 
          cidade: c.cidade, 
          uf: c.uf 
        });
      })
      .catch(() => showToast('Não foi possível carregar os dados do contato.', 'error'))
      .finally(() => setIsLoading(false));
  }, [id]);

  /**
   * Handlers de Formulário.
   */
  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'telefone') value = maskPhone(value);
    if (field === 'cep') value = maskCep(value);

    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleCepBlur = async () => {
    const raw = form.cep.replace(/\D/g, '');
    if (raw === originalCep.replace(/\D/g, '')) return; // Evita busca se não mudou.
    if (raw.length !== 8) return;
    
    setCepLoading(true);
    const result = await lookupCep(raw);
    setEndereco(result);
    setCepLoading(false);
  };

  /**
   * Validação local antes do envio (Fail fast).
   */
  const validateForm = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'E-mail inválido.';
    if (form.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Telefone incompleto.';
    if (form.cep.replace(/\D/g, '').length !== 8) e.cep = 'CEP incompleto.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /**
   * Processamento do Envio (Submit).
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        telefone: form.telefone.replace(/\D/g, ''),
        cep: form.cep.replace(/\D/g, ''),
      };

      await contatoApi.atualizar(id, payload);
      showToast('Contato atualizado!', 'success');
      router.push(`/contato/${id}`);
    } catch (err) {
      showToast(err.message || 'Erro ao salvar alterações.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Estado de carregamento inicial.
  if (isLoading) return (
    <div className="px-4 pt-6 flex flex-col gap-5">
      {[1,2,3,4].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-3 w-16 bg-surface-700/60 rounded mb-2" />
          <div className="h-12 bg-surface-800/60 rounded-2xl" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="px-4 pt-4 pb-8 animate-[fadeIn_0.4s_ease-out]">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        {/* Campo: Nome */}
        <div className="flex flex-col">
          <label htmlFor="edit-nome" className={LABEL_STYLE}>Nome Completo</label>
          <input 
            id="edit-nome" 
            name="nome"
            type="text" 
            value={form.nome} 
            onChange={handleInputChange('nome')} 
            className={`${INPUT_STYLE} ${errors.nome ? 'border-red-500/50' : ''}`} 
          />
          {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
        </div>

        {/* Campo: Telefone */}
        <div className="flex flex-col">
          <label htmlFor="edit-tel" className={LABEL_STYLE}>Celular / Telefone</label>
          <input 
            id="edit-tel" 
            name="telefone"
            type="tel" 
            value={form.telefone} 
            onChange={handleInputChange('telefone')} 
            className={`${INPUT_STYLE} ${errors.telefone ? 'border-red-500/50' : ''}`} 
          />
          {errors.telefone && <p className="text-red-400 text-xs mt-1">{errors.telefone}</p>}
        </div>

        {/* Campo: E-mail */}
        <div className="flex flex-col">
          <label htmlFor="edit-email" className={LABEL_STYLE}>E-mail</label>
          <input 
            id="edit-email" 
            name="email"
            type="email" 
            value={form.email} 
            onChange={handleInputChange('email')} 
            className={`${INPUT_STYLE} ${errors.email ? 'border-red-500/50' : ''}`} 
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Campo: CEP */}
        <div className="flex flex-col">
          <label htmlFor="edit-cep" className={LABEL_STYLE}>CEP</label>
          <input 
            id="edit-cep" 
            name="cep"
            type="text" 
            maxLength={9}
            value={form.cep} 
            onChange={handleInputChange('cep')} 
            onBlur={handleCepBlur}
            className={`${INPUT_STYLE} ${errors.cep ? 'border-red-500/50' : ''}`} 
          />
          {errors.cep && <p className="text-red-400 text-xs mt-1">{errors.cep}</p>}
          
          {cepLoading && (
            <p className="text-primary-400 text-[10px] mt-2 font-bold animate-pulse">📦 Atualizando endereço...</p>
          )}

          {endereco && !cepLoading && (
            <div className="mt-3 px-4 py-3 rounded-2xl bg-surface-800/60 border border-primary-500/20 shadow-inner">
              <p className="text-surface-300 text-xs leading-relaxed">
                <span className="text-primary-400 font-bold block mb-1">📍 Localização Atualizada:</span>
                {endereco.logradouro}, {endereco.bairro}<br />
                {endereco.cidade} — {endereco.uf}
              </p>
            </div>
          )}
        </div>

        {/* Controles de Ação */}
        <div className="flex gap-4 pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-4 rounded-2xl border border-surface-700/50
              text-surface-400 font-semibold text-sm
              hover:bg-surface-800/60 active:scale-[0.98] transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            id="submit-edit"
            type="submit"
            disabled={isSaving}
            className="flex-1 py-4 rounded-2xl bg-primary-500 hover:bg-primary-400
              text-white font-bold text-sm tracking-wide
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98] transition-all duration-200
              shadow-[0_4px_20px_rgba(30,58,138,0.4)]"
          >
            {isSaving ? '⏳ Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
