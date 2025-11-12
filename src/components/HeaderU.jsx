import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './style/HeaderU.module.css';
import controlafacilIcone from '../assets/icone.controlafacil.png';
import { User } from 'lucide-react';
import { UserMenu } from './UserMenu';

export function HeaderU() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function toggleMenu() {
        setIsMenuOpen(prev => !prev);
    }

    return (
        <header className={styles.header}>
            <NavLink to="/home" className={styles.logoLink}>
                <div className={styles.logo}>
                    <img src={controlafacilIcone} alt="Logo" className={styles.logoImg} />
                    <span>Controla Fácil</span>
                </div>
            </NavLink>

            <nav className={styles.nav}>
                <NavLink to="/home" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
                <NavLink to="/cadastro-produto">Cadastrar Produto</NavLink>
                <NavLink to="/estoque">Estoque</NavLink>
                <NavLink to="#">Relatórios</NavLink>
                <NavLink to="/parceiros">Parceiros</NavLink>
                <NavLink to="/cadastro-parceiro">Cadastrar Parceiro</NavLink>
            </nav>

            <div className={styles.userProfile}>
                <span>🔔</span>
                <span>Olá, Admin!</span>
                <div className={styles.userWrapper}>
                    <User className={styles.user} onClick={toggleMenu} />
                    {isMenuOpen && <UserMenu />}
                </div>
            </div>
        </header>
    );
}
