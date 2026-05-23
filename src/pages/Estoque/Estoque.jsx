import React, { useState } from "react";
import { ControleEstoque } from "../../components/ControleEstoque";
import { Categorias } from "../../components/Categorias";
import styles from "./Estoque.module.css";

export function Estoque() {
  const [activeTab, setActiveTab] = useState('estoque');

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>Gerenciamento de Estoque</h1>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'estoque' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('estoque')}
        >
          Controle de Estoque
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'categorias' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categorias')}
        >
          Categorias
        </button>
      </div>

      {activeTab === 'estoque' && <ControleEstoque />}
      {activeTab === 'categorias' && <Categorias />}
    </main>
  );
}
