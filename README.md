# 📒 Agenda de Contatos - Full Stack Next.js & Node.js

Bem-vindo ao projeto **Agenda de Contatos**! Este é um aplicativo full-stack moderno, desenvolvido com foco em performance, experiência do usuário (UX) mobile-first e integração com APIs externas (ViaCEP).

Este documento servirá como um guia completo para você, desenvolvedor, entender como o projeto foi construído, como executá-lo e como ele funciona internamente.

---

## 🚀 Tecnologias Utilizadas

### Frontend (Web)

- **Next.js 15 (App Router)**: Framework React para aplicações web modernas.
- **Tailwind CSS**: Estilização baseada em utilitários para design responsivo e glassmorphism.
- **Context API (React)**: Gerenciamento de estado global para notificações (Toasts).
- **LocalStorage**: Persistência no lado do cliente para Favoritos e Histórico.

### Backend (API)

- **Node.js + Express**: Servidor robusto para rotas RESTful.
- **Prisma ORM**: Comunicação simplificada e tipada com o banco de dados.
- **PostgreSQL**: Banco de dados relacional para armazenamento dos contatos.
- **Axios**: Consumo da API externa ViaCEP.

---

## 📂 Arquitetura do Projeto

O projeto é dividido em dois diretórios principais:

### 1. `api/` (O Cérebro)

- **Controllers**: Onde reside a lógica de negócio (ex: verificar se um e-mail já existe).
- **Routes**: Define as URLs da API e quais funções do controller elas chamam.
- **Middlewares**: Filtros que validam se os dados enviados pelo usuário estão corretos antes de salvar no banco.
- **Services**: Integrações com serviços externos (ViaCEP).
- **Prisma**: Gerencia a criação das tabelas no banco de dados.

### 2. `web/` (O Rosto)

- **App Router (`app/`)**: Define as páginas e o layout da aplicação.
- **Components**: Pequenos pedaços de interface reutilizáveis (Card, Botão, Avatar).
- **Lib**: Funções utilitárias e comunicação centralizada com a API (`api.js`).
- **Contexts**: Gerencia avisos visuais (sucesso/erro) que aparecem para o usuário.

---

## 🛠️ Como Instalar e Rodar

### Pré-requisitos

- Node.js (v18 ou superior) instalado.
- Banco de Dados PostgreSQL configurado ou rodando via Docker.

### Passo 1: Configurar a API

1. Entre na pasta `api/`:
   ```bash
   cd api
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` seguindo o modelo. Você precisará definir a `DATABASE_URL`.
4. Sincronize o banco de dados com o Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
   _A API rodará em http://localhost:5000_

### Passo 2: Configurar o Frontend

1. Em um novo terminal, entre na pasta `web/`:
   ```bash
   cd web
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o Next.js:
   ```bash
   npm run dev
   ```
   _O App rodará em http://localhost:3000_

---

## 🧠 Lógicas Importantes

### 1. Busca Automática de Endereço (CEP)

Quando você digita o CEP no formulário, o frontend detecta quando você sai do campo (`onBlur`) e chama a API. A API, por sua vez, consulta o ViaCEP e devolve o endereço completo. Isso economiza tempo do usuário.

### 2. Validação "Fail-Fast"

Validamos os dados no **Frontend** (para resposta instantânea ao usuário) e no **Backend** (para segurança total). Se o e-mail já existe no banco, a API bloqueia a criação e envia uma mensagem amigável.

### 3. Favoritos e Recentes sem Login

Para manter o projeto simples e rápido, os dados de "Favoritos" e "Vistos Recentemente" são salvos no **LocalStorage** do seu navegador. Ou seja, cada dispositivo tem sua própria lista personalizada sem precisar de uma tabela de usuários no banco.

### 4. Animações e Estilo

Usamos animações suaves do Tailwind (`animate-pulse` para carregamento, `active:scale` para cliques) para dar uma sensação de aplicativo nativo de celular.


Feito com ❤️ por **Victor M. Torres**.
