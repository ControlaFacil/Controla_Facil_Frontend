import React, { useState, useEffect, useMemo } from "react";
import {
  PackageX,
  Plus,
  Search,
  Edit2,
  RefreshCw,
  Store,
  ChevronDown,
  ImageOff,
} from "lucide-react";
import estoqueStyles from "../../pages/Estoque/Estoque.module.css";
import styles from "./ControleEstoque.module.css";
import { ModalProdutos } from "../ModalProdutos";
import { ModalConfirmacao } from "../ModalConfirmacao";
import { Loading } from "../Loading";
import { API_BASE_URL } from "../../api";
import { toast } from "react-toastify";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStockStatus(qtdDisponivel, qtdMinima) {
  if (qtdDisponivel === 0) return { label: "Esgotado", key: "esgotado" };
  if (qtdDisponivel <= qtdMinima * 0.5) return { label: "Baixo", key: "baixo" };
  if (qtdDisponivel <= qtdMinima) return { label: "Médio", key: "medio" };
  return { label: "OK", key: "ok" };
}

function getStockStatusOrder(qtdDisponivel, qtdMinima) {
  if (qtdDisponivel === 0) return 0;
  if (qtdDisponivel <= qtdMinima * 0.5) return 1;
  if (qtdDisponivel <= qtdMinima) return 2;
  return 3;
}

