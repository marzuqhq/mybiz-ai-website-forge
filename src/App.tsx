import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import EnhancedLiveChat from "@/components/chat/EnhancedLiveChat";
import PublicWebsiteRouter from "@/components/public/PublicWebsiteRouter";
import Index from "./pages/Index";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import CreateWebsiteForm from "./components/website/CreateWebsiteForm";
import WebsiteEditor from "./pages/WebsiteEditor";
import CMSManager from "./pages/CMSManager";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Guest/Marketing Pages
import Features from "./pages/guest/Features";
import HowItWorks from "./pages/guest/HowItWorks";
import Pricing from "./pages/guest/Pricing";
import Templates from "./pages/guest/Templates";
import API from "./pages/guest/API";
import About from "./pages/guest/About";
import Blog from "./pages/guest/Blog";
import Careers from "./pages/guest/Careers";
import Contact from "./pages/guest/Contact";
import PressKit from "./pages/guest/PressKit";
import Documentation from "./pages/guest/Documentation";
import HelpCenter from "./pages/guest/HelpCenter";
import Community from "./pages/guest/Community";
import Status from "./pages/guest/Status";
import Changelog from "./pages/guest/Changelog";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiePolicy from "./pages/legal/CookiePolicy";
import GDPR from "./pages/legal/GDPR";
import Security from "./pages/legal/Security";
import BusinessTools from "./pages/BusinessTools";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public website routes - these come FIRST for priority */}
              <Route path="/:slug" element={<PublicWebsiteRouter />} />
              <Route path="/:slug/:pageSlug" element={<PublicWebsiteRouter />} />
              
              {/* App routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <Index />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Header />
                  <LoginForm />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Header />
                  <RegisterForm />
                </>
              } />
              <Route path="/create" element={
                <>
                  <Header />
                  <CreateWebsiteForm />
                </>
              } />
              <Route path="/website/:websiteId" element={
                <>
                  <Header />
                  <WebsiteEditor />
                </>
              } />
              <Route path="/website/:websiteId/cms" element={
                <>
                  <Header />
                  <CMSManager />
                </>
              } />
              <Route path="/admin" element={
                <>
                  <Header />
                  <AdminDashboard />
                </>
              } />
              <Route path="/tools" element={
                <>
                  <Header />
                  <BusinessTools />
                </>
              } />
              
              {/* Product Pages */}
              <Route path="/features" element={
                <>
                  <Header />
                  <Features />
                </>
              } />
              <Route path="/how-it-works" element={
                <>
                  <Header />
                  <HowItWorks />
                </>
              } />
              <Route path="/pricing" element={
                <>
                  <Header />
                  <Pricing />
                </>
              } />
              <Route path="/templates" element={
                <>
                  <Header />
                  <Templates />
                </>
              } />
              <Route path="/api" element={
                <>
                  <Header />
                  <API />
                </>
              } />
              
              {/* Company Pages */}
              <Route path="/about" element={
                <>
                  <Header />
                  <About />
                </>
              } />
              <Route path="/blog" element={
                <>
                  <Header />
                  <Blog />
                </>
              } />
              <Route path="/careers" element={
                <>
                  <Header />
                  <Careers />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <Contact />
                </>
              } />
              <Route path="/press-kit" element={
                <>
                  <Header />
                  <PressKit />
                </>
              } />
              
              {/* Resources Pages */}
              <Route path="/documentation" element={
                <>
                  <Header />
                  <Documentation />
                </>
              } />
              <Route path="/help-center" element={
                <>
                  <Header />
                  <HelpCenter />
                </>
              } />
              <Route path="/community" element={
                <>
                  <Header />
                  <Community />
                </>
              } />
              <Route path="/status" element={
                <>
                  <Header />
                  <Status />
                </>
              } />
              <Route path="/changelog" element={
                <>
                  <Header />
                  <Changelog />
                </>
              } />
              
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={
                <>
                  <Header />
                  <PrivacyPolicy />
                </>
              } />
              <Route path="/terms-of-service" element={
                <>
                  <Header />
                  <TermsOfService />
                </>
              } />
              <Route path="/cookie-policy" element={
                <>
                  <Header />
                  <CookiePolicy />
                </>
              } />
              <Route path="/gdpr" element={
                <>
                  <Header />
                  <GDPR />
                </>
              } />
              <Route path="/security" element={
                <>
                  <Header />
                  <Security />  
                </>
              } />
              
              {/* Catch-all route MUST be last */}
              <Route path="*" element={
                <>
                  <Header />
                  <NotFound />
                </>
              } />
            </Routes>
            
            {/* AI-Powered Live Chat with Enhanced Features */}
            <EnhancedLiveChat />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
