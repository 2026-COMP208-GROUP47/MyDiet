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
      setError(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
      return
    }

    const syncUserData = async () => {
      try {
        setStatusText("Syncing your profile...")
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const backendUrl = isLocal ? 'http://localhost:8080' : 'https://mydiet-l8vb.onrender.com';

        // Clear existing local storage data to prevent stale states
        localStorage.removeItem('user')
        localStorage.removeItem('mydiet_user')
        localStorage.removeItem('mydiet_plan')
        localStorage.removeItem('mydiet_daily')

        const response = await fetch(`${backendUrl}/api/users/${userId}/profile`);

        if (response.ok) {
          const dbUser = await response.json();
          
          // Retrieve the real name from the database, fallback to "Google User" if null
          const realName = dbUser.username || "Google User"; 
          
          // Store the basic user login state
          localStorage.setItem('user', JSON.stringify({ id: userId, username: realName }))
          localStorage.setItem('mydiet_user_db_id', userId)
          
          // Store the detailed user profile for the application context
          const restoredProfile = {
            uid: `UID-${String(userId).padStart(6, '0')}`,
            name: realName, 
            avatar: dbUser.avatarUrl || "",
            age: dbUser.age || "",
            gender: dbUser.gender || "",
            height: dbUser.heightCm || "", 
            weight: dbUser.weightKg || "", 
            targetWeight: dbUser.targetWeight || "", 
            goal: dbUser.goal || "",
            activityLevel: dbUser.activityLevel || "",
            allergies: Array.isArray(dbUser.allergies) ? dbUser.allergies.join(', ') : (dbUser.allergies || "")
          }
          localStorage.setItem('mydiet_user', JSON.stringify(restoredProfile))

          // Add a 300ms delay to ensure local storage is fully written before forcing a reload
          setTimeout(() => {
            if (dbUser.weightKg) {
              window.location.href = '/'
            } else {
              window.location.href = '/plan'
            }
          }, 300)

        } else {
          throw new Error("Profile API returned an error status")
        }
      } catch (err) {
        // Log the error for debugging purposes instead of silently overwriting with default data
        console.error("Data synchronization failed:", err);
        setStatusText("Sync failed. Please check the console.");
        setError(true);
      }
    }
    
    syncUserData()
  }, [searchParams, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)' }}>
      <div className="text-center">
        {!error ? (
          <h2 className="mb-4 text-[24px] font-bold text-white">{statusText}</h2>
        ) : (
          <h2 className="mb-4 text-[24px] font-bold text-[#F87171]">Authentication Failed</h2>
        )}
      </div>
    </div>
  )
}