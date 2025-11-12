import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style/Cadastro.module.css";
import logo from "../assets/logo.controlafacil.jpg";

export function Cadastro() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [usuario, setUsuario] = useState({
    nomeEmpresa: "",
    cnpj: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    complemento: ""
  });

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({
      ...prev,
      [name]: name === "numero" ? (value ? parseInt(value, 10) : null) : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usuario.senha !== usuario.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      console.log("📤 Enviando dados do endereço:", endereco);

      const enderecoRes = await fetch("/api/endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(endereco)
      });

      const enderecoText = await enderecoRes.text();
      const enderecoData = enderecoText ? JSON.parse(enderecoText) : {};

      if (!enderecoRes.ok) {
        let erroEndereco = "Erro ao cadastrar endereço.";
        try {
          const json = JSON.parse(enderecoText);
          erroEndereco = json.message || erroEndereco;
        } catch {
          erroEndereco = enderecoText || erroEndereco;
        }
        alert(erroEndereco);
        return;
      }

      if (!enderecoData.endereco || !enderecoData.endereco.id) {
        alert("Erro: ID do endereço não retornado.");
        return;
      }

      const idEndereco = enderecoData.endereco.id;

      const usuarioPayload = {
        cnpj: usuario.cnpj.replace(/\D/g, ""),
        razaoSocial: usuario.nomeEmpresa,
        apelidoEmpresa: usuario.nomeEmpresa,
        email: usuario.email,
        telefone: usuario.telefone.replace(/\D/g, ""),
        senha: usuario.senha,
        endereco: idEndereco
      };

      console.log("📤 Enviando dados do usuário com endereço:", usuarioPayload);

      const usuarioRes = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioPayload)
      });

      const rawUsuarioText = await usuarioRes.text();
      const usuarioData = rawUsuarioText ? JSON.parse(rawUsuarioText) : {};

      console.log("📥 Resposta do cadastro de usuário:", usuarioData);

      if (!usuarioRes.ok) {
        let erroUsuario = "Erro ao cadastrar usuário.";
        try {
          const json = JSON.parse(rawUsuarioText);
          erroUsuario = json.message || erroUsuario;
        } catch {
          erroUsuario = rawUsuarioText || erroUsuario;
        }
        alert(erroUsuario);
        return;
      }

      const idUsuario =
        usuarioData.idUsuario?.id ||
        usuarioData.usuario?.id ||
        usuarioData.id ||
        usuarioData.data?.id ||
        null;


      if (!idUsuario) {
        alert("Erro: ID do usuário não retornado.");
        return;
      }

      console.log("🔗 Vinculando endereço ao usuário...", {
        idUsuario,
        idEndereco
      });

      const vinculoRes = await fetch("/api/endereco/vincular-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario,
          idEndereco
        })
      });

      const vinculoText = await vinculoRes.text();
      const vinculoData = vinculoText ? JSON.parse(vinculoText) : {};

      if (!vinculoRes.ok) {
        let erroVinculo = "Erro ao vincular endereço ao usuário.";
        try {
          const json = JSON.parse(vinculoText);
          erroVinculo = json.message || erroVinculo;
        } catch {
          erroVinculo = vinculoText || erroVinculo;
        }
        alert(erroVinculo);
        return;
      }

      const loginRes = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuario.email,
          senha: usuario.senha
        })
      });

      const loginText = await loginRes.text();
      const loginData = loginText ? JSON.parse(loginText) : {};

      if (!loginRes.ok || !loginData.usuario || !loginData.usuario.id) {
        alert("Erro ao fazer login automático. Tente manualmente.");
        return;
      }

      alert("Cadastro e login realizados com sucesso!");
      navigate("/home");

    } catch (err) {
      console.error("🔥 Erro inesperado:", err);
      alert("Erro inesperado. Verifique o console.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.steps}>
          <div className={step === 1 ? styles.stepActive : styles.step}>Empresa</div>
          <div className={styles.line}></div>
          <div className={step === 2 ? styles.stepActive : styles.step}>Endereço</div>
          <div className={styles.line}></div>
          <div className={step === 3 ? styles.stepActive : styles.step}>Cadastro</div>
        </div>

        <form className={styles.card} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Crie sua conta</h2>
          <h2 className={styles.subtitle}>
            {step === 1
              ? "Dados da empresa"
              : step === 2
                ? "Endereço da empresa"
                : "Cadastro de acesso"}
          </h2>

          {step === 1 && (
            <>
              <label className={styles.label}>Razão Social:</label>
              <input type="text" name="nomeEmpresa" value={usuario.nomeEmpresa} onChange={(e) => handleChange(e, setUsuario)} className={styles.input} />
              <label className={styles.label}>CNPJ:</label>
              <input type="text" name="cnpj" value={usuario.cnpj} onChange={(e) => handleChange(e, setUsuario)} className={styles.input} />
              <label className={styles.label}>Telefone:</label>
              <input type="text" name="telefone" value={usuario.telefone} onChange={(e) => handleChange(e, setUsuario)} className={styles.input} />
            </>
          )}

          {step === 2 && (
            <>
              <label className={styles.label}>Rua:</label>
              <input type="text" name="rua" value={endereco.rua} onChange={(e) => handleChange(e, setEndereco)} className={styles.input} />

              <label className={styles.label}>Número:</label>
              <input type="text" name="numero" value={endereco.numero} onChange={(e) => handleChange(e, setEndereco)} className={styles.input} />

              <label className={styles.label}>Bairro:</label>
              <input type="text" name="bairro" value={endereco.bairro} onChange={(e) => handleChange(e, setEndereco)} className={styles.input} />

              <label className={styles.label}>Cidade:</label>
              <input type="text" name="cidade" value={endereco.cidade} onChange={(e) => handleChange(e, setEndereco)} className={styles.input} />

              <label className={styles.label}>Estado:</label>
              <select
                name="estado"
                value={endereco.estado}
                onChange={(e) => handleChange(e, setEndereco)}
                className={styles.input}
              >
                <option value="">Selecione um estado</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>

              <label className={styles.label}>CEP:</label>
              <input
                type="text"
                name="cep"
                value={endereco.cep}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  setEndereco((prev) => ({
                    ...prev,
                    cep: onlyNumbers
                  }));
                }}
                className={styles.input}
              />

              <label className={styles.label}>Complemento:</label>
              <input type="text" name="complemento" value={endereco.complemento} onChange={(e) => handleChange(e, setEndereco)} className={styles.input} />
            </>

          )}

          {step === 3 && (
            <>
              <label className={styles.label}>E-mail:</label>
              <input type="email" name="email" value={usuario.email} onChange={(e) => handleChange(e, setUsuario)} className={styles.input} />
              <label className={styles.label}>Senha:</label>
              <input type="password" name="senha" value={usuario.senha} onChange={(e) => handleChange(e, setUsuario)} className={styles.input} />
              <label className={styles.label}>Confirmar senha:</label>
              <input type="password" name="confirmarSenha" value={usuario.confirmarSenha} onChange={(e) => handleChange(e, setUsuario)} className={styles.input} />
            </>
          )}

          {step > 1 && (
            <button type="button" className={styles.button} onClick={() => setStep(step - 1)} style={{ backgroundColor: "#d1d5db", color: "#374151", marginBottom: "8px" }}>
              Voltar
            </button>
          )}

          {step < 3 && (
            <button type="button" className={styles.button} onClick={() => setStep(step + 1)}>
              Próximo
            </button>
          )}

          {step === 3 && (
            <button type="submit" className={styles.button}>
              Finalizar
            </button>
          )}
        </form>
      </div>

      <div className={styles.rightSide}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
    </div>
  );
}
