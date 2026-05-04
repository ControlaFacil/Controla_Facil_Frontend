import React from 'react';
import styles from './style/Pedidos.module.css';
import { ShoppingCart, Clock, CheckCircle, Truck } from 'lucide-react';

const mockPedidos = [
    { id: 'PED-1001', cliente: 'João Silva', data: '12/10/2023', valor: 250.00, status: 'Pendente' },
    { id: 'PED-1002', cliente: 'Maria Oliveira', data: '14/10/2023', valor: 1200.50, status: 'Em Separação' },
    { id: 'PED-1003', cliente: 'Carlos Santos', data: '15/10/2023', valor: 85.90, status: 'Enviado' },
    { id: 'PED-1004', cliente: 'Ana Costa', data: '16/10/2023', valor: 430.00, status: 'Entregue' },
    { id: 'PED-1005', cliente: 'Pedro Mendes', data: '16/10/2023', valor: 150.00, status: 'Cancelado' },
];

function getStatusStyle(status) {
    switch (status) {
        case 'Pendente': return styles.statusPendente;
        case 'Em Separação': return styles.statusSeparacao;
        case 'Enviado': return styles.statusEnviado;
        case 'Entregue': return styles.statusEntregue;
        case 'Cancelado': return styles.statusCancelado;
        default: return '';
    }
}

export function Pedidos() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1 className={styles.pageTitle}>Controle de Pedidos</h1>
                    <p className={styles.subtitle}>Acompanhe o status e fluxo dos seus pedidos.</p>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}><Clock size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Pendentes</h3>
                        <p>1</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#4f46e5' }}><ShoppingCart size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Em Separação</h3>
                        <p>1</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}><Truck size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Enviados</h3>
                        <p>1</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#d1fae5', color: '#059669' }}><CheckCircle size={24} /></div>
                    <div className={styles.statInfo}>
                        <h3>Entregues</h3>
                        <p>1</p>
                    </div>
                </div>
            </div>

            <section className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <h3>Pedidos Recentes</h3>
                </div>
                <div className={styles.tableWrapper}>
                    <table>
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Valor Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td><strong>{pedido.id}</strong></td>
                                    <td>{pedido.cliente}</td>
                                    <td>{pedido.data}</td>
                                    <td>R$ {pedido.valor.toFixed(2)}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${getStatusStyle(pedido.status)}`}>
                                            <div className={styles.dot} /> {pedido.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
