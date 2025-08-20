import { useState } from 'react';
 // You can keep a small CSS file for custom styles if needed

function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const subscriptionTiers = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Basic features",
        "Limited storage",
        "Email support",
        "Community access"
      ],
      buttonText: "Get Started",
      popular: false,
      tier: "free"
    },
    {
      name: "Gold",
      price: "$19",
      period: "/month",
      description: "Most popular choice",
      features: [
        "All Free features",
        "Unlimited storage",
        "Priority support",
        "Advanced analytics",
        "Custom integrations"
      ],
      buttonText: "Upgrade Now",
      popular: true,
      tier: "gold"
    },
    {
      name: "Premium",
      price: "$49",
      period: "/month",
      description: "For power users",
      features: [
        "All Gold features",
        "White-label solution",
        "24/7 phone support",
        "Custom development",
        "Dedicated account manager"
      ],
      buttonText: "Go Premium",
      popular: false,
      tier: "premium"
    }
  ];

  const faqs = [
    {
      question: "Lorem ipsum dolor sit amet, consectetur ?",
      answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris tempor rutrum libortis."
    },
    {
      question: "Lorem ipsum dolor sit amet, consectetur ?",
      answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris tempor rutrum libortis."
    },
    {
      question: "Lorem ipsum dolor sit amet, consectetur ?",
      answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris tempor rutrum libortis."
    },
    {
      question: "Lorem ipsum dolor sit amet, consectetur ?",
      answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris tempor rutrum libortis."
    },
    {
      question: "Lorem ipsum dolor sit amet, consectetur ?",
      answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris tempor rutrum libortis."
    }
  ];

  return (
    <div className="landing-container max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <section className="hero-section text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="hero-subtitle text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Select the perfect subscription tier for your needs
        </p>

        <div className="subscription-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {subscriptionTiers.map((tier, index) => (
            <div
              key={index}
              className={`subscription-card bg-white rounded-3xl border ${tier.popular ? 'border-4 border-yellow-500 scale-105' : 'border-gray-200'} shadow-2xl overflow-hidden relative transform transition-all duration-300 hover:scale-105 hover:shadow-3xl`}
            >
              {tier.popular && (
                <div className="popular-badge bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-2 px-6 text-sm font-bold uppercase tracking-wider relative -top-px -left-px">
                  Most Popular
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-500"></div>
                </div>
              )}
              <div className={`tier-header p-8 sm:p-10 ${tier.tier === 'free' ? 'bg-gradient-to-br from-gray-50 to-white' : tier.tier === 'gold' ? 'bg-gradient-to-br from-yellow-50 to-white' : 'bg-gradient-to-br from-purple-50 to-white'}`}>
                <h3 className={`tier-name text-3xl font-bold mb-4 ${tier.tier === 'free' ? 'text-gray-700' : tier.tier === 'gold' ? 'text-yellow-600' : 'text-purple-600'}`}>{tier.name}</h3>
                <div className="tier-price flex justify-center items-center mb-4">
                  <span className="price text-6xl sm:text-7xl font-extrabold text-gray-900">{tier.price}</span>
                  <span className="period text-lg text-gray-500 ml-2 font-medium">{tier.period}</span>
                </div>
                <p className="tier-description text-gray-600 text-lg">{tier.description}</p>
              </div>
              <div className="tier-features p-8">
                <ul className="list-none space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-800 text-base font-medium">
                      <span className="checkmark text-green-500 bg-green-50 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tier-footer p-8 pt-0">
                <button
                  className={`tier-btn w-full py-4 px-6 mb-4 rounded-xl text-lg font-semibold text-white ${tier.tier === 'free' ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-md hover:shadow-lg' : tier.tier === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-md hover:shadow-lg' : 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-md hover:shadow-lg'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 transform hover:-translate-y-1`}
                >
                  {tier.buttonText}
                </button>
                <a href="#" className="read-more text-blue-600 text-base font-semibold hover:text-blue-800 transition-colors duration-200">Learn More</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="discounts-section text-center mb-16 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Check for Discounts..!
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempor rutrum libertis dapibus lorem lorem diam eros, pulvinar pretium felis ac, blandit sagittis.
        </p>
        <div className="discount-buttons flex flex-col sm:flex-row gap-4 justify-center">
          <button className="discount-btn student py-3 px-6 rounded-md text-gray-900 font-semibold border-2 border-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-colors duration-300">
            student discount
          </button>
          <button className="discount-btn professional py-3 px-6 rounded-md text-gray-900 font-semibold border-2 border-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-colors duration-300">
            professional discount
          </button>
        </div>
      </section>

      <section className="faq-section mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">FAQs</h2>
        <div className="faq-list space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item rounded-lg border border-gray-200 overflow-hidden">
              <button
                className="faq-question w-full flex justify-between items-center py-5 px-6 bg-white text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <span className={`faq-icon text-2xl transform transition-transform duration-300 ${expandedFaq === index ? 'rotate-45' : 'rotate-0'}`}>+</span>
              </button>
              {expandedFaq === index && (
                <div className="faq-answer p-6 text-gray-600 bg-gray-50 border-t border-gray-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="gift-section text-center mb-16 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Gift a XXXX2
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempor rutrum libertis dapibus lorem lorem diam eros, pulvinar pretium felis ac, blandit sagittis. Donec vitae magna quis lorem suscipit faucibus vel et dolor.
        </p>
        <button className="get-now-btn py-3 px-8 rounded-md text-white font-semibold text-lg bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-300">
          Get Now
        </button>
      </section>
    </div>
  );
}

export default PricingPage;