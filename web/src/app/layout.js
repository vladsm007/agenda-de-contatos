import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MenuBar from "@/components/MenuBar";
import { ToastProvider } from "@/contexts/ToastContext";

/**
 * Configuração das fontes do Google para o projeto.
 * O Next.js otimiza o carregamento dessas fontes automaticamente.
 */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadados globais da aplicação.
 * Utilizado por motores de busca (SEO) e para o título da aba do navegador.
 */
export const metadata = {
  title: "Agenda de Contatos",
  description: "Gerencie seus contatos com facilidade e rapidez.",
};

/**
 * RootLayout: O componente pai de todas as páginas da aplicação.
 *
 * Estrutura:
 * - Define a linguagem e as fontes globais.
 * - Envolve a aplicação com o ToastProvider (notificações).
 * - Renderiza o Header e a MenuBar (barra inferior) de forma persistente.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary-500/30 suppressHydrationWarning`}
      >
        {/* Provedor de Contexto para mensagens de feedback (Sucesso/Erro) */}
        <ToastProvider>
          {/* Cabeçalho da aplicação (Sticky/Fixo no topo) */}
          <Header />

          {/* Conteúdo principal da página atual */}
          {/* pb-20 garante espaço para a barra de navegação inferior não cobrir o conteúdo */}
          <main className="min-h-screen pb-20">{children}</main>

          {/* Menu de navegação inferior (Estilo Mobile) */}
          <MenuBar />
        </ToastProvider>
      </body>
    </html>
  );
}
