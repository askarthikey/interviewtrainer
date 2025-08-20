import React, { useState } from 'react';

const ContactUs = () => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const useCases = [
    {
      title: "Interview Preparation",
      description: "Practice with AI-powered mock interviews tailored to your industry and role.",
      icon: "💼"
    },
    {
      title: "Technical Skills Assessment",
      description: "Evaluate and improve your technical knowledge with interactive coding challenges.",
      icon: "⚡"
    },
    {
      title: "Behavioral Question Training",
      description: "Master the art of storytelling with STAR method coaching and feedback.",
      icon: "🎯"
    },
    {
      title: "Resume Optimization",
      description: "Get AI-powered suggestions to make your resume stand out to recruiters.",
      icon: "📄"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const scrollCasesLeft = () => {
    setCurrentCaseIndex(Math.max(0, currentCaseIndex - 1));
  };

  const scrollCasesRight = () => {
    setCurrentCaseIndex(Math.min(useCases.length - 1, currentCaseIndex + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-black text-center mb-8">Contact Us</h1>
            
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black text-center mb-12">Use cases</h2>
          
          {/* Use Cases Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={scrollCasesLeft}
                disabled={currentCaseIndex === 0}
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center">
                <span className="text-sm text-gray-500">
                  {currentCaseIndex + 1} / {useCases.length}
                </span>
              </div>
              
              <button
                onClick={scrollCasesRight}
                disabled={currentCaseIndex >= useCases.length - 1}
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Use Cases Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index >= currentCaseIndex && index < currentCaseIndex + 4 
                      ? 'opacity-100 transform translate-x-0' 
                      : 'opacity-50 transform translate-x-4'
                  }`}
                >
                  <div className="bg-white border-2 border-gray-300 rounded-xl p-6 h-64 flex flex-col items-center justify-center text-center hover:border-black transition-all duration-300">
                    {/* Content */}
                    <div className="text-center">
                      <div className="text-3xl mb-3">{useCase.icon}</div>
                      <h3 className="text-lg font-bold text-black mb-2">{useCase.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {useCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCaseIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentCaseIndex ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;