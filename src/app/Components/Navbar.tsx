"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiShoppingBag, FiPackage, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

// Constants for menu items to avoid repetition
const NAVIGATION_ITEMS = ['Men', 'Women', 'Kids', 'Sale'];

// Custom types for dropdown items
type UserMenuItemType = {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  colorClass: string;
  bgColorClass: string;
};

const USER_MENU_ITEMS: UserMenuItemType[] = [
  { 
    href: "/customer-login", 
    icon: FiUser, 
    title: "Customer Login", 
    desc: "Shop and manage your orders", 
    colorClass: "text-blue-500", 
    bgColorClass: "bg-blue-100" 
  },
  { 
    href: "/seller-login", 
    icon: FiShoppingBag, 
    title: "Seller Portal", 
    desc: "Manage your store", 
    colorClass: "text-green-500", 
    bgColorClass: "bg-green-100" 
  },
  { 
    href: "/reseller-login", 
    icon: FiPackage, 
    title: "Reseller Portal", 
    desc: "Access wholesale options", 
    colorClass: "text-purple-500", 
    bgColorClass: "bg-purple-100" 
  }
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3); // Example cart count
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setIsSearchOpenMobile(false);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    await logout();
    // You could also add router.push('/') here if you want to redirect
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-black">
              MULTI-STORE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className={`text-sm font-medium hover:text-black transition-colors duration-200 ${
                  pathname === `/${item.toLowerCase()}` 
                    ? 'text-black border-b-2 border-black pb-1' 
                    : 'text-gray-600'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right section: Search, User, Cart */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-32 lg:w-48 py-1.5 pl-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <FiSearch className="h-4 w-4" />
                </button>
              </form>
            </div>
            
            {/* Mobile Search Icon */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
              aria-label="Toggle search"
            >
              {isSearchOpenMobile ? <FiX className="h-5 w-5" /> : <FiSearch className="h-5 w-5" />}
            </button>

            {/* User Profile or Login */}
            <div className="relative">
              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <div className="relative inline-block">
                  <button 
                    onClick={() => toggleDropdown('user')}
                    className="flex items-center focus:outline-none"
                    aria-label="User profile"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                      {user.profileImage ? (
                        <Image 
                          src={user.profileImage} 
                          alt={user.name} 
                          width={32} 
                          height={32}
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-700 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                  {openDropdown === 'user' && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative inline-block">
                  <button 
                    onClick={() => toggleDropdown('auth')}
                    className="text-gray-700 focus:outline-none"
                    aria-label="Account options"
                  >
                    <FiUser className="h-6 w-6" />
                  </button>
                  {openDropdown === 'auth' && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                      {USER_MENU_ITEMS.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className={`${item.bgColorClass} p-2 rounded-full mr-3`}>
                            <item.icon className={`h-5 w-5 ${item.colorClass}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <Link href="/cart" className="text-gray-700 relative">
                <FiShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search input */}
      <AnimatePresence>
        {isSearchOpenMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-4 py-3 border-t border-gray-100 bg-white"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full py-2.5 pl-4 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-3 top-2.5 text-gray-400"
                aria-label="Submit search"
              >
                <FiSearch className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 bg-white shadow-lg"
          >
            <div className="px-6 py-4 space-y-3">
              {NAVIGATION_ITEMS.map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`} 
                  className={`block py-2.5 text-gray-800 font-medium border-b border-gray-100 hover:text-black transition-colors duration-200 ${
                    pathname === `/${item.toLowerCase()}` ? 'text-black font-semibold' : ''
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
