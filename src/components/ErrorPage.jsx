// ErrorPage.jsx
import React from 'react';
import './style/ErrorPage.css';

export default function ErrorPage({ onGoHome }) {
  return (
    <div className="error-container">
      <h1>Ocorreu um erro na integração!</h1>
      <p>Por favor, tente novamente ou retorne ao sistema.</p>
      <button onClick={onGoHome}>Voltar para Home</button>
    </div>
  );
}