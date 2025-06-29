
import React, { createContext, useContext, useState, useEffect } from 'react';
import sdk, { User, Session } from '@/lib/sdk';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profile?: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingLogin, setPendingLogin] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          console.log('Found existing auth token, validating session');
          const sessionData = sdk.getSession(token);
          if (sessionData) {
            setSession(sessionData);
            setUser(sessionData.user);
            console.log('Session restored successfully');
          } else {
            console.log('Invalid session token, removing');
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const result = await sdk.login(email, password);
      
      if (typeof result === 'string') {
        // Direct login success
        console.log('Login successful, storing token');
        localStorage.setItem('auth_token', result);
        const sessionData = sdk.getSession(result);
        if (sessionData) {
          setSession(sessionData);
          setUser(sessionData.user);
          console.log('User session established');
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      } else if (result.otpRequired) {
        // OTP required
        console.log('OTP required for login');
        setPendingLogin(email);
        toast({
          title: "Verification required",
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please check your email and password.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, profile: any = {}) => {
    try {
      setIsLoading(true);
      console.log('Attempting registration for:', email);
      
      const result = await sdk.register(email, password, profile);
      console.log('Registration successful');
      
      // Since email verification is disabled, log in directly
      const loginResult = await sdk.login(email, password);
      
      if (typeof loginResult === 'string') {
        localStorage.setItem('auth_token', loginResult);
        const sessionData = sdk.getSession(loginResult);
        if (sessionData) {
          setSession(sessionData);
          setUser(sessionData.user);
          toast({
            title: "Welcome to MyBiz AI!",
            description: "Your account has been created successfully.",
          });
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      const token = await sdk.verifyLoginOTP(email, otp);
      localStorage.setItem('auth_token', token);
      const sessionData = sdk.getSession(token);
      if (sessionData) {
        setSession(sessionData);
        setUser(sessionData.user);
        setPendingLogin(null);
        toast({
          title: "Verification successful",
          description: "Welcome to MyBiz AI!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        sdk.destroySession(token);
        localStorage.removeItem('auth_token');
      }
      setUser(null);
      setSession(null);
      setPendingLogin(null);
      console.log('Logout successful');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      await sdk.requestPasswordReset(email);
      toast({
        title: "Reset code sent",
        description: "Check your email for the password reset code.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send reset code",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await sdk.resetPassword(email, otp, newPassword);
      toast({
        title: "Password reset",
        description: "Your password has been successfully reset.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const sessionData = sdk.getSession(token);
      if (sessionData) {
        setSession(sessionData);
        setUser(sessionData.user);
      }
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    register,
    logout,
    verifyOTP,
    requestPasswordReset,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
