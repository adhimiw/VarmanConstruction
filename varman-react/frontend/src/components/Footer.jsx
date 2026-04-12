import React, { useState, useEffect } from 'react';
import { VarmanSite } from '../VarmanSite';
import { Icon } from '../Icon';
function Footer() {
  try {
    var currentYear = new Date().getFullYear();

    var scrollToSection = function scrollToSection(sectionId) {
      var element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <footer className="border-t border-[var(--border-color)]" data-name="footer" data-file="components/Footer.js" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="container-max relative z-10 px-6 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

            {/* Company Info */}
            <div className="space-y-4">
              <img
                src="/assets/logo.png"
                alt="VARMAN CONSTRUCTIONS Logo"
                className="h-20 w-auto object-contain"
                loading="lazy"
                decoding="async"
                width="120"
                height="60"
                style={{ filter: 'brightness(1.1)' }}
              />
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.7' }}>
                Tamil Nadu's trusted building materials supplier since 2020. Premium quality M-Sand, Blue Metal, Cement, Bricks & AAC Blocks with fast 24-48 hour delivery.
              </p>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                <span style={{ color: '#E55A2B', fontWeight: '600' }}>GSTIN:</span> 33BTGPM9877H1Z3
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600' }}>Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                <button onClick={function() { scrollToSection('home'); }} className="text-left cursor-pointer" style={{ color: '#94A3B8', fontSize: '0.95rem', background: 'none', border: 'none', padding: '4px 0', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>Home</button>
                <button onClick={function() { scrollToSection('services'); }} className="text-left cursor-pointer" style={{ color: '#94A3B8', fontSize: '0.95rem', background: 'none', border: 'none', padding: '4px 0', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>Products</button>
                <button onClick={function() { scrollToSection('about'); }} className="text-left cursor-pointer" style={{ color: '#94A3B8', fontSize: '0.95rem', background: 'none', border: 'none', padding: '4px 0', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>About Us</button>
                <button onClick={function() { scrollToSection('faq'); }} className="text-left cursor-pointer" style={{ color: '#94A3B8', fontSize: '0.95rem', background: 'none', border: 'none', padding: '4px 0', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>FAQ</button>
                <button onClick={function() { scrollToSection('contact'); }} className="text-left cursor-pointer" style={{ color: '#94A3B8', fontSize: '0.95rem', background: 'none', border: 'none', padding: '4px 0', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>Contact</button>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600' }}>Contact Us</h4>
              <div className="space-y-3">
                <a href="tel:+917708484811" className="flex items-center space-x-3 group" style={{ textDecoration: 'none' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(229, 90, 43, 0.15)' }}>
                    <Icon name="phone" className="w-4 h-4" style={{ color: '#E55A2B' }} />
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>+91 77084 84811</span>
                </a>
                <a href="tel:+919965237777" className="flex items-center space-x-3 group" style={{ textDecoration: 'none' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(229, 90, 43, 0.15)' }}>
                    <Icon name="phone" className="w-4 h-4" style={{ color: '#E55A2B' }} />
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>+91 99652 37777</span>
                </a>
                <a href="mailto:info@varmanconstructions.in" className="flex items-center space-x-3 group" style={{ textDecoration: 'none' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(229, 90, 43, 0.15)' }}>
                    <Icon name="mail" className="w-4 h-4" style={{ color: '#E55A2B' }} />
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={function(e) { e.target.style.color = '#E55A2B'; }} onMouseLeave={function(e) { e.target.style.color = '#94A3B8'; }}>info@varmanconstructions.in</span>
                </a>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(229, 90, 43, 0.15)' }}>
                    <Icon name="clock" className="w-4 h-4" style={{ color: '#E55A2B' }} />
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Mon - Sat: 8:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Divider + Copyright */}
          <div style={{ borderTop: '1px solid #2D3748', marginTop: '2.5rem', paddingTop: '1.5rem' }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
                &copy; {currentYear} VARMAN CONSTRUCTIONS. All rights reserved.
              </p>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
                Building Tamil Nadu's Future with Quality Materials
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}

export default Footer;
