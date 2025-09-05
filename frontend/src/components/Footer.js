import React from 'react';
import { Link } from 'react-router-dom';
import { MusicalNoteIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MusicalNoteIcon className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold">MusicStream Pro</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Premium music streaming and download platform. Discover, stream, and download high-quality music with secure UPI payments.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <HeartIcon className="h-4 w-4" />
                <span>Made in India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/music" className="text-gray-400 hover:text-white transition-colors">
                  Browse Music
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Premium Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © 2024 MusicStream Pro. All rights reserved.
          </div>
          <div className="text-sm text-gray-400 mt-2 sm:mt-0">
            Version {process.env.REACT_APP_VERSION || '1.0.0'}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
