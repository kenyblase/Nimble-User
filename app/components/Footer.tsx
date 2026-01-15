import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const exploreLinks = [
    { label: 'Home', href: '#' },
    { label: 'Feed', href: '#' },
    { label: 'Request', href: '#' }
  ];

  const makeMoneyLinks = [
    { label: 'Sell', href: '#' },
    { label: 'Dropship', href: '#' }
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      href: '#',
      label: 'Facebook'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: '#',
      label: 'Facebook' // Note: In your design this shows "Facebook" for Twitter too
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: '#',
      label: 'Facebook' // Note: In your design this shows "Facebook" for Instagram too
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: '#',
      label: 'Facebook' // Note: In your design this shows "Facebook" for LinkedIn too
    }
  ];

  return (
    <footer className="bg-[#13192F] text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Contact Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">LOGO</h2>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact us</h3>
              <div className="space-y-2 text-gray-300">
                <p>website@gmail.com</p>
                <p>+234-888 -889-999</p>
              </div>
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Make Money Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Make money</h3>
            <ul className="space-y-3">
              {makeMoneyLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect with us</h3>
            <ul className="space-y-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <li key={index}>
                    <a 
                      href={social.href}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <p className="text-gray-400 text-sm">
              © Copyright Rimel 2022. All right reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;