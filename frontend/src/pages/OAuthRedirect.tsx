import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function OAuthRedirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [statusText, setStatusText] = useState("Authenticating...")

  useEffect(() => {
    const userId = searchParams.get('userId')

    if (!userId) {
      console.error("OAuth authentication failed: Missing user identity")
      setError(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
      return
    }

    const syncUserData = async () => {
      try {
        setStatusText("Syncing your profile...")
        
        // Automatically determine the backend URL based on the environment
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const backendUrl = isLocal ? 'http://localhost:8080' : 'https://mydiet-l8vb.onrender.com';

        // 1. Fetch the complete user profile from the database
        const response = await fetch(`${backendUrl}/api/users/${userId}/profile`);
        
        // Clear legacy local storage to prevent data leakage between different accounts
        localStorage.removeItem('mydiet_user')
        localStorage.removeItem('mydiet_plan')
        localStorage.removeItem('mydiet_daily')
        localStorage.removeItem('mydiet_plan_done')
        localStorage.removeItem('mydiet_nutrition_targets')
        
        // Establish basic authentication state
        localStorage.setItem('user', JSON.stringify({ id: userId, username: "Google User" }))
        localStorage.setItem('mydiet_user_db_id', userId)

        if (response.ok) {
          const dbUser = await response.json();
          
          // 2. Restore user profile data to local storage (mapping backend camelCase fields)
          const restoredProfile = {
            uid: `UID-${String(userId).padStart(6, '0')}`,
            name: "Google User",
            age: dbUser.age || "",
            gender: dbUser.gender || "",
            height: dbUser.heightCm || "", 
            weight: dbUser.weightKg || "", 
            targetWeight: dbUser.targetWeight || "", 
            goal: dbUser.goal || "",
            activityLevel: dbUser.activityLevel || "",
            // Convert allergies array from backend into a comma-separated string for the frontend
            allergies: Array.isArray(dbUser.allergies) ? dbUser.allergies.join(', ') : (dbUser.allergies || "")
          }
          localStorage.setItem('mydiet_user', JSON.stringify(restoredProfile))

          // 3. Smart routing: redirect to homepage if weight exists (existing user), else go to plan setup
          if (dbUser.weightKg) {
            window.location.replace('/')
          } else {
            window.location.replace('/plan')
          }
          
        } else {
          throw new Error("Profile API not found or returned error")
        }
      } catch (err) {
        console.warn("Could not fetch user profile from DB, treating as new user:", err)
        // Fallback: Initialize an empty profile for new users if API fails
        const emptyProfile = {
          name: "Google User",
          uid: `UID-${String(userId).padStart(6, '0')}`
        }
        localStorage.setItem('mydiet_user', JSON.stringify(emptyProfile))
        window.location.replace('/plan')
      }
    }

    syncUserData()

  }, [searchParams, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)' }}>
      <div className="text-center">
        {!error ? (
          <>
            <h2 className="mb-4 text-[24px] font-bold text-white">{statusText}</h2>
            <p className="text-white/50">Please wait while we set up your session.</p>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-[24px] font-bold text-[#F87171]">Authentication Failed</h2>
            <p className="text-white/50">Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  )
}