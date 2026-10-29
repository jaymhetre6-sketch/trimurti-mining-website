import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAuth, isLiveSupabase } from '../../lib/supabase';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    adminAuth.getSession().then((session) => {
      if (session.authenticated) {
        navigate('/admin');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await adminAuth.signIn(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your administrator email address first.');
      return;
    }
    setLoading(true);
    setError(null);
    const res = await adminAuth.resetPassword(email);
    if (res.success) {
      setResetSent(true);
    } else {
      setError(res.error || 'Failed to dispatch password recovery link.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F5F5F2] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background industrial grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF6B18]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to site link */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#B9C0C9] hover:text-[#FF6B18] transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Public Website
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#171A20] border border-white/10 p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Header */}
        <div className="space-y-4 text-center mb-8">
          <div className="flex justify-center">
            <BrandLogo isAdmin={true} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F2]">
              Administrator Authentication
            </h1>
            <p className="text-xs text-[#7A838E] mt-1">
              Protected operations management portal
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 mb-6 bg-white/[0.02] border border-white/[0.08] text-[11px] text-[#7A838E] leading-relaxed">
          <span className="font-bold text-[#FF6B18] block uppercase tracking-wider mb-0.5">
            Restricted Authorization
          </span>
          Authorized Trimurti personnel only. There is no public registration. Every login attempt is audited with IP and timestamp verification.
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-6 bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Reset Confirmation */}
        {resetSent && (
          <div className="p-3 mb-6 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
            <span>Password reset instructions have been dispatched to your email address.</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A838E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trimurti.com"
                className="w-full bg-[#111318] border border-white/10 pl-10 pr-4 py-3 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] text-[#FF6B18] hover:underline uppercase tracking-wider font-semibold"
              >
                Reset Password
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A838E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111318] border border-white/10 pl-10 pr-4 py-3 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs tracking-wider justify-center"
          >
            {loading ? (
              'Verifying Credentials…'
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Demo Mode Notice */}
        {!isLiveSupabase && (
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center space-y-1">
            <span className="text-[10px] text-[#FF6B18] uppercase tracking-wider font-bold block">
              Demo Test Credentials
            </span>
            <p className="text-[11px] text-[#7A838E]">
              Email: <code className="text-[#F5F5F2] bg-white/[0.05] px-1 py-0.5 font-mono">admin@trimurti.com</code>
            </p>
            <p className="text-[11px] text-[#7A838E]">
              Password: <code className="text-[#F5F5F2] bg-white/[0.05] px-1 py-0.5 font-mono">Trimurti@2026</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