const SEARCH_FIELDS = [
  { value: "nome", label: "Nome / Título" },
  { value: "sku", label: "SKU" },
  { value: "categoria", label: "Categoria" },
  { value: "preco", label: "Preço" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function ControleEstoque() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [produtoIdParaSincronizar, setProdutoIdParaSincronizar] = useState(null);

  // Dados da API
  const [integracoes, setIntegracoes] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [estoques, setEstoques] = useState({}); // { [produto_id]: { qtd_disponivel, qtd_minima } }

  // Loading states
  const [loadingIntegracoes, setLoadingIntegracoes] = useState(true);
  const [loadingProdutos, setLoadingProdutos] = useState(false);

  // Filtros
  const [integracaoSelecionada, setIntegracaoSelecionada] = useState("todas");
  const [searchField, setSearchField] = useState("nome");
  const [searchValue, setSearchValue] = useState("");

  // ── Buscar integrações ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchIntegracoes = async () => {
      try {
        setLoadingIntegracoes(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/integracoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.sucesso) {
          setIntegracoes(data.integracoes);
        } else {
          setIntegracoes([]);
        }
      } catch (error) {
        console.error("Erro ao buscar integrações:", error);
        toast.error("Erro ao carregar integrações.");
      } finally {
        setLoadingIntegracoes(false);
      }
    };

    fetchIntegracoes();
  }, []);

  // ── Buscar categorias ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/categoria-produto`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.sucesso) {
          const map = {};
          data.categorias.forEach((c) => {
            map[c.id] = c.nome;
          });
          setCategorias(map);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  // ── Buscar produtos ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoadingProdutos(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/produto`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.sucesso) {
          setProdutos(data.produtos);
          fetchEstoques(data.produtos, token);
        } else {
          setProdutos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao carregar produtos.");
      } finally {
        setLoadingProdutos(false);
      }
    };

    fetchProdutos();
  }, []);

  // ── Buscar estoque de cada produto ───────────────────────────────────────
  const fetchEstoques = async (listaProdutos, token) => {
    const estoqueMap = {};
    await Promise.all(
      listaProdutos.map(async (produto) => {
        try {
          const res = await fetch(`${API_BASE_URL}/estoque/${produto.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.sucesso) {
            estoqueMap[produto.id] = {
              qtd_disponivel: data.estoque.qtd_disponivel ?? 0,
              qtd_minima: data.estoque.qtd_minima ?? 0,
            };
          } else {
            estoqueMap[produto.id] = { qtd_disponivel: 0, qtd_minima: 0 };
          }
        } catch {
          estoqueMap[produto.id] = { qtd_disponivel: 0, qtd_minima: 0 };
        }
      })
    );
    setEstoques(estoqueMap);
  };

  // ── Refresh de um produto ─────────────────────────────────────────────────
  const refreshEstoqueProduto = async (produtoId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/estoque/${produtoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) {
        setEstoques((prev) => ({
          ...prev,
          [produtoId]: {
            qtd_disponivel: data.estoque.qtd_disponivel ?? 0,
            qtd_minima: data.estoque.qtd_minima ?? 0,
          },
        }));
      }
    } catch {
      /* silently fail */
    }
  };

  // ── Filtrar produtos ─────────────────────────────────────────────────────
  const produtosFiltrados = useMemo(() => {
    let lista = [...produtos];

    // Filtro por integração
    if (integracaoSelecionada !== "todas") {
      lista = lista.filter(
        (p) => String(p.integracao_id) === String(integracaoSelecionada)
      );
    }

    // Filtro por busca
    if (searchValue.trim()) {
      const term = searchValue.trim().toLowerCase();
      lista = lista.filter((p) => {
        switch (searchField) {
          case "nome":
            return p.nome?.toLowerCase().includes(term);
          case "sku":
            return p.sku?.toLowerCase().includes(term);
          case "categoria":
            return categorias[p.categoria_id]?.toLowerCase().includes(term);
          case "preco":
            return String(p.preco).includes(term);
          default:
            return true;
        }
      });
    }

    // Ordenar por prioridade de estoque (esgotado primeiro)
    lista.sort((a, b) => {
      const estoqueA = estoques[a.id] ?? { qtd_disponivel: 0, qtd_minima: 0 };
      const estoqueB = estoques[b.id] ?? { qtd_disponivel: 0, qtd_minima: 0 };
      return (
        getStockStatusOrder(estoqueA.qtd_disponivel, estoqueA.qtd_minima) -
        getStockStatusOrder(estoqueB.qtd_disponivel, estoqueB.qtd_minima)
      );
    });

    return lista;
  }, [produtos, integracaoSelecionada, searchField, searchValue, categorias, estoques]);

  // ── Ações de botões ───────────────────────────────────────────────────────
  const handleEditar = (produto) => {
    alert(`Editar produto:\n• ID: ${produto.id}\n• Nome: ${produto.nome}\n• SKU: ${produto.sku}`);
  };

  const handleSincronizar = (produtoId) => {
    setProdutoIdParaSincronizar(produtoId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmarSincronizacao = async () => {
    const responsePublicarMl = await publicarProdutoML(produtoIdParaSincronizar);

    if(responsePublicarMl.sucesso){
      console.log("sucesso: " + responsePublicarMl.sucesso)
      toast.success(responsePublicarMl.mensagem);
    }else{
      toast.error(responsePublicarMl.mensagem);
    }

    setIsConfirmModalOpen(false);
    setProdutoIdParaSincronizar(null);
  };

  const handleCancelarSincronizacao = () => {
    alert("Sincronização cancelada.");
    setIsConfirmModalOpen(false);
    setProdutoIdParaSincronizar(null);
  };

  const publicarProdutoML = async (produtoId) => {
   try {
    const token = localStorage.getItem("authToken");

    // Enviar request para publicar
    const response = await fetch(`${API_BASE_URL}/produto/mercado-livre/publicar/${produtoId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return data;
   } catch (error) {
    console.error("Erro ao publicar produto no Mercado Livre: " + error.message);
    toast.error("Erro ao publicar produto no Mercado Livre.");
   } 
    
  }

  // ── Imagem de destaque ────────────────────────────────────────────────────
  const getImagemDestaque = (produto) => {
    // O campo `imagem_destaque` já vem na listagem via JOIN no backend
    const url = produto.imagem_destaque || null;
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}/${url}`;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loadingIntegracoes || loadingProdutos) {
    return <Loading message="Carregando estoque..." />;
  }

  return (
    <div className={estoqueStyles.tabContent}>
      {/* ── Filtro de integração ─── */}
      <div className={styles.topControls}>
        <div className={styles.integracaoSelectWrapper}>
          <Store size={18} className={styles.integracaoIcon} />
          <select
            id="select-integracao"
            className={styles.integracaoSelect}
            value={integracaoSelecionada}
            onChange={(e) => {
              setIntegracaoSelecionada(e.target.value);
              setSearchValue("");
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

        {/* ── Barra de pesquisa ─── */}
        <div className={styles.searchBar}>
          <div className={styles.searchFieldWrapper}>
            <select
              id="search-field"
              className={styles.searchFieldSelect}
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                setSearchValue("");
              }}
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.searchFieldArrow} />
          </div>

          <div className={styles.searchInputWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              id="search-input"
              type="text"
              placeholder={`Buscar por ${SEARCH_FIELDS.find((f) => f.value === searchField)?.label}...`}
              className={styles.searchInput}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <button className={estoqueStyles.btnAdd} onClick={() => setIsModalOpen(true)} style={{ whiteSpace: 'nowrap' }}>
          <Plus size={20} /> Adicionar Produto
        </button>
      </div>

      {/* ── Grid de produtos ─── */}
      {produtosFiltrados.length > 0 ? (
        <section className={estoqueStyles.stockTableSection}>
          <div className={styles.tableHeader}>
            <h3>
              {integracaoSelecionada === "todas"
                ? "Todos os Produtos"
                : `Produtos — ${integracoes.find((i) => String(i.id) === integracaoSelecionada)?.nome ?? ""}`}
              <span className={styles.countBadge}>{produtosFiltrados.length}</span>
            </h3>
          </div>

          <div className={estoqueStyles.tableWrapper}>
            <table className={styles.stockTable}>
              <thead>
                <tr>
                  <th className={styles.thImage}>Imagem</th>
                  <th>Título</th>
                  <th>SKU</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th className={estoqueStyles.centered}>Estoque Atual</th>
                  <th className={estoqueStyles.centered}>Status do Estoque</th>
                  <th className={estoqueStyles.centered}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => {
                  const est = estoques[produto.id] ?? { qtd_disponivel: 0, qtd_minima: 0 };
                  const status = getStockStatus(est.qtd_disponivel, est.qtd_minima);
                  const imagemUrl = getImagemDestaque(produto);

                  return (
                    <tr key={produto.id} className={styles.productRow}>
                      {/* Imagem */}
                      <td className={styles.tdImage}>
                        {imagemUrl ? (
                          <img
                            src={imagemUrl}
                            alt={produto.nome}
                            className={styles.productThumb}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={styles.productThumbPlaceholder}
                          style={{ display: imagemUrl ? "none" : "flex" }}
                        >
                          <ImageOff size={22} />
                        </div>
                      </td>

                      {/* Título */}
                      <td className={styles.tdNome}>
                        <span className={styles.productName}>{produto.nome}</span>
                      </td>

                      {/* SKU */}
                      <td>
                        <span className={styles.skuChip}>{produto.sku}</span>
                      </td>

                      {/* Preço */}
                      <td className={styles.tdPreco}>
                        R$ {Number(produto.preco).toFixed(2)}
                      </td>

                      {/* Categoria */}
                      <td className={styles.tdCategoria}>
                        {categorias[produto.categoria_id] || "—"}
                      </td>

                      {/* Estoque atual */}
                      <td className={`${estoqueStyles.centered} ${styles.tdEstoque}`}>
                        <span
                          className={`${styles.estoqueNum} ${styles[`estoqueNum__${status.key}`]}`}
                        >
                          {est.qtd_disponivel}
                        </span>
                        <span className={styles.estoqueUnit}>un.</span>
                      </td>

                      {/* Etiqueta de estoque */}
                      <td className={estoqueStyles.centered}>
                        <span
                          className={`${estoqueStyles.statusBadge} ${estoqueStyles[status.key]}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className={estoqueStyles.centered}>
                        <div className={styles.actionsCell}>
                          <button
                            className={`${styles.actionBtn} ${styles.btnEditar}`}
                            title="Editar produto"
                            onClick={() => handleEditar(produto)}
                          >
                            <Edit2 size={15} />
                            <span>Editar</span>
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.btnSincronizar}`}
                            title="Sincronizar com Mercado Livre"
                            onClick={() => handleSincronizar(produto.id)}
                          >
                            <RefreshCw size={15} />
                            <span>Sincronizar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* ── Empty state ── */
        <div className={estoqueStyles.emptyState}>
          <div className={estoqueStyles.emptyIcon}>
            <PackageX size={48} />
          </div>
          <h2>Nenhum produto em estoque</h2>
          <p>
            {searchValue
              ? `Nenhum produto encontrado para "${searchValue}" em "${SEARCH_FIELDS.find((f) => f.value === searchField)?.label}".`
              : integracaoSelecionada !== "todas"
              ? "Esta integração ainda não possui produtos cadastrados."
              : "Você ainda não possui produtos cadastrados no seu estoque."}
          </p>
          {!searchValue && (
            <button className={estoqueStyles.btnAdd} onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> Adicionar Produto
            </button>
          )}
        </div>
      )}

      <ModalProdutos isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <ModalConfirmacao
        isOpen={isConfirmModalOpen}
        onClose={handleCancelarSincronizacao}
        onConfirm={handleConfirmarSincronizacao}
        title="Sincronizar Produto?"
        message={`Deseja realmente sincronizar os dados do produto "${produtoIdParaSincronizar?.nome || ""}" para o Mercado Livre?`}
        btnConfirmText="Sim, Sincronizar"
        btnCancelText="Não, Cancelar"
        variant="info"
      />
    </div>
  );
}
