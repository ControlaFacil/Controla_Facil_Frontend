import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./style/LoginU.module.css";

export function LoginU() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("-----------------------------------------");
    console.log("🚀 INÍCIO: Tentativa de Login");
    
    setIsLoading(true);
    setMessage(null);

    try {
      console.log("🔑 Credenciais:", { email: login, senha: "********" });
      console.log("➡️ Enviando requisição para: /api/usuarios/login");

      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login, senha: senha }),
      });
      
      console.log(`📡 Resposta recebida. Status: ${response.status}`);

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log("📦 Dados da Resposta (JSON):", data);
      } catch (e) {
        console.warn("❌ Falha ao parsear JSON. Erro:", e.message);
        data = { error: "Erro de servidor. Resposta inválida." };
      }

      if (!response.ok) {
        console.log("🛑 ERRO HTTP: Resposta não OK.");
        const errorText = data.error || data.message || "Erro ao fazer login. Verifique suas credenciais.";
        setMessage({ 
          type: 'error', 
          text: errorText 
        });
        setIsLoading(false); 
        return;
      }

      console.warn("🚧 BYPASS ATIVADO: Ignorando a falta de 'token' ou 'usuario.id' na resposta 200.");
      
      localStorage.setItem("authToken", data.token || "DEBUG_TOKEN_PLACEHOLDER");
      localStorage.setItem("usuarioId", (data.usuario && data.usuario.id) || "DEBUG_ID_PLACEHOLDER");
      console.log("✅ Token e ID (ou placeholders) armazenados no localStorage.");
      
      setMessage({ type: 'success', text: "Login realizado com sucesso! Redirecionando..." });
      setTimeout(() => {
        console.log("➡️ INICIANDO REDIRECIONAMENTO para /home...");
        navigate("/home"); 
        console.log("-----------------------------------------");
      }, 800);

    } catch (error) {
      console.error("🔥 ERRO FATAL (Rede/Inesperado):", error.message);
      setMessage({ type: 'error', text: "Erro de conexão. Verifique sua rede e tente novamente." });
      setIsLoading(false);
      console.log("-----------------------------------------");
    }
  };

  return (
    <main className={styles.body}> 
      <div className={styles.loginContainer}>
        
        <div className={styles.loginBranding}>
          <i className={`fas fa-truck-moving ${styles.brandingIcon}`} aria-hidden="true"></i> 
          <h1>Controla Fácil</h1>
          <p>Gerenciamento de Logística Simplificado</p>
        </div>

        <div className={styles.loginFormArea}>
          <div className={styles.formHeader}>
            <h2>Bem-Vindo de Volta!</h2>
            <p>Faça seu login para acessar o painel.</p>
          </div>

          {message && (
            <div 
              className={`${styles.feedbackMessage} ${styles[message.type]}`}
              role={message.type === 'error' ? "alert" : "status"}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.loginForm}>

            <div className={styles.inputGroup}>
              <label htmlFor="username">E-mail ou Usuário</label>
              <div className={styles.inputFieldWrapper}>
                <i className="fas fa-user icon" aria-hidden="true"></i> 
                <input
                  type="email"
                  id="username"
                  name="username"
                  placeholder="Seu e-mail ou nome de usuário"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <div className={styles.inputFieldWrapper}>
                <i className="fas fa-lock icon" aria-hidden="true"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.rememberMe}>
                <input 
                    type="checkbox" 
                    name="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                /> 
                Lembrar-me
              </label>
              <Link to="/recuperar-senha" className={styles.forgotPassword}>
                Esqueceu a senha?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className={styles.btnLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                    <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> 
                    {' Entrando...'}
                </>
              ) : (
                <>
                    {'Entrar '}
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </>
              )}
            </button>
            
            <div className={styles.signupLink}>
              <p>Não tem uma conta? <Link to="/cadastro">Crie aqui</Link></p>
            </div>
          </form>
          <p className={styles.appVersion}>v1.0.0</p>
        </div>
      </div>
    </main>
  );
}