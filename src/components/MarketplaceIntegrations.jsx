import React, { useState } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import styles from './style/MarketplaceIntegrations.module.css';

const MOCK_INTEGRATIONS = [
    { id: 1, name: 'Mercado Livre', type: 'Loja Principal', status: 'Ativo', logo: '🤝' },
    { id: 2, name: 'Amazon Brasil', type: 'Filial SP', status: 'Ativo', logo: '📦' },
    { id: 3, name: 'Shopee', type: 'Novas Vendas', status: 'Pendente', logo: '🧡' },
    { id: 4, name: 'Magalu', type: 'Catálogo Parado', status: 'Erro', logo: 'Ⓜ️' },
    { id: 5, name: 'AliExpress', type: 'Global - Envios', status: 'Ativo', logo: '🔴' },
];

export function MarketplaceIntegrations() {
    const [integrations] = useState([]); // Troque para MOCK_INTEGRATIONS para ver a lista

    const handleAuthML = () => {
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
    };

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
                <button className={styles.btnAdd} onClick={handleAuthML}>
                    <Plus size={20} />
                    <span>Adicionar Nova Integração</span>
                </button>
            </header>

            {integrations.length > 0 ? (
                <div className={styles.grid}>
                    {integrations.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <div className={styles.brandInfo}>
                                    <div className={styles.logoBox}>{item.logo}</div>
                                    <div>
                                        <h3>{item.name}</h3>
                                        <span className={styles.typeTag}>{item.type}</span>
                                    </div>
                                </div>
                                <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                                    <div className={styles.dot} /> {item.status}
                                </span>
                            </div>

                            <div className={styles.cardActions}>
                                <button className={styles.actionBtn} title="Editar">
                                    <Edit3 size={18} />
                                    <span>Editar</span>
                                </button>
                                <button className={styles.actionBtn} title="Sincronizar">
                                    <RefreshCw size={18} />
                                    <span>Sincronizar</span>
                                </button>
                                <button className={`${styles.actionBtn} ${styles.btnDelete}`} title="Remover">
                                    <Trash2 size={18} />
                                    <span>Remover</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <RefreshCw size={48} />
                    </div>
                    <h2>Nenhuma integração cadastrada</h2>
                    <p>Conecte seu primeiro marketplace para começar a sincronizar seu estoque e pedidos automaticamente.</p>
                    <button className={styles.btnAdd} onClick={handleAuthML}>
                        <Plus size={20} /> Adicionar Integração
                    </button>
                </div>
            )}
        </div>
    );
}
