
import React, { createContext, useContext, useState, useEffect } from 'react';
import sdk, { User, Session } from '@/lib/sdk';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const { toast } = useToast();

  const isAuthenticated = Boolean(user && session && sessionToken);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        // SDK will handle its own initialization
        setIsLoading(false);
        console.log('✅ Auth initialization complete');
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('🔐 Logging in user:', email);
      
      const result = await sdk.login(email, password);
      
      if (typeof result === 'string') {
        // Direct login success - result is the token
        const token = result;
        const sessionData = sdk.getSession(token);
        
        if (sessionData) {
          setSession(sessionData);
          setUser(sessionData.user);
          setSessionToken(token);
          
          console.log('✅ Login successful, user authenticated');
          toast({
            title: "Welcome back!",
            description: `Signed in as ${sessionData.user.email}`,
          });
        } else {
          throw new Error('Failed to create session');
        }
      } else if (result.otpRequired) {
        // OTP required - this will be handled by the login form
        console.log('📧 OTP required for login');
        toast({
          title: "Verification required",
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error);
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
      console.log('📝 Registering user:', email);
      
      // Add default profile data
      const enrichedProfile = {
        ...profile,
        plan: 'free',
        roles: ['user'],
        permissions: ['read', 'write'],
        verified: true,
        authMethod: 'email',
      };
      
      await sdk.register(email, password, enrichedProfile);
      console.log('✅ Registration successful, attempting auto-login');
      
      // Auto-login after successful registration
      await login(email, password);
      
      toast({
        title: "Welcome to MyBiz AI!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
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
      console.log('🔐 Verifying OTP for:', email);
      
      const token = await sdk.verifyLoginOTP(email, otp);
      const sessionData = sdk.getSession(token);
      
      if (sessionData) {
        setSession(sessionData);
        setUser(sessionData.user);
        setSessionToken(token);
        
        console.log('✅ OTP verification successful');
        toast({
          title: "Verification successful",
          description: "Welcome to MyBiz AI!",
        });
      } else {
        throw new Error('Failed to create session after OTP verification');
      }
    } catch (error: any) {
      console.error('❌ OTP verification failed:', error);
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
      console.log('🚪 Logging out user');
      
      if (sessionToken) {
        sdk.destroySession(sessionToken);
      }
      
      setUser(null);
      setSession(null);
      setSessionToken(null);
      
      console.log('✅ Logout successful');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      // Still clear local state even if there's an error
      setUser(null);
      setSession(null);
      setSessionToken(null);
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
    if (sessionToken) {
      const sessionData = sdk.getSession(sessionToken);
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
    isAuthenticated,
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
