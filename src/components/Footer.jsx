import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About Us */}
          <div>
            <h3 className="text-lg text-gray-600 font-bold mb-4">
              About E-Social
            </h3>
            <p className="text-gray-500">
              E-Social is a platform where you can connect with people, share
              ideas, and grow your network. Join us and be a part of a vibrant
              online community!
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg text-gray-600 font-bold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-gray-500 hover:text-black hover:underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-500 hover:text-black hover:underline"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-500 hover:text-black hover:underline"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="mailto:naveennsonii@gmail.com"
                  className="text-gray-500 hover:text-black hover:underline"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div>
            <h3 className="text-lg font-bold text-gray-600 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/naveenn.sonii"
                className="text-gray-500 hover:text-black"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://x.com/naveennsoni"
                className="text-gray-500 hover:text-black"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.instagram.com/naveenn.soni"
                className="text-gray-500 hover:text-black"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://linkedin.com/in/soni-naveen"
                className="text-gray-500 hover:text-black"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} E-Social. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
