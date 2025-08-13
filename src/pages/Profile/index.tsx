import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/context/authContext'
import { useGameBoardStore } from '@/context/gameBoardContext'
import styles from './Profile.module.css'

const Profile: React.FC = () => {
  const { user, updateProfile, loading } = useAuthStore()
  const { gameBoards, fetchGameBoards } = useGameBoardStore()
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const totalQuestions = gameBoards.reduce((total, board) => {
    return total + board.categories.reduce((catTotal, category) => {
      return catTotal + category.questions.length
    }, 0)
  }, 0)

  const memberSince = user?.created_at 
    ? new Date(user.created_at).getFullYear().toString()
    : 'N/A'

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await updateProfile({
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url
    })
    
    if (error) {
      setMessage(error.message || 'Failed to update profile')
      setMessageType('error')
    } else {
      setMessage('Profile updated successfully!')
      setMessageType('success')
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || ''
      })
      fetchGameBoards(user.id)
    }
  }, [user, fetchGameBoards])

  return (
    <div className={styles.profileContainer}>
      <div className="page-header">
        <div className="header-content">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>
      </div>
      
      <div className="content">
        <div className={styles.profileContent}>
          <div className={styles.profileCard}>
            <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  value={profileData.email}
                  type="email"
                  disabled
                  className="form-input disabled"
                />
                <small className="form-help">Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="avatarUrl">Avatar URL</label>
                <input
                  id="avatarUrl"
                  value={profileData.avatar_url}
                  onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
                <small className="form-help">Optional: Link to your profile picture</small>
              </div>
              
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
          
          <div className={styles.accountStats}>
            <h2>Account Statistics</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{gameBoards.length}</div>
                <div className={styles.statLabel}>Games Created</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{totalQuestions}</div>
                <div className={styles.statLabel}>Questions Written</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{memberSince}</div>
                <div className={styles.statLabel}>Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Profile