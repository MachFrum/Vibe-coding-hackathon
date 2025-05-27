import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BarChart2 } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const { login, register, loading, error } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password, name);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 p-3 rounded-xl">
              <BarChart2 size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">AscendFlow</h1>
          <p className="text-gray-600">Business management simplified</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex border border-gray-200 rounded-lg mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center rounded-l-lg transition-colors ${
                isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-center rounded-r-lg transition-colors ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name\" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center text-gray-600 text-sm">
          &copy; 2025 AscendFlow. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;