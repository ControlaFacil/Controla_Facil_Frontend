import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HeaderU } from "./components/HeaderU";
import { HomeU } from "./components/HomeU";
import { LoginU } from "./components/LoginU";
import { Cadastro } from "./components/Cadastro";
import { MeusDados } from "./components/MeusDados";
import { CadastroParceiro } from "./components/CadastroParceiro";
import { CadastroProduto } from "./components/CadastroProduto";
import { Estoque } from "./components/Estoque";
import IntegracaoSucesso from "./components/IntegracaoSucesso";
import IntegracaoErro from "./components/IntegracaoErro";
import './global.css';

function LayoutWithHeader() {
  const location = useLocation();
  const hideHeaderOnRoutes = ["/", "/cadastro"];

  return (
    <>
      {!hideHeaderOnRoutes.includes(location.pathname) && <HeaderU />}
      <Routes>
        <Route path="/" element={<LoginU />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<HomeU />} />
        <Route path="/meus-dados" element={<MeusDados />} />
        <Route path="/cadastro-parceiro" element={<CadastroParceiro />} />
        <Route path="/cadastro-produto" element={<CadastroProduto />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route
          path="/integracao-sucesso"
          element={<IntegracaoSucesso onGoHome={() => window.location.href = '/home'} />}
        />
        <Route
          path="/integracao-erro"
          element={<IntegracaoErro onGoHome={() => window.location.href = '/home'} />}
        />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <Router>
      <LayoutWithHeader />
    </Router>
  );
}
