import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const { isAuthenticated } = useAuth();
    useEffect(() => {
    document.title = 'Create Account - UglyTruth';
  }, []);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="">
      <RegisterForm />
    </div>
  );
};

export default SignUp;