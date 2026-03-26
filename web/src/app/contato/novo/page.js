'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { contatoApi } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

/**
 * Classes CSS reutilizáveis para inputs e labels seguindo o design system.
 */
const INPUT_STYLE = `w-full bg-surface-900/80 border border-surface-700/50 rounded-2xl
  px-4 py-3.5 text-white text-sm placeholder-surface-600
  focus:outline-none focus:border-primary-400/70 focus:bg-surface-900
  transition-all duration-200`;

const LABEL_STYLE = `block text-surface-400 text-xs font-semibold mb-1.5 tracking-wide uppercase`;

/**
 * Funções Utilitárias de Máscara de Input (UX).
 * Elas formatam o texto enquanto o usuário digita.
 */

const maskPhone = (value) => {
  if (!value) return '';
  const val = value.replace(/\D/g, ''); // Remove tudo que não for dígito.
  if (val.length <= 10) {
    // Formato: (00) 0000-0000
    return val.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  // Formato: (00) 00000-0000 (celular com 9 dígitos)
  return val.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
};

const maskCep = (value) => {
  if (!value) return '';
  const val = value.replace(/\D/g, '').slice(0, 8); // Limita a 8 dígitos.
  // Formato: 00000-000
  return val.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Busca dados de endereço via API pública do ViaCEP.
 * 
 * @param {string} cep - O CEP a ser pesquisado.
 * @returns {Promise<Object|null>} Dados do endereço ou null se falhar.
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
  } catch (err) {
    console.error('Erro ao buscar CEP:', err);
    return null;
  }
}

/**
 * Página: NovoContatoPage
 * 
 * Formulário interativo para criação de novos contatos.
 * - Inclui máscaras automáticas para Telefone e CEP.
 * - Busca de endereço automática ao preencher o CEP.
 * - Validação de campos obrigatórios e formato de dados.
 */
export default function NovoContatoPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Estados do formulário.
  const [form, setForm] = useState({ 
    nome: '', 
    email: '', 
    telefone: '', 
    cep: '' 
  });
  
  const [endereco, setEndereco] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Atualiza o estado do formulário aplicando máscaras nos campos específicos.
   */
  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    
    // Aplicamos máscara visual em tempo real.
    if (field === 'telefone') value = maskPhone(value);
    if (field === 'cep') value = maskCep(value);

    setForm((prev) => ({ ...prev, [field]: value }));
    
    // Limpamos o erro do campo quando o usuário digita novamente.
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Evento disparado quando o usuário termina de preencher o CEP.
   */
  const handleCepBlur = async () => {
    const raw = form.cep.replace(/\D/g, '');
    if (raw.length !== 8) return;
    
    setCepLoading(true);
    const result = await lookupCep(raw);
    setEndereco(result);
    setCepLoading(false);
  };

  /**
   * Valida o formulário antes do envio.
   * 
   * @returns {boolean} Verdadeiro se estiver tudo ok.
   */
  const validateForm = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'O nome completo é obrigatório.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Insira um e-mail válido.';
    if (form.telefone.replace(/\D/g, '').length < 10) e.telefone = 'O telefone deve ter DDD + número.';
    if (form.cep.replace(/\D/g, '').length !== 8) e.cep = 'O CEP deve ter exatamente 8 dígitos.';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /**
   * Processa o envio do formulário para a API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      // Enviamos apenas os números para a API (normalização).
      const payload = {
        ...form,
        telefone: form.telefone.replace(/\D/g, ''),
        cep: form.cep.replace(/\D/g, ''),
      };

      await contatoApi.criar(payload);
      showToast('Contato adicionado com sucesso!', 'success');
      router.push('/');
    } catch (err) {
      // Se a API retornou erros específicos, mostramos o principal deles.
      showToast(err.message || 'Houve um problema ao salvar.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-4 pt-4 pb-8 animate-[fadeIn_0.4s_ease-out]">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        {/* Nome Completo */}
        <div className="flex flex-col">
          <label htmlFor="nome" className={LABEL_STYLE}>Nome Completo</label>
          <input 
            id="nome" 
            name="nome"
            type="text" 
            placeholder="Ex: João Silva"
            value={form.nome} 
            onChange={handleInputChange('nome')} 
            autoComplete="name"
            className={`${INPUT_STYLE} ${errors.nome ? 'border-red-500/50' : ''}`} 
          />
          {errors.nome && <p className="text-red-400 text-xs mt-1 font-medium">{errors.nome}</p>}
        </div>

        {/* Telefone */}
        <div className="flex flex-col">
          <label htmlFor="telefone" className={LABEL_STYLE}>Celular / Telefone</label>
          <input 
            id="telefone" 
            name="telefone"
            type="tel" 
            placeholder="(11) 99999-9999"
            value={form.telefone} 
            onChange={handleInputChange('telefone')} 
            autoComplete="tel"
            className={`${INPUT_STYLE} ${errors.telefone ? 'border-red-500/50' : ''}`} 
          />
          {errors.telefone && <p className="text-red-400 text-xs mt-1 font-medium">{errors.telefone}</p>}
        </div>

        {/* E-mail */}
        <div className="flex flex-col">
          <label htmlFor="email" className={LABEL_STYLE}>E-mail</label>
          <input 
            id="email" 
            name="email"
            type="email" 
            placeholder="email@exemplo.com"
            value={form.email} 
            onChange={handleInputChange('email')} 
            autoComplete="email"
            className={`${INPUT_STYLE} ${errors.email ? 'border-red-500/50' : ''}`} 
          />
          {errors.email && <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>}
        </div>

        {/* CEP e Endereço */}
        <div className="flex flex-col">
          <label htmlFor="cep" className={LABEL_STYLE}>CEP</label>
          <input 
            id="cep" 
            name="cep"
            type="text" 
            placeholder="00000-000" 
            maxLength={9}
            value={form.cep} 
            onChange={handleInputChange('cep')} 
            onBlur={handleCepBlur}
            autoComplete="postal-code"
            className={`${INPUT_STYLE} ${errors.cep ? 'border-red-500/50' : ''}`} 
          />
          {errors.cep && <p className="text-red-400 text-xs mt-1 font-medium">{errors.cep}</p>}
          
          {/* Feedback Visual da Busca de Endereço */}
          {cepLoading && (
            <p className="text-primary-400 text-[10px] mt-2 font-bold animate-pulse">📦 Localizando endereço...</p>
          )}

          {endereco && !cepLoading && (
            <div className="mt-3 px-4 py-3 rounded-2xl bg-surface-800/60 border border-primary-500/20 shadow-inner">
              <p className="text-surface-300 text-xs leading-relaxed">
                <span className="text-primary-400 font-bold block mb-1">📍 Endereço Identificado:</span>
                {endereco.logradouro}, {endereco.bairro}<br />
                {endereco.cidade} — {endereco.uf}
              </p>
            </div>
          )}
        </div>

        {/* Botão de Envio (Ação Principal) */}
        <button
          id="submit-contact"
          type="submit"
          disabled={isSaving}
          className="w-full py-4 mt-2 rounded-2xl bg-primary-500 hover:bg-primary-400
            text-white font-bold text-base tracking-wide
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-[0.98] transition-all duration-200
            shadow-[0_4px_20px_rgba(30,58,138,0.5)]"
        >
          {isSaving ? '⏳ Salvando...' : 'Salvar Contato'}
        </button>
      </form>
    </div>
  );
}
