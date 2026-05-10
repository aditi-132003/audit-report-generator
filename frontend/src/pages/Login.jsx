import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Sparkles, User, Lock, ArrowRight, RefreshCw } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Credentials required to access secure zone.');
      return;
    }

    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Access Denied: Invalid credentials provided.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-[440px] animate-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 premium-gradient rounded-2xl shadow-xl shadow-blue-200 mb-6">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">TOOL‑24</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-2 py-0.5 rounded">Audit Report OS</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enterprise V2.4</span>
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8 md:p-10 border-white shadow-2xl shadow-slate-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Identity Profile</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-700 shadow-sm"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Security Token</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-700 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full premium-gradient text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Authenticating Session
                  </>
                ) : (
                  <>
                    Initialize Connection
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tight">End-to-End Encrypted</span>
            </div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">
              Relanto Systems • 2026
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          Development Mode: Any credentials will permit access.
        </p>
      </div>
    </div>
  );
}
