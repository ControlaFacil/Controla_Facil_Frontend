import { useNavigate } from "react-router-dom";
import styles from './style/HeaderU.module.css';

export function UserMenu() {
  const navigate = useNavigate();

  const handleMeusDados = () => {
    navigate("/meus-dados");
  };

  const handleSair = () => {
    navigate("/");
  };

  return (
    <div className={styles.userMenu}>
      <p onClick={handleMeusDados}>Meus dados</p>
      <p onClick={handleSair}>Sair</p>
    </div>
  );
}
