import React, { useState, useEffect } from 'react';
import { VarmanSite } from '../VarmanSite';
import { Icon } from '../Icon';
function FAQ() {
  try {
    const [expandedCategory, setExpandedCategory] = React.useState('delivery');
    const [expandedQuestion, setExpandedQuestion] = React.useState('delivery-0');
    const [faqCategories, setFaqCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const ICON_MAP = {
      'Delivery': 'truck',
      'Payment': 'credit-card',
      'Quality': 'shield-check',
      'Pricing': 'package', // Fallback or map specific pricing icon
      'Support': 'help-circle',
      'Orders': 'package'
    };

    // Initial data as fallback
    const initialFaqCategories = [
      {
        id: 'delivery',
        title: 'Delivery & Logistics',
        icon: 'truck',
        questions: [
          {
            question: 'What is your delivery time?',
            answer: 'We deliver within 24-48 hours for most materials within our primary service areas (Tamil Nadu and neighboring states). For large orders or distant locations, delivery is typically within 2-3 days. We coordinate delivery schedules to match your project timeline.'
          },
          // ... rest of initial questions
        ]
      },
      // ... rest of initial categories
    ];

    // Fallback FAQs grouped by category
    const fallbackFaqs = [
      {
        id: 'delivery',
        title: 'Delivery & Logistics',
        icon: 'truck',
        questions: [
          { question: 'What areas do you deliver to?', answer: 'We deliver across Tamil Nadu with a primary focus on Coimbatore, Dindigul, Tiruppur, Madurai, Tirunelveli, Thoothukudi, Kanyakumari, and surrounding districts.' },
          { question: 'How quickly can you deliver?', answer: 'Standard delivery within 24-48 hours for orders placed before 2 PM within our primary service area.' }
        ]
      },
      {
        id: 'orders',
        title: 'Orders',
        icon: 'package',
        questions: [
          { question: 'What is the minimum order quantity?', answer: 'Minimum order varies by product: M-Sand/P-Sand - 1 unit, Blue Metal - 1 ton, Bricks - 1000 pieces, Cement - 10 bags.' }
        ]
      },
      {
        id: 'quality',
        title: 'Quality',
        icon: 'shield-check',
        questions: [
          { question: 'Do you provide quality certifications?', answer: 'Yes, all our materials meet IS (Indian Standard) specifications. We provide quality test reports upon request.' }
        ]
      },
      {
        id: 'payment',
        title: 'Payment',
        icon: 'credit-card',
        questions: [
          { question: 'What are your payment terms?', answer: 'We accept cash, bank transfer, UPI, and cheques. GST bills are provided for all orders.' }
        ]
      },
      {
        id: 'pricing',
        title: 'Pricing',
        icon: 'tag',
        questions: [
          { question: 'Do you offer bulk discounts?', answer: 'Yes, we offer attractive discounts for bulk orders and regular customers.' }
        ]
      }
    ];

    React.useEffect(() => {
      const fetchFAQs = async () => {
        try {
          const response = await fetch('/api/faqs');
          if (!response.ok) throw new Error('Failed to fetch FAQs');
          const data = await response.json();

          if (data.faqs && Array.isArray(data.faqs)) {
            // Group flat FAQs by category
            const groupedByCategory = {};
            data.faqs.forEach(faq => {
              const cat = faq.category || 'general';
              if (!groupedByCategory[cat]) {
                groupedByCategory[cat] = [];
              }
              groupedByCategory[cat].push({
                question: faq.question,
                answer: faq.answer
              });
            });

            // Transform to array format
            const categoryTitles = {
              delivery: 'Delivery & Logistics',
              orders: 'Orders',
              quality: 'Quality',
              payment: 'Payment',
              pricing: 'Pricing',
              general: 'General'
            };

            const transformedFaqs = Object.entries(groupedByCategory).map(([cat, questions]) => ({
              id: cat,
              title: categoryTitles[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
              icon: ICON_MAP[categoryTitles[cat]] || ICON_MAP[cat] || 'help-circle',
              questions: questions
            }));

            setFaqCategories(transformedFaqs);

            // Set first category as expanded by default if exists
            if (transformedFaqs.length > 0) {
              setExpandedCategory(transformedFaqs[0].id);
              setExpandedQuestion(`${transformedFaqs[0].id}-0`);
            }
          }
        } catch (error) {
          console.error('Error fetching FAQs:', error);
          // Use fallback data
          setFaqCategories(fallbackFaqs);
          setExpandedCategory('delivery');
          setExpandedQuestion('delivery-0');
        } finally {
          setLoading(false);
        }
      };

      fetchFAQs();
    }, []);

    const toggleCategory = (categoryId) => {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
      setExpandedQuestion(null);
    };

    const toggleQuestion = (questionIndex) => {
      setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex);
    };

    return (
      <section id="faq" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-dark" data-name="faq" data-file="components/FAQ.js">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Find answers to common questions about our materials, delivery, pricing, and services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {loading ? (
              // Loading Skeleton
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-10 w-32 bg-gray-700/50 rounded-lg animate-pulse"></div>
                  ))}
                </div>
                <div className="bg-card rounded-lg p-6 space-y-4 animate-pulse">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-lg mr-3"></div>
                    <div className="h-8 w-48 bg-gray-700/50 rounded"></div>
                  </div>
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-16 w-full bg-gray-700/50 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${expandedCategory === category.id
                        ? 'bg-[var(--primary-color)] text-[var(--background-primary)]'
                        : 'bg-card text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]'
                        }`}
                    >
                      <Icon name={category.icon} className="w-4 h-4" />
                      <span className="text-sm">{category.title}</span>
                    </button>
                  ))}
                </div>

                {/* FAQ Content */}
                {faqCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`${expandedCategory === category.id ? 'block' : 'hidden'}`}
                  >
                    <div className="bg-card rounded-lg p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-3">
                          <Icon name={category.icon} className="w-5 h-5 text-[var(--background-primary)]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">{category.title}</h3>
                      </div>

                      <div className="space-y-4">
                        {category.questions.map((faq, index) => (
                          <div key={index} className="bg-[var(--background-secondary)] rounded-lg border border-[var(--border-color)]">
                            <button
                              onClick={() => toggleQuestion(`${category.id}-${index}`)}
                              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[var(--background-card)] transition-colors"
                            >
                              <span className="font-medium text-[var(--text-primary)] pr-4">{faq.question}</span>
                              <Icon
                                name="chevron-down"
                                className={`w-5 h-5 text-[var(--primary-color)] transform transition-transform ${expandedQuestion === `${category.id}-${index}` ? 'rotate-180' : ''}`}
                              />
                            </button>
                            {expandedQuestion === `${category.id}-${index}` && (
                              <div className="px-6 pb-4">
                                <div className="border-t border-[var(--border-color)] pt-4">
                                  <p className="text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Still have questions section */}
          <div className="mt-8 text-center bg-card p-8 rounded-lg border border-[var(--border-color)]">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Still Have Questions?</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
              Our team is here to help! Contact us for personalized assistance with your building material requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('tel:+917708484811', '_self')}
                className="btn-primary"
              >
                Call Us: +91 77084 84811
              </button>
              <button
                onClick={() => {
                  const message = "Hi VARMAN CONSTRUCTIONS! I have some questions about your building materials. Can you help?";
                  window.open(`https://wa.me/917708484811?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="btn-secondary"
              >
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('FAQ component error:', error);
    return null;
  }
}

export default FAQ;
