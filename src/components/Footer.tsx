import React from 'react';
import { BookOpen, Mail, Phone, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold">Daring Achievers Network</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering individuals to achieve greatness through transformative books 
              and life-changing insights from Mwatha Njoroge.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:mwathanjoroge@gmail.com" className="text-gray-300 hover:text-yellow-500 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+254786780780" className="text-gray-300 hover:text-yellow-500 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="https://wa.me/254717003322" className="text-gray-300 hover:text-yellow-500 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-yellow-500 transition-colors">Home</a></li>
              <li><a href="/books" className="text-gray-300 hover:text-yellow-500 transition-colors">Books</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-yellow-500 transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-yellow-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>mwathanjoroge@gmail.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+254 786 780 780</span>
              </p>
              <p className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>+254 717 003 322</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Daring Achievers Network. All rights reserved.</p>
          <p className="mt-2">Empowering greatness, one book at a time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;