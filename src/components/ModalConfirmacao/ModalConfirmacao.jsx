import React from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ModalConfirmacao.module.css';

export function ModalConfirmacao({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.iconContainer}>
          <AlertTriangle size={32} />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Não, Cancelar
          </button>
          <button className={styles.btnConfirm} onClick={onConfirm}>
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
