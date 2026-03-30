import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './style/HeaderU.module.css';
import controlafacilIcone from '../assets/icone.controlafacil.png';
import { User, Bell, Menu, X } from 'lucide-react'; 
import { UserMenu } from './UserMenu';

// LINKS DE NAVEGAÇÃO REVISADOS (Todos os links agora na navegação principal)
const PRIMARY_NAV_LINKS = [
    { to: "/home", label: "Dashboard" },
    { to: "/estoque", label: "Estoque" },
    // { to: "/relatorios", label: "Relatórios" },
    // { to: "/parceiros", label: "Parceiros" },
    // LINKS DE CADASTRO ADICIONADOS DE VOLTA À NAV PRINCIPAL
    { to: "/cadastro-produto", label: "Cadastrar Produto" },
    // { to: "/cadastro-parceiro", label: "Cadastrar Parceiro" },
];

export function HeaderU() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasNewNotifications] = useState(true); // Simulação de notificações

    function toggleUserMenu() {
        // UX: Fecha o menu móvel se o menu do usuário for aberto/fechado
        setIsMobileMenuOpen(false); 
        setIsUserMenuOpen(prev => !prev);
    }

    function toggleMobileMenu() {
        // UX: Fecha o menu do usuário se o menu móvel for aberto/fechado
        setIsUserMenuOpen(false); 
        setIsMobileMenuOpen(prev => !prev);
    }
    
    // Função auxiliar para aplicar as classes CSS Modules
    const getNavLinkClass = ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`;
    
    // Impede o fechamento do menu ao clicar dentro da nav mobile
    const handleMobileNavClick = (e) => {
        e.stopPropagation();
    };
    
    const handleLinkClick = () => {
        // Fecha o menu móvel ao clicar em qualquer link
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <NavLink to="/home" className={styles.logoLink}>
                <div className={styles.logo}>
                    <img src={controlafacilIcone} alt="Controla Fácil Logo" className={styles.logoImg} />
                    <span className={styles.logoText}>Controla Fácil</span>
                </div>
            </NavLink>

            {/* NAV PRINCIPAL (Desktop) */}
            <nav className={styles.nav}>
                {PRIMARY_NAV_LINKS.map(link => (
                    <NavLink 
                        key={link.to}
                        to={link.to} 
                        className={getNavLinkClass}
                        end
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
            
            {/* ÍCONES E PERFIL */}
            <div className={styles.userProfile}>
                {/* Ícone de Notificação com ponto vermelho */}
                <div className={styles.notificationWrapper}>
                    <Bell size={20} className={styles.notificationIcon} />
                    {hasNewNotifications && <span className={styles.notificationDot}></span>}
                </div>

                <span className={styles.userName}>Olá, Admin!</span>
                
                {/* User Menu Dropdown */}
                <div className={styles.userWrapper}>
                    <User size={24} className={styles.userIcon} onClick={toggleUserMenu} />
                    {isUserMenuOpen && (
                        // O UserMenu agora não precisa mais de secondaryLinks, pois eles estão no Header
                        <UserMenu 
                            onClose={toggleUserMenu} 
                        />
                    )}
                </div>

                {/* Botão Hamburger (Mobile only) */}
                <button className={styles.menuButton} onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            
            {/* NAV MOBILE (Integrado) */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenuOverlay} onClick={toggleMobileMenu}>
                    <nav className={styles.mobileNav} onClick={handleMobileNavClick}>
                        <h2>Menu Principal</h2>
                        {PRIMARY_NAV_LINKS.map(link => (
                            <NavLink 
                                key={link.to}
                                to={link.to} 
                                className={getNavLinkClass}
                                end
                                onClick={handleLinkClick}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}