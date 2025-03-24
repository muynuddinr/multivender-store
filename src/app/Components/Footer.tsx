"use client"

import React from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Newsletter form handling
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter subscription logic here
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">MULTI-STORE</h3>
            <p className="mb-4 text-sm">
              Your one-stop marketplace for all your shopping needs. 
              We connect customers with sellers and resellers across 
              multiple categories.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaPinterest size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/men" className="text-gray-400 hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/women" className="text-gray-400 hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/kids" className="text-gray-400 hover:text-white transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-gray-400 hover:text-white transition-colors">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Your Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/customer-login" className="text-gray-400 hover:text-white transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/seller-login" className="text-gray-400 hover:text-white transition-colors">
                  Seller Portal
                </Link>
              </li>
              <li>
                <Link href="/reseller-login" className="text-gray-400 hover:text-white transition-colors">
                  Reseller Portal
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter and Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Stay Updated</h3>
            <p className="mb-4 text-sm">Subscribe to our newsletter for the latest updates and offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 w-full text-gray-900 bg-gray-100 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Subscribe
                </button>
              </div>
            </form>
            
            <h3 className="text-white text-lg font-bold mb-3">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Commerce Street, Business District, City, 123456</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2 flex-shrink-0" />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2 flex-shrink-0" />
                <span>support@multi-store.com</span>
              </li>
              <li className="flex items-center">
                <FiClock className="mr-2 flex-shrink-0" />
                <span>Mon-Fri: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Sub Footer */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-center md:text-left">
              <p>&copy; {currentYear} MULTI-STORE. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-400 hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
