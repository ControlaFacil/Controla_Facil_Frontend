import React, { useState } from 'react';
import styles from "./style/CadastroParceiro.module.css";

export function CadastroParceiro() {
  const [form, setForm] = useState({
    razaoSocial: '',
    cnpj: '',
    nomeParceiro: '',
    tipoParceiro: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main>
      <h1 className={styles.pageTitle}>Cadastro de Novo Parceiro</h1>
      <section className={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="razaoSocial">Razão Social*</label>
            <input
              type="text"
              id="razaoSocial"
              name="razaoSocial"
              value={form.razaoSocial}
              onChange={handleChange}
              required
              placeholder="Nome legal da empresa"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cnpj">CNPJ*</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={form.cnpj}
              onChange={handleChange}
              required
              placeholder="00000000000000"
              pattern="\d{14}"
              title="CNPJ deve conter exatamente 14 números"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomeParceiro">Nome Fantasia (Opcional)</label>
            <input
              type="text"
              id="nomeParceiro"
              name="nomeParceiro"
              value={form.nomeParceiro}
              onChange={handleChange}
              placeholder="Nome comercial ou de fachada"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipoParceiro">Tipo de Parceiro*</label>
            <select
              id="tipoParceiro"
              name="tipoParceiro"
              value={form.tipoParceiro}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione o tipo</option>
              <option value="fornecedor">Fornecedor</option>
              <option value="transportadora">Transportadora</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email (Opcional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contato@parceiro.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefone">Telefone (Opcional)</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>

          <button type="submit" className={styles.actionBtn}>
            Cadastrar Parceiro
          </button>
        </form>
      </section>
    </main>
  );
}
