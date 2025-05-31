import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Axios } from '../axiosinstance'; // Use correct casing for import


// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { data } = await Axios.post('/auth/login', { email, password });
  
      if(data) {
        setUser(data.user);
        // Store both user and token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      setIsLoading(false);
    }
  }, []);
  const register = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { data } = await Axios.post('/auth/register', { email, password });
      console.log('Register response:', data);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Also store the token
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await Axios.post('/auth/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        // Set initial state from localStorage for faster rendering
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // also verify with the backend and get fresh data
        const { data } = await Axios.get('/users/me');
        if (data.success && data.user) {
          // upd with fresh user data from the server
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};