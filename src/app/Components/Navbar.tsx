"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiShoppingBag, FiPackage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Handle scroll effect for navbar - optimized with useCallback
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Navigate to search results page
    setIsSearchOpenMobile(false);
  }, [searchQuery]);

  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);

  // Animation variants for consistent animations
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white/90 backdrop-blur-md'
    }`}
    aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-serif tracking-wider text-gray-900 hover:text-black transition-colors duration-200 flex items-center">
              <span className="text-3xl font-bold">lovosis</span>
            </Link>
          </div>

          {/* Main navigation - desktop */}
          <div className="hidden md:flex space-x-10">
            {NAVIGATION_ITEMS.map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className={`text-gray-700 hover:text-black group relative uppercase text-sm tracking-wider font-medium ${
                  pathname === `/${item.toLowerCase()}` ? 'text-black' : ''
                }`}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                  pathname === `/${item.toLowerCase()}` ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Search bar - desktop */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full py-2.5 pl-4 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-2.5 text-gray-400 group-hover:text-black transition-colors duration-200"
                aria-label="Submit search"
              >
                <FiSearch className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-8">
            {/* Search icon - mobile only */}
            <button 
              className="md:hidden text-gray-700 hover:text-black transition-colors duration-200"
              onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
              aria-label="Toggle search"
              aria-expanded={isSearchOpenMobile}
            >
              <FiSearch className="h-5 w-5" />
            </button>
            
            {/* Cart icon */}
            <Link 
              href="/cart" 
              className="relative text-gray-700 hover:text-black transition-colors duration-200 group"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <FiShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-black group-hover:bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-colors duration-200"
                  aria-hidden="true"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>
            
            {/* User dropdown */}
            <div className="relative dropdown-container">
              <button 
                className="text-gray-700 hover:text-black transition-colors duration-200"
                onClick={() => toggleDropdown("user")}
                aria-label="User menu"
                aria-expanded={openDropdown === "user"}
                aria-haspopup="true"
              >
                <FiUser className="h-5 w-5" />
              </button>
              
              <AnimatePresence>
                {openDropdown === "user" && (
                  <motion.div 
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-lg border border-gray-100 py-2 z-50 overflow-hidden"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">My Account</p>
                    </div>
                    {USER_MENU_ITEMS.map((item, index) => (
                      <Link 
                        key={index}
                        href={item.href} 
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                        role="menuitem"
                      >
                        <div className={`${item.colorClass} mr-3`}>
                          <span className={`flex h-9 w-9 rounded-full ${item.bgColorClass} items-center justify-center`}>
                            <item.icon className="h-4 w-4" />
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors duration-200" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6 text-gray-700" />
              ) : (
                <FiMenu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
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
