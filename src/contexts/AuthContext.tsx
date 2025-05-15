import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { passkeyLogin, passkeySignup } from '../lib/passkey';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithPasskey: () => Promise<void>;
  signupWithPasskey: (name: string, phoneNumber: string) => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('zilt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: '123456',
        name: 'Linda Hart',
        email: email,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        accountNumber: '...0890',
        phoneNumber: '+1234567890'
      };
      setUser(mockUser);
      localStorage.setItem('zilt_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: '123456',
        name: name,
        email: email,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        accountNumber: '...0890',
        phoneNumber: '+1234567890'
      };
      setUser(mockUser);
      localStorage.setItem('zilt_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zilt_user');
  };

  const loginWithPasskey = async () => {
    setIsLoading(true);
    try {
      const result = await passkeyLogin();
      if (!result?.contractId) throw new Error('Login failed');
      
      const user: User = {
        id: result.contractId,
        name: 'Passkey User',
        email: '',
        avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
        accountNumber: '...' + result.contractId.slice(-4),
        phoneNumber: '',
      };
      setUser(user);
      localStorage.setItem('zilt_user', JSON.stringify(user));
    } catch (error) {
      console.error('Passkey login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithPasskey = async (name: string, phoneNumber: string) => {
    setIsLoading(true);
    try {
      const result = await passkeySignup(name);
      if (!result?.contractId) throw new Error('Registration failed');
      
      const user: User = {
        id: result.contractId,
        name,
        email: '',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        accountNumber: '...' + result.contractId.slice(-4),
        phoneNumber,
      };
      setUser(user);
      localStorage.setItem('zilt_user', JSON.stringify(user));
    } catch (error) {
      console.error('Passkey registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginWithPasskey,
        signupWithPasskey,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}