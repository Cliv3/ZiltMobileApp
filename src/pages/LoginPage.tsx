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
  const { login, loginWithPasskey, signupWithPasskey, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [pendingPasskeyUser, setPendingPasskeyUser] = useState<any>(null);
  
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
  
  // Handle passkey registration
  const handlePasskeyRegister = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signupWithPasskey();
      setPendingPasskeyUser(result);
      setShowPasskeyModal(true);
    } catch (err) {
      setError('Passkey registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle modal submit
  const handlePasskeyModalSubmit = ({ username, phoneNumber }: { username: string; phoneNumber: string }) => {
    if (!pendingPasskeyUser) return;
    setName(username);
    setPhoneNumber(phoneNumber);
    const user = {
      id: pendingPasskeyUser.contractId,
      name: username,
      email: '',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      accountNumber: '...' + pendingPasskeyUser.contractId.slice(-4),
      phoneNumber,
    };
    localStorage.setItem('zilt_user', JSON.stringify(user));
    setUser(user);
    navigate('/');
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
          <p className="text-gray-600 mt-2">Modern finance for a digital world</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              leadingIcon={<LogIn className="w-5 h-5" />}
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
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
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}