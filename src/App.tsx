
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import LiveChat from "@/components/chat/LiveChat";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/create" element={<CreateWebsiteForm />} />
              <Route path="/website/:websiteId" element={<WebsiteEditor />} />
              <Route path="/website/:websiteId/cms" element={<CMSManager />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Product Pages */}
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/api" element={<API />} />
              
              {/* Company Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/press-kit" element={<PressKit />} />
              
              {/* Resources Pages */}
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/community" element={<Community />} />
              <Route path="/status" element={<Status />} />
              <Route path="/changelog" element={<Changelog />} />
              
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/gdpr" element={<GDPR />} />
              <Route path="/security" element={<Security />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* AI-Powered Live Chat */}
            <LiveChat />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
