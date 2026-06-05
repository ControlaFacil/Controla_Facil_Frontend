import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import styles from './ModalRemoverProduto.module.css';

export function ModalRemoverProduto({ isOpen, onClose, produto }) {
  if (!isOpen || !produto) return null;

  const handleInativar = () => {
    alert(`Inativar produto: ${produto.nome}`);
    onClose();
  };

  const handleExcluir = () => {
    alert(`Excluir produto: ${produto.nome}`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Remover Produto</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Mercado Livre Warning Banner */}
          <div className={styles.alertBanner}>
            <AlertTriangle className={styles.alertIcon} size={20} />
            <p className={styles.alertText}>
              Aviso: As alterações feitas aqui também irão refletir diretamente no anúncio vinculado no Mercado Livre.
            </p>
          </div>

          <p className={styles.explanationText}>
            Como deseja remover o produto <strong>{produto.nome}</strong>? Escolha uma das opções abaixo:
          </p>

          {/* Comparison Cards */}
          <div className={styles.comparisonGrid}>
            <div className={`${styles.optionCard} ${styles.inativarCard}`}>
              <h4>Inativar Produto</h4>
              <p>
                <strong>Ação Reversível.</strong> O produto ficará oculto temporariamente no catálogo local
                e pausará as vendas e sincronizações do anúncio correspondente no Mercado Livre.
                Pode ser reativado a qualquer momento.
              </p>
            </div>

            <div className={`${styles.optionCard} ${styles.excluirCard}`}>
              <h4>Excluir Definitivamente</h4>
              <p>
                <strong>Ação Irreversível.</strong> Deleta o produto de forma permanente do Controla Fácil.
                O anúncio associado no Mercado Livre também será deletado permanentemente do marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnInativar} onClick={handleInativar}>
            Inativar Produto
          </button>
          <button className={styles.btnExcluir} onClick={handleExcluir}>
            Excluir Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
