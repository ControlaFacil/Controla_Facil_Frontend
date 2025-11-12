import styles from './style/DashboardEstoque.module.css';

export function DashboardEstoque() {
  return (
    <main className={styles.main}>
      <h1>Dashboard de Estoque</h1>

      <section className={styles.kpiSection}>
        <div className={`${styles.kpiCard} ${styles.success}`}>
          <h2>Itens Totais</h2>
          <p className={styles.kpiValue}>1.250</p>
          <span className={styles.kpiIcon}>📦</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.warning}`}>
          <h2>Estoque Baixo</h2>
          <p className={styles.kpiValue}>35</p>
          <span className={styles.kpiIcon}>⚠️</span>
          <a href="#" className={styles.kpiLink}>Ver Detalhes</a>
        </div>
        <div className={`${styles.kpiCard} ${styles.danger}`}>
          <h2>Esgotados</h2>
          <p className={styles.kpiValue}>12</p>
          <span className={styles.kpiIcon}>🚫</span>
          <a href="#" className={styles.kpiLink}>Ver Detalhes</a>
        </div>
        <div className={`${styles.kpiCard} ${styles.success}`}>
          <h2>Valor do Estoque</h2>
          <p className={styles.kpiValue}>R$ 75.820,00</p>
          <span className={styles.kpiIcon}>💰</span>
        </div>
      </section>

      <section className={styles.chartsSection}>
        <div className={styles.chartContainer}>
          <h3>Distribuição do Estoque</h3>
          <div className={styles.chartPlaceholder}>
            <p>Em Estoque: 80%</p>
            <p>Estoque Baixo: 15%</p>
            <p>Esgotado: 5%</p>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h3>Top 5 Produtos Mais Estocados</h3>
          <div className={styles.chartPlaceholder}>
            <p>Caneta Azul: 250 un.</p>
            <p>Caderno 10 Mat.: 180 un.</p>
            <p>Lápis Preto: 150 un.</p>
            <p>Borracha Branca: 120 un.</p>
            <p>Régua 30cm: 100 un.</p>
          </div>
        </div>
      </section>

      <section className={styles.alertsSection}>
        <h3>Alertas e Ações Rápidas</h3>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Código</th>
              <th>Qtd. Atual</th>
              <th>Nível Mínimo</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tinta Impressora XPTO</td>
              <td>TN001</td>
              <td>3</td>
              <td>5</td>
              <td className={styles.statusBaixo}>Baixo</td>
              <td><button className={styles.actionBtn}>Repor</button></td>
            </tr>
            <tr>
              <td>Mouse Sem Fio ABC</td>
              <td>MS005</td>
              <td>0</td>
              <td>10</td>
              <td className={styles.statusEsgotado}>Esgotado</td>
              <td><button className={`${styles.actionBtn} ${styles.urgent}`}>Repor Urgente</button></td>
            </tr>
            <tr>
              <td>Teclado Gamer</td>
              <td>TG002</td>
              <td>8</td>
              <td>7</td>
              <td className={styles.statusOk}>OK (Próx. Mín)</td>
              <td><button className={styles.actionBtn}>Monitorar</button></td>
            </tr>
            <tr>
              <td>Monitor LED 24"</td>
              <td>MN007</td>
              <td>25</td>
              <td>5</td>
              <td className={styles.statusOk}>OK</td>
              <td><button className={styles.actionBtn}>Ver</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
