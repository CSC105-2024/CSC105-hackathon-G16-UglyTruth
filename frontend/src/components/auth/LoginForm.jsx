import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '/UglyTruthLogo.svg';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error is handled by the context
    }
  };
  
  return (
    <div className="w-screen h-screen bg-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="text-6xl font-serif text-cream mb-4">
            <img src={Logo} alt="Ugly Truth Logo" className="w-24 h-24 mx-auto" />
          </div>
          <p className="text-6xl font-pica text-cream">
            Ugly Truth
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-sage rounded-[25px] p-8 shadow-xl">
          <p className="text-4xl font-pica text-cream text-center mb-8">
            Log In
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-2 border-slate-400 rounded-lg px-4 py-3 pr-12 text-cream placeholder-slate-300 focus:border-cream focus:outline-none transition-colors"
                  required
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-cream w-5 h-5" />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-2 border-slate-400 rounded-lg px-4 py-3 pr-12 text-cream placeholder-slate-300 focus:border-cream focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-cream transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Error Message (if any) */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <AlertCircle className="inline-block mr-2 mb-1 w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-lg bg-cream text-midnight font-nunito font-bold py-3 rounded-lg hover:bg-[#FFF5D9] hover:shadow-lg transition-colors mt-8"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-slate-300">Don't have an account? </span>
            <Link to="/signup">
              <span className="text-cream hover:text-[#FFF5D9] hover:shadow-lg transition-colors underline cursor-pointer">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;