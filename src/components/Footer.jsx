import React from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <h3 className="text-xl font-bold mb-4">AI Interviewer</h3>
            <p className="text-gray-400">
              Revolutionizing interview preparation with AI-powered mock interviews and personalized feedback.
            </p>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="/practice" className="text-gray-400 hover:text-white transition">Practice</a></li>
              <li><a href="/feedback" className="text-gray-400 hover:text-white transition">Feedback</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
            </ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-400 hover:text-white transition">Blog</a></li>
              <li><a href="/tips" className="text-gray-400 hover:text-white transition">Interview Tips</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              <li><a href="/support" className="text-gray-400 hover:text-white transition">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://www.linkedin.com/in/shivanshu-tripathi-704a022b9/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-xl transition"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-xl transition"
              >
                <FaGithub />
              </a>
              <a 
                href="https://twitter.com/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-xl transition"
              >
                <FaTwitter />
              </a>
              <a 
                href="mailto:210tripathi@gmail.com" 
                className="text-gray-400 hover:text-white text-xl transition"
              >
                <FaEnvelope />
              </a>
            </div>
            <p className="text-gray-400">210tripathi@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AI Interviewer. All rights reserved.</p>
          <div className="mt-2 text-sm">
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a> | 
            <a href="/terms" className="hover:text-white transition ml-2">Terms of Service</a> | 
            <a href="/cookies" className="hover:text-white transition ml-2">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;