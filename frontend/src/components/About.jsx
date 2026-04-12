import React, { useState, useEffect } from 'react';
import { VarmanSite } from '../VarmanSite';
import { Icon } from '../Icon';
function About() {
  try {
    const features = [
      {
        icon: 'award',
        title: 'IS Certified Materials',
        description: 'All our materials meet IS (Indian Standard) specifications with proper certification'
      },
      {
        icon: 'clock',
        title: 'Timely Delivery',
        description: '24-48 hours delivery within service areas with reliable logistics network'
      },
      {
        icon: 'users',
        title: 'Expert Team',
        description: '5+ years of experience in building materials supply and customer service'
      },
      {
        icon: 'phone',
        title: 'Customer Support',
        description: 'Dedicated support team available during business hours for assistance'
      },
      {
        icon: 'truck',
        title: 'Pan-Tamilnadu Supply',
        description: 'Serving customers across Tamil Nadu with focus on Southern India'
      },
      {
        icon: 'shield-check',
        title: 'Quality Assurance',
        description: 'Rigorous quality checks and testing for all materials before dispatch'
      }
    ];
    const stats = [
      { number: '200+', label: 'Projects Completed', icon: 'building' },
      { number: '3+', label: 'States Covered', icon: 'map' },
      { number: '5+', label: 'Years Experience', icon: 'calendar' },
      { number: '24-48', label: 'Hours Delivery', icon: 'clock' }
    ];
    return (
      <section className="section-padding bg-dark py-16 md:py-20 lg:py-24 pb-8 md:pb-10 lg:pb-12" data-file="components/About.js" data-name="about" id="about">
        <div className="container-max px-4 md:px-6">
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
            {/* Content */}
            <div className="space-y-5 md:space-y-6 min-w-0">
              {/* Section Badge - Mobile Optimized */}
              <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-card rounded-full shadow-md border border-[var(--border-color)]">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[var(--primary-color)] rounded-full mr-2 md:mr-3"></div>
                <span className="text-sm md:text-base lg:text-lg font-semibold text-[var(--text-primary)]">About VARMAN CONSTRUCTIONS</span>
              </div>

              {/* Headline - Mobile Friendly */}
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                Building Tamil Nadu's Future with <span className="text-gradient">Quality Materials</span> Since 2020
              </h2>

              {/* Original Full Description */}
              <p className="text-lg md:text-xl leading-relaxed text-[var(--text-secondary)]">
                VARMAN CONSTRUCTIONS, established in 2020, has rapidly grown to become a trusted supplier of premium building materials across Tamil Nadu. Despite being a relatively new player in the market, our commitment to quality and customer satisfaction has helped us serve over 200+ construction projects successfully.
              </p>

              <p className="text-lg md:text-xl leading-relaxed text-[var(--text-secondary)]">
                We specialize in supplying high-quality construction materials including M-Sand, Blue Metal (Jalli), various types of bricks, cement, AAC blocks, and natural stones. Our extensive network now covers 3+ states with a primary focus on Tamil Nadu markets, ensuring that quality construction materials reach every corner of our service area.
              </p>

              {/* Commitment Card */}
              <div className="bg-card p-4 md:p-6 rounded-lg border border-[var(--border-color)] shadow-sm">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 md:mb-3 text-base md:text-lg">Our Commitment</h4>
                <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                  "We believe that every construction project deserves the best materials. Our mission is to provide consistent quality, competitive pricing, and reliable service that helps our customers build with confidence. From small residential projects to large infrastructure developments, we are committed to being your trusted material supplier partner."
                </p>
              </div>

              {/* Contact Info - Stacked on Mobile */}
              <div className="flex flex-col gap-3 text-sm md:text-base">
                <a href="tel:+917708484811" className="inline-flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium">
                  <Icon name="phone" className="w-4 h-4 text-[var(--primary-color)]" />
                  <span>+91 77084 84811</span>
                </a>
                <a href="mailto:info@varmanconstructions.in" className="inline-flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium">
                  <Icon name="mail" className="w-4 h-4 text-[var(--primary-color)]" />
                  <span>info@varmanconstructions.in</span>
                </a>
                <div className="inline-flex items-center space-x-2 text-[var(--text-secondary)] font-medium">
                  <Icon name="briefcase" className="w-4 h-4 text-[var(--primary-color)]" />
                  <span>GSTIN: 33BTGPM9877H1Z3</span>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className="relative">
              <img
                src="/assets/herobg.webp"
                alt="VARMAN CONSTRUCTIONS - Building materials supplier"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute top-6 right-6 bg-[var(--primary-color)] text-[var(--background-primary)] p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">2020</div>
                  <div className="text-sm opacity-90">Established</div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 bg-card p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
                    <Icon name="trending-up" className="w-5 h-5 text-[var(--background-primary)]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Growing Fast</div>
                    <div className="text-sm text-[var(--text-secondary)]">200+ Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div className="bg-card p-6 rounded-lg border border-[var(--border-color)] text-center card-shadow" key={index}>
                <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name={stat.icon} className="w-5 h-5 text-[var(--background-primary)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--primary-color)] mb-1">{stat.number}</div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
          {/* Features Grid */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                Why Choose VARMAN CONSTRUCTIONS?
              </h3>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Our commitment to quality, service, and customer satisfaction sets us apart in the building materials industry
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div className="bg-card p-6 rounded-lg border border-[var(--border-color)] card-shadow" key={index}>
                  <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mb-4">
                    <Icon name={feature.icon} className="w-5 h-5 text-[var(--background-primary)]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Our Mission & Vision */}
          <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-card p-5 md:p-8 rounded-lg border border-[var(--border-color)]">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-3">
                  <Icon name="target" className="w-4 h-4 md:w-5 md:h-5 text-[var(--background-primary)]" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold text-[var(--text-primary)]">Our Mission</h4>
              </div>
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                To be the most trusted supplier of high-quality building materials across Tamil Nadu, providing exceptional value to our customers through reliable products, competitive pricing, and outstanding service that supports their construction dreams.
              </p>
            </div>
            <div className="bg-card p-5 md:p-8 rounded-lg border border-[var(--border-color)]">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-3">
                  <Icon name="eye" className="w-4 h-4 md:w-5 md:h-5 text-[var(--background-primary)]" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold text-[var(--text-primary)]">Our Vision</h4>
              </div>
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                To become the preferred choice for construction materials across Tamil Nadu by consistently delivering superior quality products, innovative solutions, and establishing new benchmarks for customer satisfaction and industry excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('About component error:', error);
    return null;
  }
}

export default About;
