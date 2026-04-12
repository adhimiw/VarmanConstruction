import React, { useState, useEffect } from 'react';
import { VarmanSite } from '../VarmanSite';
import { Icon } from '../Icon';
function Header() {
  try {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setIsMenuOpen(false);
      }
    };

    const handleCallNow = () => {
      VarmanSite.openWhatsApp('Hi VARMAN CONSTRUCTIONS, I need a quote for building materials.');
    };

    return (
      <header className="bg-white/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-gray-100" data-name="header" data-file="components/Header.js" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
        <div className="max-w-full relative z-10 px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">

            {/* Left Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-2 flex-1">
              <button onClick={() => scrollToSection('home')} className="px-5 py-2 text-gray-800 hover:text-[var(--primary-color)] transition-all duration-300 font-semibold text-lg min-w-[90px] text-center">
                Home
              </button>
              <button onClick={() => scrollToSection('services')} className="px-5 py-2 text-gray-800 hover:text-[var(--primary-color)] transition-all duration-300 font-semibold text-lg min-w-[90px] text-center">
                Products
              </button>
              <button onClick={() => scrollToSection('about')} className="px-5 py-2 text-gray-800 hover:text-[var(--primary-color)] transition-all duration-300 font-semibold text-lg min-w-[90px] text-center">
                About
              </button>
            </nav>

            {/* Mobile Menu Button - Left Side */}
            <button
              aria-label="Toggle menu"
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className={`w-5 h-0.5 bg-gray-800 mb-1 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-gray-800 mb-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>

            {/* Center Logo Only */}
            <div className="flex items-center justify-center cursor-pointer flex-1 lg:flex-none lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              <img
                src="/assets/logo.png"
                alt="VARMAN CONSTRUCTIONS Logo"
                className="h-24 md:h-36 lg:h-44 w-auto object-contain"
                loading="eager"
                width="200"
                height="100"
                style={{
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                }}
              />
            </div>

            {/* Right Navigation + CTA - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-end">
              <button onClick={() => scrollToSection('faq')} className="px-5 py-2 text-gray-800 hover:text-[var(--primary-color)] transition-all duration-300 font-semibold text-lg min-w-[90px] text-center">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-5 py-2 text-gray-800 hover:text-[var(--primary-color)] transition-all duration-300 font-semibold text-lg min-w-[90px] text-center">
                Contact
              </button>

              <div className="ml-4 flex flex-col items-center">
                <button
                  onClick={handleCallNow}
                  className="relative px-5 py-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 group overflow-hidden"
                  style={{ boxShadow: '0 4px 20px rgba(255, 107, 0, 0.4)' }}
                >
                  <span className="relative z-10 text-sm">WHATSAPP NOW</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <span className="text-xs text-gray-500 mt-1 font-medium">GSTIN: 33BTGPM9877H1Z3</span>
              </div>
            </div>

            {/* Mobile WhatsApp Button - Right Side */}
            <div className="lg:hidden flex flex-col items-center flex-shrink-0">
              <button
                onClick={handleCallNow}
                className="relative px-3 py-1.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-semibold rounded-full shadow-lg transition-all duration-300 flex items-center space-x-1 text-xs"
                style={{ boxShadow: '0 4px 20px rgba(255, 107, 0, 0.4)' }}
              >
                <span>WHATSAPP NOW</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
              <span className="text-[10px] text-gray-500 mt-0.5 font-medium">GSTIN: 33BTGPM9877H1Z3</span>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full border-t border-gray-100 animate-slide-up shadow-2xl bg-white">
              <div className="py-4">
                <button onClick={() => scrollToSection('home')} className="block w-full text-left px-6 py-3 text-gray-800 hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium transition-all duration-300">
                  Home
                </button>
                <button onClick={() => scrollToSection('services')} className="block w-full text-left px-6 py-3 text-gray-800 hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium transition-all duration-300">
                  Products
                </button>
                <button onClick={() => scrollToSection('about')} className="block w-full text-left px-6 py-3 text-gray-800 hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium transition-all duration-300">
                  About
                </button>
                <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-6 py-3 text-gray-800 hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium transition-all duration-300">
                  FAQ
                </button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-6 py-3 text-gray-800 hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium transition-all duration-300">
                  Contact
                </button>

                {/* Mobile Contact */}
                <div className="px-6 py-4 border-t border-gray-100 mt-3 bg-gray-50">
                  <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Contact Info</div>
                  <div className="text-xs text-gray-600 mb-2">GSTIN: <span className="text-[var(--primary-color)] font-semibold">33BTGPM9877H1Z3</span></div>
                  <div className="flex flex-col space-y-2">
                    <a href="tel:+917708484811" className="text-sm text-gray-800 hover:text-[var(--primary-color)] font-medium transition-colors duration-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +91 77084 84811
                    </a>
                    <a href="tel:+919965237777" className="text-sm text-gray-800 hover:text-[var(--primary-color)] font-medium transition-colors duration-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +91 99652 37777
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}

export default Header;
