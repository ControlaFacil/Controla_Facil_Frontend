import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, User, CreditCard, Truck, Calendar, DollarSign, Tag, Info, Hash } from 'lucide-react';
import { Loading } from '../Loading';
import { API_BASE_URL } from '../../api';
import { toast } from 'react-toastify';
import styles from './ModalDetalhePedido.module.css';

const mapStatusLabel = (status) => {
  if (!status) return '—';
  const s = status.toLowerCase();
  switch (s) {
    case 'pending':
    case 'confirmed':
    case 'payment_required':
    case 'payment_in_process':
    case 'partially_paid':
      return 'Pendente';
    case 'paid':
      return 'Pago';
    case 'cancelled':
      return 'Cancelado';
    case 'shipped':
      return 'Enviado';
    case 'delivered':
      return 'Entregue';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const mapStatusClass = (status) => {
  if (!status) return '';
  const s = status.toLowerCase();
  switch (s) {
    case 'pending':
    case 'confirmed':
    case 'payment_required':
    case 'payment_in_process':
    case 'partially_paid':
      return styles.statusPendente;
    case 'paid':
      return styles.statusPago;
    case 'cancelled':
      return styles.statusCancelado;
    case 'shipped':
      return styles.statusEnviado;
    case 'delivered':
      return styles.statusEntregue;
    default:
      return '';
  }
};

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateString;
  }
};

export function ModalDetalhePedido({ isOpen, onClose, pedidoId }) {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !pedidoId) return;

    const fetchPedidoDetalhes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.sucesso) {
          setPedido(data.pedido);
        } else {
          toast.error(data.error || 'Erro ao carregar detalhes do pedido.');
          onClose();
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        toast.error('Erro de conexão ao carregar detalhes do pedido.');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetalhes();
  }, [isOpen, pedidoId, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <header className={styles.modalHeader}>
          <div className={styles.titleArea}>
            <h2>Detalhes do Pedido #{pedido?.id || pedidoId}</h2>
            {pedido?.id_pedido_ml && (
              <span className={styles.meliId}>
                <Hash size={14} /> ML: {pedido.id_pedido_ml}
              </span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <Loading message="Buscando informações detalhadas..." />
          </div>
        ) : pedido ? (
          <div className={styles.modalBody}>
            {/* Grid de Resumo */}
            <div className={styles.summaryGrid}>
              {/* Cliente */}
              <div className={styles.summaryCard}>
                <div className={styles.cardHeader}>
                  <User size={18} className={styles.iconBlue} />
                  <h3>Dados do Comprador</h3>
                </div>
                <div className={styles.cardContent}>
                  <p><strong>Nome Completo:</strong> {pedido.nome_completo_comprador || '—'}</p>
                  <p><strong>Apelido:</strong> {pedido.apelido_comprador || '—'}</p>
                  {pedido.id_comprador_ml && <p><strong>ID Comprador ML:</strong> {pedido.id_comprador_ml}</p>}
                </div>
              </div>

              {/* Pagamento e Envio */}
              <div className={styles.summaryCard}>
                <div className={styles.cardHeader}>
                  <CreditCard size={18} className={styles.iconGreen} />
                  <h3>Pagamento & Logística</h3>
                </div>
                <div className={styles.cardContent}>
                  <p>
                    <strong>Pagamento:</strong>{' '}
                    {pedido.forma_pagamento ? (
                      <span className={styles.badgePagamento}>
                        {pedido.forma_pagamento} ({pedido.metodo_pagamento || '—'})
                      </span>
                    ) : (
                      '—'
                    )}
                  </p>
                  <p>
                    <strong>Envio ML:</strong>{' '}
                    {pedido.id_envio_ml ? (
                      <span className={styles.badgeEnvio}>#{pedido.id_envio_ml}</span>
                    ) : (
                      <span className={styles.noEnvio}>Sem envio integrado</span>
                    )}
                  </p>
                  <p>
                    <strong>Status do Pedido:</strong>{' '}
                    <span className={`${styles.statusBadge} ${mapStatusClass(pedido.status_pedido)}`}>
                      {mapStatusLabel(pedido.status_pedido)}
                    </span>
                  </p>
                </div>
              </div>

              {/* datas e totais */}
              <div className={styles.summaryCard}>
                <div className={styles.cardHeader}>
                  <Calendar size={18} className={styles.iconOrange} />
                  <h3>Datas e Prazos</h3>
                </div>
                <div className={styles.cardContent}>
                  <p><strong>Criado em:</strong> {formatDate(pedido.data_pedido)}</p>
                  <p><strong>Última Atualização:</strong> {formatDate(pedido.data_atualizacao_status)}</p>
                  <p className={styles.totalDestaque}><strong>Valor Total:</strong> {formatCurrency(pedido.total)}</p>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <section className={styles.itensSection}>
              <h3>Itens Comprados</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.itensTable}>
                  <thead>
                    <tr>
                      <th>Produto do Anúncio</th>
                      <th>SKU Associado</th>
                      <th>Produto Local</th>
                      <th className={styles.centered}>Quantidade</th>
                      <th>Preço Unitário</th>
                      <th>Tarifa de Venda</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.itens?.map((item) => {
                      const totalItem = item.preco_unitario * item.quantidade;
                      return (
                        <tr key={item.id}>
                          <td>
                            <div className={styles.itemTitleArea}>
                              <span className={styles.itemTitle}>{item.titulo_item}</span>
                              <span className={styles.itemMeliId}>ML Item: {item.id_item_ml}</span>
                            </div>
                          </td>
                          <td>
                            {item.produto_local?.sku ? (
                              <span className={styles.skuChip}>{item.produto_local.sku}</span>
                            ) : (
                              <span className={styles.noLocal}>Sem SKU</span>
                            )}
                          </td>
                          <td>
                            {item.produto_local?.nome ? (
                              <span className={styles.localName}>{item.produto_local.nome}</span>
                            ) : (
                              <span className={styles.noLocal}>Anúncio não vinculado</span>
                            )}
                          </td>
                          <td className={`${styles.centered} ${styles.bold}`}>{item.quantidade} un.</td>
                          <td>{formatCurrency(item.preco_unitario)}</td>
                          <td className={styles.saleFee}>
                            {item.tarifa_venda ? formatCurrency(item.tarifa_venda) : '—'}
                          </td>
                          <td className={styles.bold}>{formatCurrency(totalItem)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          <div className={styles.errorWrapper}>
            <p>Não foi possível carregar as informações do pedido.</p>
          </div>
        )}

        {/* Footer */}
        <footer className={styles.modalFooter}>
          <button className={styles.closeBtnFooter} onClick={onClose}>
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
