import { useEffect, useState } from "react";
import styles from "./style/MeusDados.module.css";

export function MeusDados() {
  const [usuario, setUsuario] = useState({
    nomeEmpresa: "",
    cnpj: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    complemento: "",
  });

  useEffect(() => {
    const fetchDadosUsuario = async () => {
      const usuarioId = localStorage.getItem("usuarioId");

      if (!usuarioId) {
        console.warn("⚠️ Nenhum ID de usuário encontrado.");
        return;
      }

      try {
        console.log("🔍 Buscando dados do usuário com ID:", usuarioId);

        // Buscar dados do usuário
        const response = await fetch(`/api/usuarios/${usuarioId}`);
        const text = await response.text();
        const parsed = text ? JSON.parse(text) : null;
        const data = parsed?.data;

        if (!response.ok || !data) {
          console.error("❌ Erro ao buscar dados:", response.status);
          return;
        }

        setUsuario({
          nomeEmpresa: data.razaoSocial || "",
          cnpj: data.cnpj || "",
          telefone: data.telefone || "",
          email: data.email || "",
          senha: "",
          confirmarSenha: "",
        });

        // Buscar endereços vinculados
        const enderecoRes = await fetch(`/api/endereco/usuario/${usuarioId}`);
        const enderecoText = await enderecoRes.text();
        const enderecoParsed = enderecoText ? JSON.parse(enderecoText) : null;
        console.log("📦 Dados de endereço recebidos:", enderecoParsed);

if (enderecoRes.ok && Array.isArray(enderecoParsed?.enderecos) && enderecoParsed.enderecos.length > 0) {
  const primeiroEndereco = enderecoParsed.enderecos[0];
  console.log("📍 Primeiro endereço encontrado:", primeiroEndereco);

  setEndereco({
    rua: primeiroEndereco.rua || "",
    numero: primeiroEndereco.numero?.toString() || "",
    bairro: primeiroEndereco.bairro || "",
    cidade: primeiroEndereco.cidade || "",
    estado: primeiroEndereco.estado || "",
    cep: primeiroEndereco.cep || "",
    complemento: primeiroEndereco.complemento || "",
  });
} else {
  console.warn("⚠️ Nenhum endereço válido retornado pela API:", enderecoParsed);
}

      } catch (error) {
        console.error("❌ Erro ao buscar dados do usuário:", error);
      }
    };

    fetchDadosUsuario();
  }, []);

  return (
    <div className={styles.container}>
      <form className={styles.formWrapper}>
        <h2 className={styles.title}>Meus Dados</h2>

        <h3 className={styles.subtitle}>Dados da empresa</h3>
        <label className={styles.label}>Razão Social:</label>
        <input className={styles.input} type="text" value={usuario.nomeEmpresa} disabled />

        <label className={styles.label}>CNPJ:</label>
        <input className={styles.input} type="text" value={usuario.cnpj} disabled />

        <label className={styles.label}>Telefone:</label>
        <input className={styles.input} type="text" value={usuario.telefone} disabled />

        <label className={styles.label}>E-mail:</label>
        <input className={styles.input} type="text" value={usuario.email} disabled />

        <h3 className={styles.subtitle}>Endereço da empresa</h3>
        <label className={styles.label}>Rua:</label>
        <input className={styles.input} type="text" value={endereco.rua} disabled />

        <label className={styles.label}>Número:</label>
        <input className={styles.input} type="text" value={endereco.numero} disabled />

        <label className={styles.label}>Bairro:</label>
        <input className={styles.input} type="text" value={endereco.bairro} disabled />

        <label className={styles.label}>Cidade:</label>
        <input className={styles.input} type="text" value={endereco.cidade} disabled />

        <label className={styles.label}>Estado:</label>
        <input className={styles.input} type="text" value={endereco.estado} disabled />

        <label className={styles.label}>CEP:</label>
        <input className={styles.input} type="text" value={endereco.cep} disabled />

        <label className={styles.label}>Complemento:</label>
        <input className={styles.input} type="text" value={endereco.complemento} disabled />
      </form>
    </div>
  );
}
