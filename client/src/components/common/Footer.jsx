import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 pb-8 pt-12 mt-auto border-t border-gray-200 mt-4">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-16">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">KingKong</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              KingKong is a state-of-the-art AI platform designed to transform your workflows and automate tasks using natural language.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/playground" className="text-gray-600 hover:text-blue-600 transition-colors">Playground</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">&copy; {new Date().getFullYear()} KingKong. All rights reserved.</p>
          <div className="flex space-x-6 text-gray-500">
            <a href="#" aria-label="Twitter" className="hover:text-gray-700 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm6-6h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-gray-700 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 18h-2v-6h2v6zm0-8h-2v-2h2v2z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;