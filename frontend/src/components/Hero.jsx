import React, { useState, useEffect } from 'react';
import { VarmanSite } from '../VarmanSite';
import { Icon } from '../Icon';
function Hero() {
  try {
    const handleGetQuote = () => {
      const element = document.getElementById('contact');
      if (element) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    return (
      <section
        id="home"
        className="relative overflow-hidden"
        data-name="hero"
        data-file="components/Hero.js"
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Clean white background for light theme */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#FFFFFF',
            zIndex: 0
          }}
        />

        {/* Warm orange glow tailored for white background */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '70%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(255, 140, 66, 0.15) 0%, rgba(229, 90, 43, 0.05) 40%, transparent 70%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <div className="container-max relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-24 pb-8 md:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-6 animate-slide-up">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-8" style={{
                background: 'rgba(255, 140, 66, 0.1)',
                border: '1px solid rgba(255, 140, 66, 0.3)',
                backdropFilter: 'blur(4px)'
              }}>
                <svg className="w-4 h-4" style={{ color: '#E55A2B' }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="text-sm font-semibold" style={{ color: '#E55A2B' }}>Trusted by 500+ Contractors Since 2020</span>
              </div>

              {/* Main Headline - Clear Value Proposition */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight">
                <span style={{ color: '#E55A2B' }}>Premium Building Materials</span>
                <br />
                <span style={{ color: '#FF8C42' }}>Supplier Across </span>
                <span style={{
                  background: 'linear-gradient(135deg, #FF8C42, #E55A2B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Tamil Nadu</span>
              </h1>

              {/* Clear Benefit Statement */}
              <p className="text-lg md:text-xl leading-relaxed max-w-lg" style={{
                color: '#475569'
              }}>
                Your trusted partner since 2020 for high-quality building materials. We supply <span style={{ color: '#E55A2B', fontWeight: '700' }}>M-Sand, Blue Metal, Cement, Bricks</span>, and specialized construction supplies across Tamil Nadu with guaranteed quality and timely delivery.
              </p>

              {/* Key Benefits - Quick Scan */}
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#FF8C42' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#0F172A', fontSize: '14px', fontWeight: '500' }}>Quality Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#FF8C42' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#0F172A', fontSize: '14px', fontWeight: '500' }}>24-48hr Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#FF8C42' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#0F172A', fontSize: '14px', fontWeight: '500' }}>Best Prices</span>
                </div>
              </div>

              {/* CTA Buttons - Merged light block without hover animation */}
              <div className="pt-2 max-w-xl">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '10px'
                  }}
                >
                  <button
                    onClick={handleGetQuote}
                    style={{
                      background: '#E55A2B',
                      color: '#FFFFFF',
                      padding: '16px 20px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      letterSpacing: '0.01em',
                      border: '1px solid #E55A2B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    Get Free Quote Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <a
                    href={VarmanSite.buildWhatsAppUrl('Hi VARMAN CONSTRUCTIONS! I need a quote for building materials.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25D366',
                      color: '#FFFFFF',
                      padding: '16px 20px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      border: '1px solid #25D366',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white">A</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white">R</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white">K</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white">M</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4" style={{ color: '#FFD700' }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ color: '#475569', fontSize: '13px', fontWeight: '500' }}>Rated 4.9/5 by 200+ customers</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="flex justify-center items-center mt-8 lg:mt-0 animate-fade-in">
              <img
                src="/assets/hero.png"
                alt="Construction materials - VARMAN CONSTRUCTIONS"
                className="relative z-10"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                sizes="(min-width: 1024px) 450px, 100vw"
                width="450"
                height="450"
                style={{
                  maxWidth: '450px',
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>

          </div>
        </div>

      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}

export default Hero;
