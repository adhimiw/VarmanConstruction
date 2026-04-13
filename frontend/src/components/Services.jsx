import React, { useState, useEffect } from 'react';
import { VarmanSite } from '../VarmanSite';
import { Icon } from '../Icon';
function Services() {
  try {
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [showProductModal, setShowProductModal] = React.useState(false);

    const ICON_MAP = {
      m_sand: 'layers',
      p_sand: 'droplets',
      blue_metal: 'zap',
      red_bricks: 'home',
      fly_ash_bricks: 'leaf',
      concrete_blocks: 'square',
      cement: 'package',
      aac_blocks: 'box',
      size_stone: 'mountain',
      natural_stone: 'mountain'
    };

    const initialProducts = [
      {
        id: 'm_sand',
        icon: 'layers',
        title: 'M-Sand (Manufactured Sand)',
        shortDescription: 'High-quality manufactured sand for all construction needs',
        description: 'Premium manufactured sand produced under controlled conditions for consistent quality and performance.',
        specifications: ['Fineness Modulus: 2.6-3.0', 'Silt Content: <3%', 'Water Absorption: <2%', 'Bulk Density: 1.75-1.85 kg/m3'],
        uses: ['Concrete mixing', 'Plastering work', 'Block work', 'Foundation construction'],
        advantages: ['Consistent quality', 'No impurities', 'Better workability', 'Environmentally friendly'],
        unit: 'per Unit',
        image: '/assets/msand.webp'
      },
      {
        id: 'p_sand',
        icon: 'droplets',
        title: 'P-Sand (Plastering Sand)',
        shortDescription: 'Fine plastering sand for smooth wall finishes',
        description: 'Specially processed plastering sand for achieving smooth and durable wall finishes.',
        specifications: ['Fineness Modulus: 1.8-2.2', 'Silt Content: <2%', 'Grain Size: 0.15-2.36mm'],
        uses: ['Wall plastering', 'Ceiling work', 'Fine finishing', 'Decorative plastering'],
        advantages: ['Ultra-fine texture', 'Smooth finish', 'Better adhesion', 'Reduced cracking'],
        unit: 'per Unit',
        image: '/assets/psand.webp'
      },
      {
        id: 'blue_metal',
        icon: 'zap',
        title: 'Blue Metal (Jalli)',
        shortDescription: 'Crushed stone aggregate for concrete and road construction',
        description: 'High-quality crushed blue granite stone available in various sizes for construction needs.',
        specifications: ['20mm - Standard concrete', '40mm - Road construction', '12mm - Fine concrete work'],
        uses: ['Concrete mixing', 'Road base', 'Drainage systems', 'Foundation work'],
        advantages: ['High strength', 'Durable', 'Weather resistant', 'Multiple sizes available'],
        unit: 'per ton',
        image: '/assets/blue metals.webp'
      },
      {
        id: 'red_bricks',
        icon: 'home',
        title: 'Red Bricks',
        shortDescription: 'Traditional clay bricks for wall construction',
        description: 'Traditional kiln-fired clay bricks known for durability and thermal insulation properties.',
        specifications: ['Size: 9x4.5x3 inches', 'Compressive Strength: >3.5 N/mm2', 'Water Absorption: <20%'],
        uses: ['Wall construction', 'Boundary walls', 'Pillars', 'Load-bearing structures'],
        advantages: ['Good insulation', 'Fire resistant', 'Durable', 'Eco-friendly'],
        unit: 'per pieces',
        image: '/assets/red brick.webp'
      },
      {
        id: 'fly_ash_bricks',
        icon: 'leaf',
        title: 'Fly Ash Bricks',
        shortDescription: 'Modern eco-friendly bricks made from fly ash, offering better strength.',
        description: 'Modern eco-friendly bricks made from fly ash, offering better strength and uniform size.',
        specifications: ['Size: 9x4x3 inches', 'Compressive Strength: >7.5 N/mm2', 'Water Absorption: <12%'],
        uses: ['Wall construction', 'High-rise buildings', 'Commercial structures', 'Residential projects'],
        advantages: ['Higher strength', 'Uniform size', 'Less mortar required', 'Eco-friendly'],
        unit: 'per pieces',
        image: '/assets/brick.webp'
      },
      {
        id: 'concrete_blocks',
        icon: 'square',
        title: 'Concrete Blocks',
        shortDescription: 'Solid and hollow concrete blocks for construction',
        description: 'Machine-made concrete blocks available in solid and hollow variants for various construction needs.',
        specifications: ['Solid: 16x8x8 inches', 'Hollow: 16x8x8 inches', 'Compressive Strength: >4 N/mm2'],
        uses: ['Wall construction', 'Partition walls', 'Compound walls', 'Industrial buildings'],
        advantages: ['Quick construction', 'Cost-effective', 'Low maintenance', 'Sound insulation'],
        unit: 'per piece',
        image: '/assets/concretate.webp'
      },
      {
        id: 'cement',
        icon: 'package',
        title: 'Cement',
        shortDescription: 'Premium quality cement from top brands UltraTech, ACC, Ramco',
        description: 'We supply cement from leading brands including UltraTech, ACC, Ramco, Dalmia, and Chettinad.',
        specifications: ['OPC 53 Grade', 'PPC Grade', 'PSC Grade available'],
        uses: ['Concrete mixing', 'Plastering', 'Masonry work', 'Foundation'],
        advantages: ['Top brands', 'Fresh stock', 'Bulk discounts', 'Doorstep delivery'],
        unit: 'per bag',
        brands: ['UltraTech', 'ACC', 'Ramco', 'Dalmia', 'Chettinad'],
        image: '/assets/cement.webp'
      },
      {
        id: 'aac_blocks',
        icon: 'box',
        title: 'AAC Blocks',
        shortDescription: 'Lightweight autoclaved aerated concrete blocks',
        description: 'Modern AAC blocks offering excellent thermal insulation and faster construction.',
        specifications: ['Sizes: 600x200x100mm to 600x200x300mm', 'Density: 550-650 kg/m3', 'Compressive Strength: 3-4.5 N/mm2'],
        uses: ['High-rise construction', 'Green buildings', 'Commercial complexes', 'Residential projects'],
        advantages: ['Lightweight', 'Thermal insulation', 'Fire resistant', 'Earthquake resistant'],
        unit: 'per pieces',
        image: '/assets/acc.webp'
      },
      {
        id: 'size_stone',
        icon: 'mountain',
        title: 'Size Stone / Rough Stone',
        shortDescription: 'Natural stones for foundation and compound walls',
        description: 'Natural rough stones and cut size stones for foundation work and compound wall construction.',
        specifications: ['Rough Stone: Various sizes', 'Size Stone: 9x6 inches standard'],
        uses: ['Foundation work', 'Compound walls', 'Retaining walls', 'Landscaping'],
        advantages: ['Natural material', 'High durability', 'Load-bearing capacity', 'Aesthetic appeal'],
        unit: 'per pieces',
        image: '/assets/sizestone.webp'
      }
    ];

    const [products, setProducts] = React.useState(initialProducts);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }

          const data = await response.json();
          if (!data.products || !Array.isArray(data.products)) {
            return;
          }

          const transformedProducts = data.products.map((product) => {
            let specsArray = [];
            if (product.specifications) {
              if (typeof product.specifications === 'object' && !Array.isArray(product.specifications)) {
                specsArray = Object.entries(product.specifications).map(([key, value]) => {
                  const label = key
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  return `${label}: ${value}`;
                });
              } else if (Array.isArray(product.specifications)) {
                specsArray = product.specifications;
              }
            }

            return {
              id: product.id,
              icon: product.icon || ICON_MAP[product.id] || 'box',
              title: product.name,
              shortDescription: product.short_description || product.description,
              description: product.description,
              specifications: specsArray,
              uses: product.uses || [],
              advantages: product.advantages || [],
              unit: product.unit,
              image: product.image || `/assets/${product.id}.webp`,
              sizes: product.sizes,
              types: product.types,
              grades: product.grades,
              brands: product.brands
            };
          });

          setProducts(transformedProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, []);

    const openProductModal = (product) => {
      setSelectedProduct(product);
      setShowProductModal(true);
    };

    const closeProductModal = () => {
      setShowProductModal(false);
      setSelectedProduct(null);
    };

    const handleGetQuote = () => {
      closeProductModal();
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
      <>
        <section id="services" className="section-padding bg-dark" data-name="services" data-file="components/Services.js">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
                Our <span style={{ color: 'var(--primary-color)' }}>Building Materials</span> Catalog
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                Comprehensive range of <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>high-quality building materials</span> with detailed specifications and competitive pricing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-card border-subtle rounded-xl overflow-hidden card-shadow h-full animate-pulse">
                    <div className="h-48 bg-gray-700/50"></div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-lg mr-4"></div>
                        <div className="h-6 bg-gray-700/50 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                      <div className="flex justify-between mt-6">
                        <div className="h-6 bg-gray-700/50 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-700/50 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                products.map((product, index) => (
                  <div
                    key={product.id || index}
                    className="bg-card border-subtle rounded-xl overflow-hidden card-shadow cursor-pointer group"
                    onClick={() => openProductModal(product)}
                    style={{
                      transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
                    }}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                        style={{
                          filter: 'contrast(1.1) brightness(0.9)'
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, rgba(229,90,43,0.2))' }}
                      ></div>
                      <div className="absolute top-4 right-4 w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Icon name="arrow-right" className="w-4 h-4 text-[var(--background-primary)]" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-500">
                          <Icon name={product.icon} className="w-5 h-5 text-[var(--background-primary)]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">
                          {product.title}
                        </h3>
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                        {product.shortDescription}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-muted)] font-medium bg-[var(--background-secondary)] px-3 py-1 rounded-full border border-[var(--primary-color)]/20">
                          Unit: {product.unit}
                        </span>
                        <span className="text-sm text-[var(--primary-color)] font-semibold hover:underline transition-all duration-300">
                          View Details &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center mt-16 animate-slide-up">
              <div className="bg-card p-12 rounded-2xl border-subtle shadow-elevated">
                <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Need Custom Quantities or Specifications?</h3>
                <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">Contact us for bulk orders, custom specifications, or detailed quotations for your project.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button onClick={() => window.open('tel:+917708484811', '_self')} className="btn-primary">
                    Call Now: +91 77084 84811
                  </button>
                  <button onClick={handleGetQuote} className="btn-secondary">
                    Request Detailed Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeProductModal}>
            <div className="bg-[var(--background-card)] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4">
                      <Icon name={selectedProduct.icon} className="w-5 h-5 text-[var(--background-primary)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">{selectedProduct.title}</h2>
                      <p className="text-[var(--text-secondary)]">Unit: {selectedProduct.unit}</p>
                    </div>
                  </div>
                  <button onClick={closeProductModal} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-2xl transition-all duration-300 transform hover:scale-110" aria-label="Close product details">
                    &times;
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                      loading="lazy"
                      decoding="async"
                    />
                    <p className="text-[var(--text-secondary)] leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div className="space-y-6">
                    {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Specifications:</h4>
                        <ul className="space-y-2">
                          {selectedProduct.specifications.map((spec, idx) => (
                            <li key={idx} className="text-sm text-[var(--text-secondary)] flex items-start">
                              <span className="text-[var(--primary-color)] mr-2">-</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedProduct.sizes && Object.keys(selectedProduct.sizes).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Available Sizes:</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedProduct.sizes).map(([size, details]) => (
                            <div key={size} className="text-sm">
                              <span className="font-medium text-[var(--primary-color)]">{size}:</span>
                              <span className="text-[var(--text-secondary)] ml-2">
                                {typeof details === 'object' ? details.description : details}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.types && Object.keys(selectedProduct.types).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Types Available:</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedProduct.types).map(([type, details]) => (
                            <div key={type} className="text-sm">
                              <span className="font-medium text-[var(--primary-color)]">{type}:</span>
                              <span className="text-[var(--text-secondary)] ml-2">
                                {typeof details === 'object' ? details.description : details}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.grades && Object.keys(selectedProduct.grades).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Grades Available:</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedProduct.grades).map(([grade, details]) => (
                            <div key={grade} className="text-sm">
                              <span className="font-medium text-[var(--primary-color)]">{grade}:</span>
                              <span className="text-[var(--text-secondary)] ml-2">
                                {typeof details === 'object' ? details.description : details}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.brands && selectedProduct.brands.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Available Brands:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.brands.map((brand, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[var(--background-secondary)] text-[var(--primary-color)] rounded-full text-sm border border-[var(--primary-color)]/20">
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.uses && selectedProduct.uses.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Common Uses:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.uses.map((use, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-full text-sm border border-[var(--border-color)]">
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.advantages && selectedProduct.advantages.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Key Advantages:</h4>
                        <ul className="space-y-1">
                          {selectedProduct.advantages.map((advantage, idx) => (
                            <li key={idx} className="text-sm text-[var(--text-secondary)] flex items-center">
                              <Icon name="check" className="w-4 h-4 text-[var(--primary-color)] mr-2 flex-shrink-0" />
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button onClick={() => window.open('tel:+917708484811', '_self')} className="btn-primary">
                    Call for Pricing: +91 77084 84811
                  </button>
                  <button onClick={handleGetQuote} className="btn-secondary">
                    Request Quote
                  </button>
                  <button onClick={() => VarmanSite.openWhatsApp(`Hi, I need information about ${selectedProduct.title}.`)} className="btn-secondary">
                    WhatsApp Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('Services component error:', error);
    return null;
  }
}

export default Services;
