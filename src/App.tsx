
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import WebsiteEditor from '@/pages/WebsiteEditor';
import CMSManager from '@/pages/CMSManager';
import PublicWebsiteView from '@/components/public/PublicWebsiteView';
import PublicBlogArchive from '@/components/public/PublicBlogArchive';
import PublicBlogPost from '@/components/public/PublicBlogPost';
import PublicFormPage from '@/components/public/PublicFormPage';
import EnhancedCreateWebsiteForm from '@/components/website/EnhancedCreateWebsiteForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-website" element={<EnhancedCreateWebsiteForm />} />
            <Route path="/website/:websiteId" element={<WebsiteEditor />} />
            <Route path="/cms/:websiteId" element={<CMSManager />} />
            
            {/* Public Website Routes */}
            <Route path="/:websiteSlug" element={<PublicWebsiteView />} />
            <Route path="/:websiteSlug/:pageSlug" element={<PublicWebsiteView />} />
            <Route path="/:websiteSlug/blog" element={<PublicBlogArchive />} />
            <Route path="/:websiteSlug/blog/:postSlug" element={<PublicBlogPost />} />
            <Route path="/:websiteSlug/form/:formSlug" element={<PublicFormPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
