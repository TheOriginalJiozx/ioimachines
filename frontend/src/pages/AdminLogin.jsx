import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if(!email || !password){ setError('Udfyld email og adgangskode'); return }
    setLoading(true)
    try{
      // Replace with real API call when available
      // const res = await fetch('/api/admin/login',{ method: 'POST', body: JSON.stringify({email,password}) })
      // const json = await res.json()
      // if (!res.ok) throw new Error(json.message || 'Login failed')

      // Fake success for now
      localStorage.setItem('adminToken','demo-token')
      navigate('/')
    }catch(err){
      setError(err.message||'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 mb-3 w-full border rounded px-3 py-2" type="email" />
          <label className="block text-sm font-medium text-gray-700">Adgangskode</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 mb-3 w-full border rounded px-3 py-2" type="password" />
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-[#444444] text-white py-2 rounded">
            {loading ? 'Logger ind...' : 'Log ind'}
          </button>
        </form>
      </div>
    </div>
  )
}
