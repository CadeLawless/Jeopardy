import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import styles from './Login.module.css'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { signIn, resetPassword, loading } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signIn(email, password)
    
    if (error) {
      setMessage(error.message || 'Failed to sign in')
      setMessageType('error')
    } else {
      navigate('/')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await resetPassword(resetEmail)
    
    if (error) {
      setMessage(error.message || 'Failed to send reset email')
      setMessageType('error')
    } else {
      setMessage('Password reset email sent successfully!')
      setMessageType('success')
      setShowForgotPassword(false)
      setResetEmail('')
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Sign In</h1>
          <p>Welcome back to Jeopardy Creator</p>
        </div>
        
        <form onSubmit={handleSignIn} className={styles.authForm}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className={styles.formLinks}>
            <button 
              type="button" 
              onClick={() => setShowForgotPassword(true)}
              className={styles.linkButton}
            >
              Forgot password?
            </button>
          </div>
        </form>
        
        <div className={styles.authFooter}>
          <p>Don't have an account? 
            <Link to="/register" className={styles.authLink}>Sign up</Link>
          </p>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label htmlFor="resetEmail">Email</label>
                <input
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowForgotPassword(false)} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Error/Success Messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Login