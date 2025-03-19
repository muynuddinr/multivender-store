'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiPackage, 
  FiGrid, 
  FiBox, 
  FiMail, 
  FiMessageCircle, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const menuItems = [
  { icon: FiHome, label: 'Dashboard', href: '/admin' },
  { icon: FiUsers, label: 'Customers', href: '/admin/customers' },
  { icon: FiShoppingBag, label: 'Sellers', href: '/admin/sellers' },
  { icon: FiPackage, label: 'Resellers', href: '/admin/resellers' },
  { icon: FiGrid, label: 'Categories', href: '/admin/categories' },
  { icon: FiBox, label: 'Products', href: '/admin/products' },
  { icon: FiMail, label: 'Newsletter', href: '/admin/newsletter' },
  { icon: FiMessageCircle, label: 'Contact', href: '/admin/contact' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-700"
        >
          {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className={`bg-white shadow-md w-64 hidden lg:block flex-shrink-0`}>
        {renderSidebarContent()}
      </div>

      {/* Mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50">
            {renderSidebarContent()}
          </div>
        </div>
      )}
    </>
  );

  function renderSidebarContent() {
    return (
      <div className="h-full flex flex-col">
        {/* Admin Header */}
        <div className="p-4 border-b flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-800">Admin Panel</div>
            <div className="text-xs text-gray-500 truncate">
              admin@example.com
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 px-2 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin Footer - Logout */}
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Back to Site
          </button>
        </div>
      </div>
    );
  }
} 