import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
    useEffect(() => {
    document.title = 'Sign In - UglyTruth';
  }, []);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="">
      <LoginForm />
    </div>
  );
};

export default Login;