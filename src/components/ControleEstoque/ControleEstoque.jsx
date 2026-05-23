import React, { useState } from "react";
import { PackageX, Plus } from "lucide-react";
import styles from "../../pages/Estoque/Estoque.module.css";
import { ModalProdutos } from "../ModalProdutos";

const produtos = [
  // { nome: "Produto A", codigo: "ID001", quantidade: 80, minimo: 20, preco: 2.5 },
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

export function ControleEstoque() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const produtosOrdenados = [...produtos].sort(
    (a, b) =>
      getStatusOrder(a.quantidade, a.minimo) -
      getStatusOrder(b.quantidade, b.minimo),
  );

  return (
    <div className={styles.tabContent}>
      {produtosOrdenados.length > 0 ? (
        <>
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
                      produto.quantidade === 0 ? "Esgotado" : produto.quantidade <= produto.minimo ? "Baixo" : "OK";
                    const valorTotal = produto.quantidade * produto.preco;

                    return (
                      <tr key={produto.codigo}>
                        <td>{produto.nome}</td>
                        <td>{produto.codigo}</td>
                        <td className={styles.centered}>{produto.quantidade}</td>
                        <td>R$ {produto.preco.toFixed(2)}</td>
                        <td>R$ {valorTotal.toFixed(2)}</td>
                        <td className={styles.centered}>{produto.minimo}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <PackageX size={48} />
          </div>
          <h2>Nenhum produto em estoque</h2>
          <p>Você ainda não possui produtos cadastrados no seu estoque.</p>
          <button className={styles.btnAdd} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Adicionar Produto
          </button>
        </div>
      )}
      
      <ModalProdutos isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
