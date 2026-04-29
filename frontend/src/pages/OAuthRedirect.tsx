import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function OAuthRedirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  useEffect(() => {
    const userId = searchParams.get('userId')

    if (userId) {
      console.log("Google login successful! User ID:", userId)
      
      // CRITICAL FIX: Match exactly what AppContext.tsx expects!
      
      // 1. AppContext needs a JSON object under the key 'user' to set isLoggedIn = true
      const userData = { 
        id: userId, 
        username: "Google User" // Default fallback name, can be updated in profile
      }
      localStorage.setItem('user', JSON.stringify(userData))
      
      // 2. AppContext needs this specific key to fetch/create community posts
      localStorage.setItem('mydiet_user_db_id', userId)
      
      // 3. Force a full page reload so AppContext initializes with the new keys
      window.location.replace('/')
      
    } else {
      console.error("Failed to retrieve userId. Login unsuccessful.")
      setError(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    }
  }, [searchParams, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)' }}>
      <div className="text-center">
        {!error ? (
          <>
            <h2 className="mb-4 text-[24px] font-bold text-white">Verifying your Google account...</h2>
            <p className="text-white/50">Setting up your profile, redirecting you shortly...</p>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-[24px] font-bold text-[#F87171]">Login Failed</h2>
            <p className="text-white/50">Redirecting back to login...</p>
          </>
        )}
      </div>
    </div>
  )
}