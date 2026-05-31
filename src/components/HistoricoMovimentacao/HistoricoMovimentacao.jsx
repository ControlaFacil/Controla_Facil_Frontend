import React, { useState } from "react";
import { Search, ArrowUpRight, ArrowDownLeft, CalendarDays } from "lucide-react";
import styles from "./HistoricoMovimentacao.module.css";

const MOCK_MOVIMENTACOES = [
  {
    id: 1,
    dataHora: "31/05/2026 14:30",
    movimento: "Entrada",
    produto: "Caneta Azul",
    sku: "CA001",
    quantidade: 50,
  },
  {
    id: 2,
    dataHora: "31/05/2026 11:15",
    movimento: "Saída",
    produto: "Mouse Sem Fio ABC",
    sku: "MS005",
    quantidade: 10,
  },
  {
    id: 3,
    dataHora: "30/05/2026 16:45",
    movimento: "Entrada",
    produto: "Teclado Gamer",
    sku: "TG002",
    quantidade: 15,
  },
  {
    id: 4,
    dataHora: "30/05/2026 09:30",
    movimento: "Saída",
    produto: "Monitor LED 24\"",
    sku: "MN007",
    quantidade: 5,
  },
  {
    id: 5,
    dataHora: "29/05/2026 15:20",
    movimento: "Entrada",
    produto: "Caderno 10 Mat.",
    sku: "CD010",
    quantidade: 30,
  },
  {
    id: 6,
    dataHora: "28/05/2026 10:00",
    movimento: "Entrada",
    produto: "Lápis Preto",
    sku: "LP002",
    quantidade: 100,
  },
  {
    id: 7,
    dataHora: "27/05/2026 14:10",
    movimento: "Saída",
    produto: "Tinta Impressora XPTO",
    sku: "TN001",
    quantidade: 8,
  },
  {
    id: 8,
    dataHora: "26/05/2026 11:30",
    movimento: "Saída",
    produto: "Borracha Branca",
    sku: "BB003",
    quantidade: 20,
  },
  {
    id: 9,
    dataHora: "25/05/2026 17:00",
    movimento: "Entrada",
    produto: "Régua 30cm",
    sku: "RG030",
    quantidade: 40,
  },
  {
    id: 10,
    dataHora: "25/05/2026 08:45",
    movimento: "Saída",
    produto: "Grampeador de Mesa",
    sku: "GP100",
    quantidade: 2,
  }
];

export function HistoricoMovimentacao() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");

  const filteredMovimentacoes = MOCK_MOVIMENTACOES.filter((item) => {
    const matchesSearch =
      item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo =
      filterTipo === "Todos" || item.movimento === filterTipo;

    return matchesSearch && matchesTipo;
  });

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Buscar por produto ou SKU..."
            className={styles.inputSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterSelectWrapper}>
          <label className={styles.filterLabel} htmlFor="tipo-movimento">
            Tipo:
          </label>
          <select
            id="tipo-movimento"
            className={styles.selectFilter}
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </select>
        </div>
      </div>

      <section className={styles.tableSection}>
        <h3>Registro de Movimentações</h3>
        {filteredMovimentacoes.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Movimento</th>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th className={styles.centered}>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovimentacoes.map((item) => {
                  const isEntrada = item.movimento === "Entrada";
                  const badgeClass = isEntrada ? styles.badgeEntrada : styles.badgeSaida;
                  const Icon = isEntrada ? ArrowUpRight : ArrowDownLeft;

                  return (
                    <tr key={item.id}>
                      <td>{item.dataHora}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${badgeClass}`}>
                          <span className={styles.badgeIcon}>
                            <Icon size={14} />
                          </span>
                          {item.movimento}
                        </span>
                      </td>
                      <td>{item.produto}</td>
                      <td>{item.sku}</td>
                      <td className={`${styles.centered} ${styles.quantityCell}`}>
                        <strong>{item.quantidade}</strong> un.
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <CalendarDays size={40} />
            </div>
            <h4>Nenhuma movimentação encontrada</h4>
            <p>Tente ajustar a busca ou os filtros para encontrar os registros.</p>
          </div>
        )}
      </section>
    </div>
  );
}
