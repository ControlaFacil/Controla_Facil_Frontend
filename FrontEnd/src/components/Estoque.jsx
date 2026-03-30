import React from 'react';
import styles from './style/Estoque.module.css';

const produtos = [
  { nome: 'Produto A', codigo: 'ID001', quantidade: 80, minimo: 20, preco: 2.5 },
  { nome: 'Produto B', codigo: 'ID002', quantidade: 50, minimo: 15, preco: 3.2 },
  { nome: 'Tinta Impressora XPTO', codigo: 'TN001', quantidade: 3, minimo: 5, preco: 45.0 },
  { nome: 'Mouse Sem Fio ABC', codigo: 'MS005', quantidade: 0, minimo: 10, preco: 60.0 },
  { nome: 'Teclado Gamer', codigo: 'TG002', quantidade: 8, minimo: 7, preco: 120.0 },
  { nome: 'Monitor LED 24"', codigo: 'MN007', quantidade: 25, minimo: 10, preco: 800.0 },
  { nome: 'Caderno 10 Matérias', codigo: 'CD010', quantidade: 180, minimo: 30, preco: 15.0 },
];

function getStatusClass(quantidade, minimo) {
  if (quantidade === 0) return styles.esgotado;
  if (quantidade <= minimo) return styles.baixo;
  return styles.ok;
}

function getStatusOrder(quantidade, minimo) {
  if (quantidade === 0) return 0; // Esgotado
  if (quantidade <= minimo) return 1; // Baixo
  return 2; // OK
}

export function Estoque() {
  const produtosOrdenados = [...produtos].sort((a, b) =>
    getStatusOrder(a.quantidade, a.minimo) - getStatusOrder(b.quantidade, b.minimo)
  );

  return (
    <main className={styles.container}> {/* Adicionada classe container para padronizar o layout */}
      <h1 className={styles.pageTitle}>Visualização de Estoque</h1>

      <section className={styles.cardsSection}>
        {produtosOrdenados.map((produto) => (
          <div
            key={produto.codigo}
            className={`${styles.card} ${getStatusClass(produto.quantidade, produto.minimo)}`}
          >
            <h3>{produto.nome}</h3>
            <p><strong>SKU:</strong> {produto.codigo}</p>
            <p><strong>Quantidade:</strong> {produto.quantidade} un.</p>
          </div>
        ))}
      </section>

      <section className={styles.stockTableSection}>
        <h3>Detalhes do Estoque</h3>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>SKU</th>
                <th>Qtd. Atual</th>
                <th>Preço Unit.</th>
                <th>Valor Total</th>
                <th>Nível Mínimo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {produtosOrdenados.map((produto) => {
                const statusClass = getStatusClass(produto.quantidade, produto.minimo);
                const statusLabel =
                  produto.quantidade === 0
                    ? 'Esgotado'
                    : produto.quantidade <= produto.minimo
                    ? 'Baixo'
                    : 'OK';
                const valorTotal = produto.quantidade * produto.preco;

                return (
                  <tr key={produto.codigo}>
                    <td>{produto.nome}</td>
                    <td>{produto.codigo}</td>
                    <td className={styles.centered}>{produto.quantidade}</td> {/* Adicionado class */}
                    <td>R$ {produto.preco.toFixed(2)}</td>
                    <td>R$ {valorTotal.toFixed(2)}</td>
                    <td className={styles.centered}>{produto.minimo}</td> {/* Adicionado class */}
                    <td>
                      <span className={`${styles.statusBadge} ${statusClass}`}>{statusLabel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}