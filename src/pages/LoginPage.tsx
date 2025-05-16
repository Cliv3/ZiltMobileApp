import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ZiltLogo from '../components/common/ZiltLogo';
import Button from '../components/common/Button';
import PasskeySignupModal from '../components/auth/PasskeySignupModal';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithPasskey, signupWithPasskey } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyRegister = () => {
    setError('');
    setShowPasskeyModal(true);
  };

  const handlePasskeyModalSubmit = async ({ username, phoneNumber }: { username: string; phoneNumber: string }) => {
    setIsLoading(true);
    try {
      await signupWithPasskey(username, phoneNumber);
      navigate('/');
    } catch (err) {
      setError('Passkey registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      setShowPasskeyModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gray-50">
      <PasskeySignupModal
        open={showPasskeyModal}
        onSubmit={handlePasskeyModalSubmit}
        onClose={() => setShowPasskeyModal(false)}
      />
      <motion.div 
        className="max-w-md w-full mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-10">
          <ZiltLogo size="large" />
          <p className="text-gray-600 mt-2">Digital Dollars for everyone</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
          
            
            
  
          </form>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              leadingIcon={<LogIn className="w-5 h-5" />}
              onClick={async () => {
                setError('');
                setIsLoading(true);
                try {
                  await loginWithPasskey();
                  navigate('/');
                } catch (err) {
                  setError('Passkey login failed. Please try again.');
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Sign in with Passkey
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              isLoading={isLoading}
              leadingIcon={<UserPlus className="w-5 h-5" />}
              onClick={handlePasskeyRegister}
              className="mt-2"
            >
              Register with Passkey
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Please read our {' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}