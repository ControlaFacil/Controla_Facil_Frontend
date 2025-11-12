import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./style/LoginU.module.css";
import logo from "../assets/logo.controlafacil.jpg";

export function LoginU() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      console.log("📤 Tentando login com:", login);

      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login, senha: senha }),
      });

      const text = await response.text();
      console.log("🧾 Texto da resposta:", text);

      const data = text ? JSON.parse(text) : {};
      console.log("✅ Dados recebidos:", data);

      if (!response.ok || !data.usuario || !data.usuario.id) {
        alert(data.error || "Erro ao fazer login.");
        return;
      }
      
      localStorage.setItem("usuarioId", data.usuario.id);

      alert("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error.message);
      alert("Erro ao fazer login: " + error.message);
    }
  };

  return (
    <div className={styles.tela}>
      <div className={styles.login}>
        <div className={styles.loginajuste}>
          <h1>Seja Bem-Vindo ao Controla Fácil</h1>
          <h2>Faça seu login</h2>

          <h3>Login</h3>
          <input
            type="text"
            name="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <h3>Senha</h3>
          <input
            type="password"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <h4>
            <Link to="/cadastro">Não tem conta? Crie aqui</Link>
          </h4>
          <h5>
            <Link to="/recuperar-senha">Esqueceu a senha? Recupere aqui</Link>
          </h5>

          <button className={styles.botao} onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>

      <div className={styles.imagem}>
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
}
