
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Plus, Home, Brain, BarChart3, Users, ChevronDown, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const productMenuItems = [
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Templates', href: '/templates' },
    { name: 'API', href: '/api' }
  ];

  const companyMenuItems = [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Press Kit', href: '/press-kit' }
  ];

  const resourceMenuItems = [
    { name: 'Documentation', href: '/documentation' },
    { name: 'Help Center', href: '/help-center' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' },
    { name: 'Changelog', href: '/changelog' }
  ];

  const legalMenuItems = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Security', href: '/security' }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">mybiz AI</span>
            <span className="text-xs text-slate-500 -mt-1">AI Website Builder</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {!user && (
            <>
              {/* Product Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                    Product
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white shadow-lg border border-slate-200">
                  {productMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="cursor-pointer">{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Company Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                    Company
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white shadow-lg border border-slate-200">
                  {companyMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="cursor-pointer">{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Resources Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                    Resources
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white shadow-lg border border-slate-200">
                  {resourceMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="cursor-pointer">{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {user && (
            <>
              <Link to="/">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-indigo-50 hover:text-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Website
                </Button>
              </Link>
              {user.roles?.includes('admin') && (
                <Link to="/admin">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-purple-50 hover:text-purple-700">
                    <Users className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* User Menu / Auth Buttons */}
        {user ? (
          <div className="hidden lg:flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-indigo-200">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-lg border border-slate-200" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">{user.email}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                      {user.plan || 'Free'}
                    </span>
                    {user.roles?.includes('admin') && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                Get Started Free
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {!user ? (
              <>
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">Product</p>
                  {productMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 text-slate-600 hover:text-slate-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">Company</p>
                  {companyMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 text-slate-600 hover:text-slate-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">Resources</p>
                  {resourceMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 text-slate-600 hover:text-slate-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/create" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Website
                  </Button>
                </Link>
                {user.roles?.includes('admin') && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="pt-4 border-t border-slate-200">
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
