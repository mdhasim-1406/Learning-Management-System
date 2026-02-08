import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';
import Button from '../components/ui-next/Button';
import Input from '../components/ui-next/Input';
import CursorGlow from '../components/CursorGlow';
import ParticleField from '../components/ParticleField';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await loginApi(email, password);
      login(data, data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-stone-50 font-sans">

      {/* Left Panel: Visual & Brand */}
      <div className="relative hidden lg:flex flex-col justify-center items-center bg-emerald-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 z-0"></div>
        <CursorGlow />
        <ParticleField />

        {/* Content */}
        <div className="relative z-10 p-12 text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-2xl shadow-[0_0_40px_rgba(52,211,153,0.3)] flex items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-500"
          >
            <span className="text-4xl font-bold text-white">L</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Master New Skills <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              Build Your Future
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg text-emerald-100/80 leading-relaxed"
          >
            Access world-class courses, expert mentors, and hands-on projects.
            Join our community of lifelong learners today.
          </motion.p>

          {/* Decorative stats or badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 flex items-center justify-center gap-6"
          >
            <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-100 text-sm font-medium">
              10k+ Learners
            </div>
            <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-100 text-sm font-medium">
              500+ Courses
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="relative flex flex-col justify-center items-center p-6 lg:p-12 bg-stone-50">

        {/* Mobile Header (visible only on small screens) */}
        <div className="lg:hidden w-full max-w-md mb-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Welcome Back</h1>
        </div>

        <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl shadow-luxury border border-white/60 relative overflow-hidden">
          {/* Ambient light for form */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Sign In</h2>
            <p className="mt-2 text-stone-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 animate-pulse-soft">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 ml-1">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  variant="bordered"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-sm font-semibold text-stone-700">Password</label>
                  <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline">Forgot password?</a>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  variant="bordered"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="luxury"
                className="w-full py-6 text-base shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 backdrop-blur text-stone-400 font-medium">Quick Demo Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Super Admin', role: 'superadmin', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' },
              { label: 'Admin', role: 'admin', color: 'bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100' },
              { label: 'Trainer', role: 'trainer', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' },
              { label: 'Learner', role: 'learner', color: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' }
            ].map((btn) => (
              <button
                key={btn.role}
                onClick={() => {
                  const emailMap = {
                    superadmin: 'superadmin@company.com',
                    admin: 'admin@company.com',
                    trainer: 'john.trainer@company.com',
                    learner: 'alex.learner@company.com'
                  };
                  handleDemoLogin(emailMap[btn.role], 'password123');
                }}
                className={cn(
                  "text-xs py-2.5 px-3 rounded-xl border transition-all duration-200 font-semibold shadow-sm hover:shadow",
                  btn.color
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <p className="text-center text-stone-400 text-xs mt-8 font-medium">
            By signing in, you agree to our <a href="#" className="underline hover:text-stone-600">Terms</a> and <a href="#" className="underline hover:text-stone-600">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
