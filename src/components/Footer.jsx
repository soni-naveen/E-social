import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-10 pb-5 text-sm sm:text-base">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About Us */}
          <div>
            <h3 className="sm:text-lg text-gray-600 font-semibold mb-3 sm:mb-4">
              About E-Social
            </h3>
            <p className="text-gray-500">
              E-Social is a platform where you can connect with people, share
              ideas, and grow your network. Join us and be a part of a vibrant
              online community!
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex md:justify-center">
            <div>
              <h3 className="sm:text-lg text-gray-600 font-semibold mb-3 sm:mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-500 hover:text-black hover:underline"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://naveensoni.vercel.app/about"
                    className="text-gray-500 hover:text-black hover:underline"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://theecoride.in"
                    className="text-gray-500 hover:text-black hover:underline"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="mailto:naveen@theecoride.in"
                    className="text-gray-500 hover:text-black hover:underline"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Follow Us */}
          <div className="flex md:justify-center">
            <div>
              <h3 className="sm:text-lg font-semibold text-gray-600 mb-3 sm:mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/naveenn.sonii"
                  className="text-gray-500 hover:text-black"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://x.com/ecoride_in"
                  className="text-gray-500 hover:text-black"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.instagram.com/ecoride.in"
                  className="text-gray-500 hover:text-black"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://linkedin.com/company/ecoridein"
                  className="text-gray-500 hover:text-black"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="text-xs mt-8 border-t border-gray-400 pt-4 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} E-Social ● Developed by{" "}
            <a target="_blank" className="underline text-teal-500" href="https://naveensoni.vercel.app">
              Naveen Soni
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
