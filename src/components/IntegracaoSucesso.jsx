// SuccessPage.jsx
import React from 'react';
import './style/SuccessPage.css';

export default function IntegracaoSucesso({ onGoHome }) {
  return (
    <div className="success-container">
      <h1>Integração realizada com sucesso!</h1>
      <p>Agora você pode acessar o sistema normalmente.</p>
      <button onClick={onGoHome}>Ir para Home</button>
    </div>
  );
}