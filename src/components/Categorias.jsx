import React, { useState } from 'react';
import { FolderX, Plus, Edit2, Trash2 } from 'lucide-react';
import { ModalCategoria } from './ModalCategoria';
import { ModalConfirmacao } from './ModalConfirmacao';
import styles from './style/Categorias.module.css';
import estoqueStyles from './style/Estoque.module.css'; // For common layout/buttons

const mockCategorias = [
  { id: 1, nome: "Eletrônicos", descricao: "Produtos eletrônicos em geral" },
  { id: 2, nome: "Informática", descricao: "Computadores, mouses, teclados" },
];

export function Categorias() {
  const [categorias, setCategorias] = useState(mockCategorias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);

  const handleOpenModal = (categoria = null) => {
    setCategoriaEmEdicao(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoriaEmEdicao(null);
  };

  const handleSaveCategoria = (formData) => {
    if (categoriaEmEdicao) {
      setCategorias(categorias.map(cat => cat.id === categoriaEmEdicao.id ? { ...cat, ...formData } : cat));
    } else {
      const newCat = { ...formData, id: Date.now() };
      setCategorias([...categorias, newCat]);
    }
    handleCloseModal();
  };

  const confirmDelete = (categoria) => {
    setCategoriaParaExcluir(categoria);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setCategorias(categorias.filter(cat => cat.id !== categoriaParaExcluir.id));
    setIsDeleteModalOpen(false);
    setCategoriaParaExcluir(null);
  };

  return (
    <div className={estoqueStyles.tabContent}>
      {categorias.length === 0 ? (
        <div className={estoqueStyles.emptyState}>
          <div className={estoqueStyles.emptyIcon}>
            <FolderX size={48} />
          </div>
          <h2>Não foram encontradas categorias cadastradas</h2>
          <p>Você ainda não possui categorias internas para organizar seus produtos.</p>
          <button className={estoqueStyles.btnAdd} onClick={() => handleOpenModal()}>
            <Plus size={20} /> Cadastrar Categoria
          </button>
        </div>
      ) : (
        <div>
          <div className={styles.headerActions}>
            <button className={estoqueStyles.btnAdd} onClick={() => handleOpenModal()}>
              <Plus size={20} /> Cadastrar Categoria
            </button>
          </div>

          <section className={styles.tableSection}>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Nome da Categoria</th>
                    <th>Descrição</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600, color: '#0C3447' }}>{cat.nome}</td>
                      <td style={{ color: '#64748b' }}>{cat.descricao || '-'}</td>
                      <td>
                        <div className={styles.actionsCell}>
                          <button 
                            className={`${styles.actionBtn} ${styles.btnEdit}`} 
                            onClick={() => handleOpenModal(cat)}
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.btnDelete}`} 
                            onClick={() => confirmDelete(cat)}
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      <ModalCategoria 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSave={handleSaveCategoria}
        categoriaEmEdicao={categoriaEmEdicao}
      />

      <ModalConfirmacao
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Categoria?"
        message="Ao excluir, todos os produtos vinculados a essa categoria ficarão sem categoria interna vinculada. Deseja continuar?"
      />
    </div>
  );
}
