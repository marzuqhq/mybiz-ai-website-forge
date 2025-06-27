
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/components/dashboard/Dashboard';
import LandingPage from '@/components/landing/LandingPage';

const Index = () => {
  const { user } = useAuth();

  return user ? <Dashboard /> : <LandingPage />;
};

export default Index;
