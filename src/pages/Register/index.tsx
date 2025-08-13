import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import styles from './Register.module.css'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, loading } = useAuthStore()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return
    }
    
    const { error } = await signUp(email, password, fullName)
    
    if (error) {
      setMessage(error.message || 'Failed to create account')
      setMessageType('error')
    } else {
      setMessage('Account created successfully! Please check your email to verify your account.')
      setMessageType('success')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Create Account</h1>
          <p>Join Jeopardy Creator and start building your own games</p>
        </div>
        
        <form onSubmit={handleSignUp} className={styles.authForm}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>
          
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
              placeholder="Create a password"
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              className="form-input"
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          <p>Already have an account? 
            <Link to="/login" className={styles.authLink}>Sign in</Link>
          </p>
        </div>
      </div>
      
      {/* Error/Success Messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Register