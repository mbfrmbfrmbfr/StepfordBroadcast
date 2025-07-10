import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[var(--sbc-charcoal)] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SBC</h3>
            <p className="text-gray-300">
              Stepford Broadcasting Corporation - Your trusted source for news and information.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">News</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#politics" className="hover:text-white transition-colors">
                  Politics
                </a>
              </li>
              <li>
                <a href="#business" className="hover:text-white transition-colors">
                  Business
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-white transition-colors">
                  Sports
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Departments</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#verify" className="hover:text-white transition-colors">
                  SBC Verify
                </a>
              </li>
              <li>
                <a href="#declassify" className="hover:text-white transition-colors">
                  SBC Declassify
                </a>
              </li>
              <li>
                <a href="#investigative" className="hover:text-white transition-colors">
                  SBC Investigative
                </a>
              </li>
              <li>
                <a href="#international" className="hover:text-white transition-colors">
                  SBC International
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#press" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Stepford Broadcasting Corporation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
