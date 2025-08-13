import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import styles from './AppHeader.module.css'

const AppHeader: React.FC = () => {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
  }
  
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <h1>Jeopardy Creator</h1>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          <svg className={styles.hamburgerIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>

        <nav className={`${styles.navMenu} ${showMobileMenu ? styles.mobileOpen : ''}`}>
          <Link to="/" className={styles.navLink} onClick={closeMobileMenu}>Dashboard</Link>
          <Link to="/game-boards" className={styles.navLink} onClick={closeMobileMenu}>My Games</Link>
          <Link to="/game-boards/create" className={styles.navLink} onClick={closeMobileMenu}>Create Game</Link>
          
          <div className={styles.userMenu}>
            <button 
              onClick={() => setShowUserDropdown(!showUserDropdown)} 
              className={styles.userButton}
            >
              {user?.full_name || user?.email}
              <svg 
                className={`${styles.dropdownIcon} ${showUserDropdown ? styles.rotated : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showUserDropdown && (
              <div className={styles.userDropdown} onClick={() => setShowUserDropdown(false)}>
                <Link to="/profile" className={styles.dropdownItem} onClick={closeMobileMenu}>Profile</Link>
                <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className={styles.dropdownItem}>Sign Out</button>
              </div>
            )}
          </div>
        </nav>
        
        {/* Mobile menu overlay */}
        {showMobileMenu && (
          <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}></div>
        )}
      </div>
    </header>
  )
}

export default AppHeader