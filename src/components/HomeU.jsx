import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Globe, BarChart3, ArrowUpRight, Database } from 'lucide-react';
import styles from './style/HomeU.module.css';

export function HomeU() {
    const navigate = useNavigate();

    const modules = [
        {
            title: "Gerenciamento de Estoque",
            desc: "Controle entradas, saídas e níveis críticos de inventário em tempo real.",
            icon: <Package size={32} />,
            route: "/estoque",
            color: "#5FC16C"
        },
        {
            title: "Controle de Pedidos",
            desc: "Acompanhe o status de vendas, separação e fluxo de devoluções.",
            icon: <ShoppingCart size={32} />,
            route: "/pedidos",
            color: "#3b82f6"
        },
        {
            title: "Integração Marketplaces",
            desc: "Sincronize seus produtos com as maiores vitrines do Brasil.",
            icon: <Globe size={32} />,
            route: "/marketplaces",
            color: "#f59e0b"
        },
        {
            title: "Relatórios e Análises",
            desc: "Visualize métricas de desempenho e gráficos de crescimento.",
            icon: <BarChart3 size={32} />,
            route: "/relatorios",
            color: "#8b5cf6"
        },
        {
            title: "Análise de Dados",
            desc: "Insights avançados processados para tomada de decisão estratégica.",
            icon: <Database size={32} />,
            route: "/analise",
            color: "#06b6d4"
        }
    ];

    return (
        <div className={styles.homeContainer}>
            <header className={styles.welcomeHeader}>
                <h1>Bem-vindo, Usuário</h1>
                <p>O que você deseja gerenciar hoje no <strong>Controla Fácil</strong>?</p>
            </header>

            <div className={styles.modulesGrid}>
                {modules.map((mod, idx) => (
                    <div key={idx} className={styles.moduleCard} onClick={() => navigate(mod.route)}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconBox} style={{ color: mod.color, background: `${mod.color}15` }}>
                                {mod.icon}
                            </div>
                            <ArrowUpRight size={20} className={styles.arrowIcon} />
                        </div>
                        <h3>{mod.title}</h3>
                        <p>{mod.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
