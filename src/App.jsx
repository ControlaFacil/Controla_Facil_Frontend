import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HeaderU } from "./components/HeaderU";
import { HomeU } from "./components/HomeU";
import { LoginU } from "./components/LoginU";
import { Cadastro } from "./components/Cadastro";
import { MeusDados } from "./components/MeusDados";
import { CadastroParceiro } from "./components/CadastroParceiro";
import { CadastroProduto } from "./components/CadastroProduto";
import { Estoque } from "./components/Estoque";
import { EmailConfirmation } from "./components/EmailConfirmation";
import { EmailValidado } from "./components/EmailValidado"
import { EmailValidationFailed } from "./components/EmailValidationFailed";
import { DashboardEstoque } from "./components/DashBoardEstoque";
import { MarketplaceIntegrations } from "./components/MarketplaceIntegrations";
import { MarketplaceAuthSuccess } from "./components/MarketplaceAuthSuccess";
import { MarketplaceAuthError } from "./components/MarketplaceAuthError";
import './global.css';

function LayoutWithHeader() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const hideHeaderOnRoutes = ["/", "/cadastro", "/email-confirmacao", "/email-validado", "/email-falha-validacao", "/ml-auth-success", "/ml-auth-error"];

  useEffect(() => {
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isSidebarCollapsed]);

  return (
    <div className="main-layout">
      {!hideHeaderOnRoutes.includes(location.pathname) && (
        <HeaderU 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      )}
      <main className="content-wrapper">
        <Routes>
          <Route path="/" element={<LoginU />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={<DashboardEstoque />} />
          <Route path="/home" element={<HomeU />} />
          <Route path="/meus-dados" element={<MeusDados />} />
          <Route path="/cadastro-parceiro" element={<CadastroParceiro />} />
          <Route path="/cadastro-produto" element={<CadastroProduto />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/marketplaces" element={<MarketplaceIntegrations />} />
          <Route path="/ml-auth-success" element={<MarketplaceAuthSuccess />} />
          <Route path="/ml-auth-error" element={<MarketplaceAuthError />} />
          <Route path="/email-confirmacao" element={<EmailConfirmation />} />
          <Route path="/email-validado" element={<EmailValidado />} />
          <Route path="/email-falha-validacao" element={<EmailValidationFailed />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <LayoutWithHeader />
    </Router>
  );
}
