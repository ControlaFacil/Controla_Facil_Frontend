import { useEffect, useState } from "react";
import styles from "./style/MeusDados.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, Save, XCircle } from 'lucide-react';

const maskCpfCnpj = (value) => {
    const cleanValue = String(value).replace(/\D/g, "");
    const length = cleanValue.length;

    if (length <= 11) {
        return cleanValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    } else if (length === 14) {
        return cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    return cleanValue; 
};

const maskcelular = (value) => {
    const cleanValue = String(value).replace(/\D/g, "");
    if (cleanValue.length <= 10) {
        return cleanValue.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    } else if (cleanValue.length === 11) {
        return cleanValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }
    return cleanValue; 
};

export function MeusDados() {
    const [usuario, setUsuario] = useState({
        nome: "", 
        cpf: "", 
        celular: "", 
        email: "",
        senha: "",
        confirmarSenha: "",
        id: null, 
    });

    const [originalUsuario, setOriginalUsuario] = useState({}); 
    const [isEditing, setIsEditing] = useState(false); 
    const [isLoading, setIsLoading] = useState(true); 
    const [isSaving, setIsSaving] = useState(false); 

    useEffect(() => {
        const fetchDadosUsuario = async () => {
            const authToken = localStorage.getItem("authToken");
            setIsLoading(true);

            console.log("-----------------------------------------");
            console.log("🚀 INÍCIO: Busca de Dados do Usuário Logado (/me)");

            if (!authToken) {
                console.error("⚠️ Token de autenticação não encontrado. Redirecionar para login.");
                toast.error("Sessão expirada ou não autenticada. Faça login novamente.");
                setIsLoading(false);
                return;
            }
            
            try {
                const response = await fetch("/api/usuarios/me", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                });
                
                console.log(`📡 Resposta /me recebida. Status: ${response.status}`);

                if (response.status === 401) {
                    console.error("❌ ERRO 401: Não Autorizado. Token inválido.");
                    toast.error("Token inválido. Redirecionando para login.");
                    setIsLoading(false);
                    return;
                }
                
                const data = await response.json();
                const userDataFromApi = data.usuario;

                if (!response.ok || !userDataFromApi) {
                    const errorText = data.message || "Erro ao carregar dados do usuário.";
                    console.error("❌ Erro ao buscar dados:", errorText);
                    toast.error(errorText);
                    setIsLoading(false);
                    return;
                }
                
                const userData = {
                    id: userDataFromApi.id, 
                    nome: userDataFromApi.nome || "", 
                    cpf: userDataFromApi.cpf || "", 
                    celular: userDataFromApi.celular || "", 
                    email: userDataFromApi.email || "",
                    senha: "", 
                    confirmarSenha: "",
                };
                
                setUsuario(userData);
                setOriginalUsuario(userData); 
                
                toast.success("Dados do usuário carregados com sucesso!");

            } catch (error) {
                console.error("🔥 ERRO FATAL (Rede/Inesperado):", error);
                toast.error("Erro de conexão ao carregar seus dados.");
            } finally {
                setIsLoading(false);
                console.log("-----------------------------------------");
            }
        };
        fetchDadosUsuario();
    }, []); 

    const handleUpdate = async () => {
        setIsSaving(true);
        const authToken = localStorage.getItem("authToken");

        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf, 
            celular: usuario.celular, 
        };

        if (usuario.senha) {
            payload.senha = usuario.senha;
        }

        console.log("-----------------------------------------");
        console.log("🔄 INÍCIO: Tentativa de Atualização (PUT)");
        console.log("➡️ Enviando para:", `/api/usuarios/${usuario.id}`);
        console.log("📦 Payload:", payload);
        
        try {
            const response = await fetch(`/api/usuarios/${usuario.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });

            console.log(`📡 Resposta PUT recebida. Status: ${response.status}`);
            
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            console.log("📦 Dados da Resposta:", data);

            if (!response.ok) {
                const errorText = data.message || "Erro ao salvar dados. Verifique o formulário.";
                console.error("❌ ERRO NO PUT:", errorText);
                toast.error(errorText);
                setIsSaving(false);
                return;
            }

            toast.success("Dados atualizados com sucesso!");

            setOriginalUsuario(usuario);
            setIsEditing(false);

        } catch (error) {
            console.error("🔥 ERRO FATAL (Rede/Inesperado):", error);
            toast.error("Erro de conexão. Não foi possível salvar.");
        } finally {
            setIsSaving(false);
            console.log("-----------------------------------------");
        }
    }

    const handleChange = (e, stateSetter) => {
        const { name, value } = e.target;
        
        if (name === "cpf" || name === "celular") {
             const cleanValue = value.replace(/\D/g, "");
             stateSetter(prev => ({ ...prev, [name]: cleanValue }));
        } else {
             stateSetter(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditToggle = (cancel = false) => {
        if (cancel) {
            setUsuario(originalUsuario);
            setUsuario(prev => ({ ...originalUsuario, senha: "", confirmarSenha: "" }));
            toast.info("Edição cancelada. Dados revertidos.");
        }
        setIsEditing(prev => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (usuario.senha && usuario.senha !== usuario.confirmarSenha) {
            toast.error("As novas senhas não coincidem.");
            return;
        }
        const cleanCpf = usuario.cpf;
        const cleancelular = usuario.celular;

        if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
            toast.error("CNPJ/CPF inválido. Deve ter 11 ou 14 dígitos.");
            return;
        }
        if (cleancelular.length < 10 || cleancelular.length > 11) {
            toast.error("Celular inválido. Deve ter 10 ou 11 dígitos (DDD + número).");
            return;
        }
        
        handleUpdate();
    };


    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnHover />
            
            <form className={styles.formWrapper} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Meus Dados</h2>
                    
                    <div className={styles.buttonContainer}>
                        {!isEditing ? (
                            <button 
                                type="button" 
                                className={styles.editBtn} 
                                onClick={() => handleEditToggle(false)} 
                                disabled={isLoading || isSaving}
                            >
                                <Edit size={18} /> Editar Dados
                            </button>
                        ) : (
                            <>
                                <button type="button" className={`${styles.editBtn} ${styles.cancelBtn}`} onClick={() => handleEditToggle(true)} disabled={isSaving}>
                                    <XCircle size={18} /> Cancelar
                                </button>
                                <button type="submit" className={`${styles.editBtn} ${styles.saveBtn}`} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} /> Salvar
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                {isLoading ? (
                    <div className={styles.loading}>
                        <i className="fas fa-spinner fa-spin" aria-hidden="true"></i> 
                        <p>Carregando dados...</p>
                    </div>
                ) : (
                    <>
                        <h3 className={styles.subtitle}>Dados do Usuário/Empresa</h3> 

                        <div className={styles.dataGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nome:</label>
                                <input 
                                    className={styles.input} 
                                    type="text" 
                                    name="nome"
                                    value={usuario.nome} 
                                    onChange={(e) => handleChange(e, setUsuario)}
                                    disabled={!isEditing} 
                                    required 
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.label}>CPF:</label>
                                <input 
                                    className={styles.input} 
                                    type="text" 
                                    name="cpf"
                                    value={maskCpfCnpj(usuario.cpf)} 
                                    onChange={(e) => handleChange(e, setUsuario)}
                                    disabled={!isEditing} 
                                    maxLength={18} 
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>E-mail:</label>
                                <input 
                                    className={styles.input} 
                                    type="email" 
                                    name="email"
                                    value={usuario.email} 
                                    onChange={(e) => handleChange(e, setUsuario)}
                                    disabled={!isEditing} 
                                    required
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Celular:</label>
                                <input 
                                    className={styles.input} 
                                    type="tel" 
                                    name="celular"
                                    value={maskcelular(usuario.celular)} 
                                    onChange={(e) => handleChange(e, setUsuario)}
                                    disabled={!isEditing} 
                                    maxLength={15} 
                                    required
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <>
                                <h3 className={styles.subtitle}>Alterar Senha (Opcional)</h3>
                                <div className={styles.dataGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Nova Senha:</label>
                                        <input 
                                            className={styles.input} 
                                            type="password" 
                                            name="senha"
                                            value={usuario.senha} 
                                            onChange={(e) => handleChange(e, setUsuario)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Confirmar Nova Senha:</label>
                                        <input 
                                            className={styles.input} 
                                            type="password" 
                                            name="confirmarSenha"
                                            value={usuario.confirmarSenha} 
                                            onChange={(e) => handleChange(e, setUsuario)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </form>
        </div>
    );
}