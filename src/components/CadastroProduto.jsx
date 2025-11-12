import React, { useState } from 'react';
import styles from './style/CadastroProduto.module.css'; // Pode reaproveitar CadastroParceiro se preferir

export function CadastroProduto() {
  const [form, setForm] = useState({
    codigoProduto: '',
    nomeProduto: '',
    quantidadeProduto: '',
    precoProduto: '',
    descricao: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Produto cadastrado:", form);
    alert("Produto cadastrado com sucesso! (simulado)");
    // Simula um redirecionamento
    window.location.href = "/produtos";
  };

  return (
    <main>
      <h1 className={styles.pageTitle}>Cadastro de Novo Produto</h1>
      <section className={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="codigoProduto">Código do Produto*</label>
            <input
              type="text"
              id="codigoProduto"
              name="codigoProduto"
              value={form.codigoProduto}
              onChange={handleChange}
              required
              placeholder="Ex: SKU001"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomeProduto">Nome do Produto*</label>
            <input
              type="text"
              id="nomeProduto"
              name="nomeProduto"
              value={form.nomeProduto}
              onChange={handleChange}
              required
              placeholder="Ex: Caneta Azul Esferográfica"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantidadeProduto">Quantidade em Estoque*</label>
            <input
              type="number"
              id="quantidadeProduto"
              name="quantidadeProduto"
              value={form.quantidadeProduto}
              onChange={handleChange}
              min="0"
              required
              placeholder="Ex: 100"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="precoProduto">Preço Unitário (R$)*</label>
            <input
              type="number"
              id="precoProduto"
              name="precoProduto"
              value={form.precoProduto}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="Ex: 2.50"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao">Descrição*</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              required
              placeholder="Ex: Categoria, tipo e modelo"
            />
          </div>

          <button type="submit" className={styles.actionBtn}>
            Cadastrar Produto
          </button>
        </form>
      </section>
    </main>
  );
}
