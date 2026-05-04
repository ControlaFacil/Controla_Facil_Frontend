import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, X, Store, Tag } from 'lucide-react';
import styles from './style/MarketplaceIntegrations.module.css';
import { API_BASE_URL } from '../api';
import { toast } from 'react-toastify';


export function MarketplaceIntegrations() {

    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ marketplace: 'MERCADO_LIVRE', nome: '' });

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const fetchIntegrations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE_URL}/integracoes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.sucesso) {
                setIntegrations(data.integracoes);
            } else {
                setIntegrations([]);
            }
        } catch (error) {
            console.error('Erro ao buscar integrações:', error);
            toast.error("Erro ao carregar integrações");
        } finally {
            setLoading(false);
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ marketplace: 'MERCADO_LIVRE', nome: '' });
    };

    const handleSync = (marketplace) => {
        if (marketplace === 'MERCADO_LIVRE') {
            const url = import.meta.env.VITE_ML_URL_AUTH;
            const width = 600;
            const height = 750;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);

            window.open(
                url, 
                'MLAuth', 
                `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=no,resizable=yes`
            );
        } else {
            toast.info("Sincronização não disponível para este marketplace no momento.");
        }
    };

    const cadastrarIntegracao = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE_URL}/integracoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if(!data.sucesso) {
                closeModal();
                toast.error(data.message)
                return;
            }

            closeModal();
            toast.success("Integração cadastrada com sucesso!");
            fetchIntegrations();


        } catch (error) {
            console.error('Erro:', error);  
            toast.error("Erro ao cadastrar integração");
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Ativo': return styles.statusAtivo;
            case 'Pendente': return styles.statusPendente;
            case 'Erro': return styles.statusErro;
            default: return '';
        }
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1 className={styles.mainTitle}>Integração com Marketplaces</h1>
                    <p className={styles.subtitle}>Conecte e gerencie suas vendas em múltiplos canais de forma centralizada.</p>
                </div>
                <button className={styles.btnAdd} onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    <span>Adicionar Nova Integração</span>
                </button>
            </header>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <RefreshCw className={styles.spin} size={40} />
                    <p>Carregando integrações...</p>
                </div>
            ) : integrations.length > 0 ? (
                <div className={styles.grid}>
                    {integrations.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <div className={styles.brandInfo}>
                                    <div className={styles.logoBox}>
                                        {item.marketplace === 'MERCADO_LIVRE' ? '🤝' : '📦'}
                                    </div>
                                    <div>
                                        <h3>{item.nome}</h3>
                                        <span className={styles.typeTag}>
                                            {item.marketplace === 'MERCADO_LIVRE' ? 'Mercado Livre' : item.marketplace}
                                        </span>
                                    </div>
                                </div>
                                <span className={`${styles.statusBadge} ${styles.statusAtivo}`}>
                                    <div className={styles.dot} /> Ativo
                                </span>
                            </div>
                            <div className={styles.cardActions}>
                                <button className={styles.actionBtn}><Edit3 size={18} /><span>Editar</span></button>
                                <button className={styles.actionBtn} onClick={() => handleSync(item.marketplace)}><RefreshCw size={18} /><span>Sincronizar</span></button>
                                <button className={`${styles.actionBtn} ${styles.btnDelete}`}><Trash2 size={18} /><span>Remover</span></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (

                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}><RefreshCw size={48} /></div>
                    <h2>Nenhuma integração cadastrada</h2>
                    <p>Conecte seu primeiro marketplace para começar a sincronizar seu estoque e pedidos automaticamente.</p>
                    <button className={styles.btnAdd} onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} /> Adicionar Integração
                    </button>
                </div>
            )}

            {/* Modal de Configuração */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h2>Nova Integração</h2>
                            <button className={styles.closeBtn} onClick={closeModal}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.inputGroup}>
                                <label><Store size={16} /> Marketplace</label>
                                <select 
                                    value={formData.marketplace}
                                    onChange={(e) => setFormData({...formData, marketplace: e.target.value})}
                                >
                                    <option value="MERCADO_LIVRE">Mercado Livre</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Tag size={16} /> Nome da Integração</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Loja Principal, Filial..."
                                    value={formData.nome}
                                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={closeModal}>Cancelar</button>
                            <button className={styles.btnSubmit} onClick={cadastrarIntegracao} disabled={!formData.nome.trim()} >Prosseguir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
