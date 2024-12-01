import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 pt-16 pb-12">
        {/* Top Section with Logo and Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-12">
          <div className="max-w-sm">
            <Link to="/" className="text-3xl font-bold tracking-tight text-white hover:text-emerald-200 inline-flex items-center">
              RemoHive
            </Link>
            <p className="mt-4 text-emerald-100/80 text-sm leading-relaxed">
              Connecting remote talent with global opportunities. Find your next remote role or hire exceptional remote professionals.
            </p>
          </div>
          
        </div>

        {/* Main Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-emerald-100/80 hover:text-white transition-colors inline-flex items-center text-sm">Home</Link></li>
              <li><Link to="/jobs" className="text-emerald-100/80 hover:text-white transition-colors inline-flex items-center text-sm">Find Jobs <ArrowUpRight className="ml-1 h-3 w-3" /></Link></li>
              <li><Link to="/companies" className="text-emerald-100/80 hover:text-white transition-colors inline-flex items-center text-sm">Companies</Link></li>
              <li><Link to="/resources" className="text-emerald-100/80 hover:text-white transition-colors inline-flex items-center text-sm">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-emerald-100/80 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/careers" className="text-emerald-100/80 hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link to="/blog" className="text-emerald-100/80 hover:text-white transition-colors text-sm">Blog</Link></li>
              
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-emerald-100/80 hover:text-white transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/privacy" className="text-emerald-100/80 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-emerald-100/80 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><a href="mailto:contact@remohive.com" className="text-emerald-100/80 hover:text-white transition-colors inline-flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4" /> Contact Us
              </a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-emerald-800/50 hover:bg-emerald-800 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-emerald-800/50 hover:bg-emerald-800 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-emerald-800/50 hover:bg-emerald-800 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-600/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-emerald-100/60">
              © {new Date().getFullYear()} RemoHive. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/accessibility" className="text-sm text-emerald-100/60 hover:text-white transition-colors">
                Accessibility
              </Link>
              <Link to="/sitemap" className="text-sm text-emerald-100/60 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link to="/cookies" className="text-sm text-emerald-100/60 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
