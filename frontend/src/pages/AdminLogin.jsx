import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [existingToken] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("adminToken") : null));
  if (existingToken) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("E-mail and Password required");
      return;
    }
    setLoading(true);
    try {
      const API_BASE = 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api';
      const res = await fetch(`${API_BASE}/admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const ct = res.headers.get('content-type') || ''
      if (!res.ok) {
        let msg = await res.text()
        try { if (ct.includes('application/json')) msg = JSON.parse(msg).error || JSON.parse(msg) } catch (e) {}
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
      const data = ct.includes('application/json') ? await res.json() : null
      const token = data && data.token
      if (!token) throw new Error('no token in response')
      localStorage.setItem('adminToken', token)
      window.dispatchEvent(new Event('admin-auth-changed'))
      navigate('/')
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 mb-3 w-full border rounded px-3 py-3 text-sm" type="email" />
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 mb-3 w-full border rounded px-3 py-3 text-sm" type="password" />
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-[#444444] text-white py-3 rounded text-sm">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
