import React from 'react';
import styles from './Relatorios.module.css';
import { DollarSign, TrendingUp, Package, Users } from 'lucide-react';

export function Relatorios() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1 className={styles.pageTitle}>Relatórios e Análises</h1>
                    <p className={styles.subtitle}>Visualize métricas de desempenho e crescimento do seu negócio.</p>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}><DollarSign size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Receita Total</h3>
                        <p>R$ 45.231,00</p>
                        <span className={styles.trendUp}>+12% este mês</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#4f46e5' }}><TrendingUp size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Vendas Realizadas</h3>
                        <p>342</p>
                        <span className={styles.trendUp}>+5% este mês</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}><Package size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Produtos Ativos</h3>
                        <p>128</p>
                        <span className={styles.trendNeutral}>Estável</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}><Users size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Novos Clientes</h3>
                        <p>84</p>
                        <span className={styles.trendUp}>+18% este mês</span>
                    </div>
                </div>
            </div>

            <section className={styles.chartSection}>
                <div className={styles.chartPlaceholder}>
                    <h3>Evolução de Vendas</h3>
                    <div className={styles.placeholderBars}>
                        <div className={styles.bar} style={{ height: '40%' }}><span>Jan</span></div>
                        <div className={styles.bar} style={{ height: '60%' }}><span>Fev</span></div>
                        <div className={styles.bar} style={{ height: '45%' }}><span>Mar</span></div>
                        <div className={styles.bar} style={{ height: '80%' }}><span>Abr</span></div>
                        <div className={styles.bar} style={{ height: '65%' }}><span>Mai</span></div>
                        <div className={styles.bar} style={{ height: '90%' }}><span>Jun</span></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
