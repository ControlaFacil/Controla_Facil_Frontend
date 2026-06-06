import React, { useState, useEffect, useMemo } from 'react';
import styles from './Pedidos.module.css';
import { ShoppingCart, Clock, CheckCircle, Truck, Eye, Store, ChevronDown, Search, X } from 'lucide-react';
import { Loading } from '../../components/Loading';
import { ModalDetalhePedido } from '../../components/ModalDetalhePedido';
import { API_BASE_URL } from '../../api';
import { toast } from 'react-toastify';

const mapStatus = (status) => {
  if (!status) return '';
  const s = status.toLowerCase();
  if (['pending', 'confirmed', 'payment_required', 'payment_in_process', 'partially_paid', 'pendente'].includes(s)) {
    return 'Pendente';
  }
  if (['paid', 'pago', 'em separação', 'em separacao'].includes(s)) {
    return 'Em Separação';
  }
  if (['shipped', 'enviado', 'sent'].includes(s)) {
    return 'Enviado';
  }
  if (['delivered', 'entregue'].includes(s)) {
    return 'Entregue';
  }
  if (['cancelled', 'cancelado'].includes(s)) {
    return 'Cancelado';
  }
  return status;
};

function getStatusStyle(status) {
  const mapped = mapStatus(status);
  switch (mapped) {
    case 'Pendente': return styles.statusPendente;
    case 'Em Separação': return styles.statusSeparacao;
    case 'Enviado': return styles.statusEnviado;
    case 'Entregue': return styles.statusEntregue;
    case 'Cancelado': return styles.statusCancelado;
    default: return '';
  }
}

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [integracoes, setIntegracoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [integracaoSelecionada, setIntegracaoSelecionada] = useState('todas');
  const [statusFiltro, setStatusFiltro] = useState(null);
  const [busca, setBusca] = useState('');

  // Modal de Detalhes
  const [pedidoIdSelecionado, setPedidoIdSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carregar Integrações
  useEffect(() => {
    const fetchIntegracoes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/integracoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.sucesso) {
          setIntegracoes(data.integracoes || []);
        }
      } catch (error) {
        console.error('Erro ao buscar integrações:', error);
      }
    };

    fetchIntegracoes();
  }, []);

  // Carregar Pedidos
  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      // Buscamos um número razoável de pedidos recentes para filtrar no frontend
      const response = await fetch(`${API_BASE_URL}/pedidos?limite=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.sucesso) {
        setPedidos(data.pedidos || []);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar pedidos do sistema.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  // Filtrar pedidos por integração para calcular as estatísticas contextuais
  const pedidosPorIntegracao = useMemo(() => {
    if (integracaoSelecionada === 'todas') {
      return pedidos;
    }
    return pedidos.filter(p => String(p.integracao_id) === String(integracaoSelecionada));
  }, [pedidos, integracaoSelecionada]);

  // Estatísticas Dinâmicas baseadas na integração selecionada
  const stats = useMemo(() => {
    let pendentes = 0;
    let separacao = 0;
    let enviados = 0;
    let entregues = 0;

    pedidosPorIntegracao.forEach((p) => {
      const statusMapped = mapStatus(p.status_pedido);
      if (statusMapped === 'Pendente') pendentes++;
      else if (statusMapped === 'Em Separação') separacao++;
      else if (statusMapped === 'Enviado') enviados++;
      else if (statusMapped === 'Entregue') entregues++;
    });

    return { pendentes, separacao, enviados, entregues };
  }, [pedidosPorIntegracao]);

  // Pedidos finais exibidos na tabela após aplicar busca e status dos cards
  const pedidosExibidos = useMemo(() => {
    let lista = [...pedidosPorIntegracao];

    // Filtro do card de status
    if (statusFiltro) {
      lista = lista.filter(p => mapStatus(p.status_pedido) === statusFiltro);
    }

    // Busca textual
    if (busca.trim()) {
      const query = busca.toLowerCase().trim();
      lista = lista.filter((p) => {
        const idText = String(p.id);
        const meliIdText = p.id_pedido_ml ? String(p.id_pedido_ml).toLowerCase() : '';
        const compradorText = p.nome_completo_comprador ? p.nome_completo_comprador.toLowerCase() : '';
        const compradorApelido = p.apelido_comprador ? p.apelido_comprador.toLowerCase() : '';
        return (
          idText.includes(query) ||
          meliIdText.includes(query) ||
          compradorText.includes(query) ||
          compradorApelido.includes(query)
        );
      });
    }

    return lista;
  }, [pedidosPorIntegracao, statusFiltro, busca]);

  const handleToggleStatusFilter = (status) => {
    if (statusFiltro === status) {
      setStatusFiltro(null); // remove filtro se clicar de novo
    } else {
      setStatusFiltro(status); // ativa filtro
    }
  };

  const handleAbrirDetalhes = (pedidoId) => {
    setPedidoIdSelecionado(pedidoId);
    setIsModalOpen(true);
  };

  const handleLimparFiltroStatus = () => {
    setStatusFiltro(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Controle de Pedidos</h1>
          <p className={styles.subtitle}>Acompanhe o status e fluxo dos seus pedidos integrados.</p>
        </div>
      </header>

      {/* Cards de Estatísticas Interactivos */}
      <div className={styles.statsGrid}>
        <div 
          className={`${styles.statCard} ${statusFiltro === 'Pendente' ? styles.statCardActive : ''}`}
          onClick={() => handleToggleStatusFilter('Pendente')}
          title="Filtrar por Pedidos Pendentes"
        >
          <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}><Clock size={24} /></div>
          <div className={styles.statInfo}>
            <h3>Pendentes</h3>
            <p>{stats.pendentes}</p>
          </div>
        </div>
        <div 
          className={`${styles.statCard} ${statusFiltro === 'Em Separação' ? styles.statCardActive : ''}`}
          onClick={() => handleToggleStatusFilter('Em Separação')}
          title="Filtrar por Pedidos Em Separação"
        >
          <div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#4f46e5' }}><ShoppingCart size={24} /></div>
          <div className={styles.statInfo}>
            <h3>Em Separação</h3>
            <p>{stats.separacao}</p>
          </div>
        </div>
        <div 
          className={`${styles.statCard} ${statusFiltro === 'Enviado' ? styles.statCardActive : ''}`}
          onClick={() => handleToggleStatusFilter('Enviado')}
          title="Filtrar por Pedidos Enviados"
        >
          <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}><Truck size={24} /></div>
          <div className={styles.statInfo}>
            <h3>Enviados</h3>
            <p>{stats.enviados}</p>
          </div>
        </div>
        <div 
          className={`${styles.statCard} ${statusFiltro === 'Entregue' ? styles.statCardActive : ''}`}
          onClick={() => handleToggleStatusFilter('Entregue')}
          title="Filtrar por Pedidos Entregues"
        >
          <div className={styles.statIcon} style={{ background: '#d1fae5', color: '#059669' }}><CheckCircle size={24} /></div>
          <div className={styles.statInfo}>
            <h3>Entregues</h3>
            <p>{stats.entregues}</p>
          </div>
        </div>
      </div>

      {/* Controles de Filtros e Busca */}
      <div className={styles.topControls}>
        {/* Filtro de Integração */}
        <div className={styles.integracaoSelectWrapper}>
          <Store size={18} className={styles.integracaoIcon} />
          <select
            id="select-integracao-pedidos"
            className={styles.integracaoSelect}
            value={integracaoSelecionada}
            onChange={(e) => {
              setIntegracaoSelecionada(e.target.value);
              setStatusFiltro(null); // reseta filtro de status ao trocar integracao
            }}
          >
            <option value="todas">Todas as Integrações</option>
            {integracoes.map((integracao) => (
              <option key={integracao.id} value={String(integracao.id)}>
                {integracao.nome}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className={styles.selectArrow} />
        </div>

        {/* Campo de Busca */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', height: '46px', padding: '0 14px', flex: 1, minWidth: '280px', boxShadow: '0 2px 8px rgba(12, 52, 71, 0.05)' }}>
          <Search size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Buscar por ID, ID do ML ou comprador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.92rem', color: '#334155' }}
          />
          {busca && (
            <X 
              size={16} 
              style={{ color: '#94a3b8', cursor: 'pointer' }} 
              onClick={() => setBusca('')}
            />
          )}
        </div>

        {statusFiltro && (
          <button 
            onClick={handleLimparFiltroStatus}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: 'none', padding: '10px 18px', borderRadius: '12px', color: '#64748b', fontWeight: '700', cursor: 'pointer', height: '46px' }}
          >
            Filtrado por: {statusFiltro} <X size={14} />
          </button>
        )}
      </div>

      <section className={styles.tableSection}>
        <div className={styles.tableHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Pedidos Recentes</h3>
          <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
            {pedidosExibidos.length} {pedidosExibidos.length === 1 ? 'pedido' : 'pedidos'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '80px 40px' }}>
            <Loading message="Carregando pedidos do banco de dados..." />
          </div>
        ) : pedidosExibidos.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ShoppingCart size={48} />
            </div>
            <h2>Nenhum pedido encontrado</h2>
            <p>
              {busca 
                ? `Nenhum pedido atende à sua busca por "${busca}".` 
                : statusFiltro 
                ? `Nenhum pedido com status "${statusFiltro}" nesta seleção.`
                : integracaoSelecionada !== 'todas'
                ? 'Esta integração não possui nenhum pedido registrado.'
                : 'Não foram encontrados pedidos registrados no sistema.'}
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosExibidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <div className={styles.orderHeaderCell}>
                        <strong>#{pedido.id}</strong>
                        {pedido.id_pedido_ml && (
                          <span className={styles.badgeMeli} title={`ID Mercado Livre: ${pedido.id_pedido_ml}`}>
                            ML
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{pedido.nome_completo_comprador || pedido.apelido_comprador || '—'}</td>
                    <td>{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</td>
                    <td>{formatCurrency(pedido.total)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusStyle(pedido.status_pedido)}`}>
                        <div className={styles.dot} /> {mapStatus(pedido.status_pedido)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                          className={styles.btnVisualizar}
                          onClick={() => handleAbrirDetalhes(pedido.id)}
                          title="Visualizar detalhes do pedido"
                        >
                          <Eye size={15} />
                          <span>Detalhes</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal de Detalhe do Pedido */}
      <ModalDetalhePedido
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPedidoIdSelecionado(null);
        }}
        pedidoId={pedidoIdSelecionado}
      />
    </div>
  );
}
