
import React, { useState } from 'react';
import { User, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      /*
       * Supabase Auth uses email + password.
       *
       * The existing "Username" field is therefore used
       * for the user's Supabase email address.
       */
      const email = username.trim();

      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        console.error('Supabase login error:', loginError);

        setError('Invalid email or password.');
        return;
      }

      /*
       * Supabase successfully authenticated the user.
       *
       * data.session contains the authenticated session.
       * Supabase automatically persists this session in the browser.
       */
      if (!data.session || !data.user) {
        setError('Authentication failed. Please try again.');
        return;
      }

      /*
       * Login successful.
       * The parent component can now open the admin portal.
       */
      onLoginSuccess();
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white font-bold text-xl">
            C
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              CoreHR Admin
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise Console Sign In
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider"
            >
              Email
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User size={16} />
              </span>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@example.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider"
            >
              Password
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </span>

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="text-red-400 text-xs bg-red-950/40 border border-red-900/50 p-2.5 rounded-lg"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In to Console'
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500 mt-4">
            Sign in using your authorized administrator account.
          </p>

        </form>
      </div>
    </div>
  );
}

