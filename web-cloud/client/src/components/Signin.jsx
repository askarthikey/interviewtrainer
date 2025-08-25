import { SignIn } from '@clerk/clerk-react';
import { useState } from 'react';

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black to-black text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 border border-white/15 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 border border-white/10 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  Welcome back to your 
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
                  success journey
                </span>
              </h1>
              <p className="text-gray-300 text-xl leading-relaxed">
                Continue mastering interviews with our 
                <span className="text-white font-semibold"> AI-powered feedback </span> 
                and comprehensive practice sessions.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Real-time AI analysis & feedback</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v6a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Personalized improvement plans</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Industry-specific scenarios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="relative z-10 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-gray-400 text-xs font-medium">Success Rate</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                15k+
              </div>
              <div className="text-gray-400 text-xs font-medium">Interviews Aced</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                4.9★
              </div>
              <div className="text-gray-400 text-xs font-medium">User Rating</div>
            </div>
          </div>
          
          {/* Enhanced Testimonial */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AM</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                  <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">Verified user</span>
                </div>
                <p className="text-white text-lg italic leading-relaxed mb-4">
                  "The practice sessions were incredibly realistic. I felt completely prepared and confident during my actual interview."
                </p>
                <div>
                  <p className="font-semibold text-white">Alex Morgan</p>
                  <p className="text-gray-400 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Product Manager at Meta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signin Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Custom styled Clerk SignIn component */}
          <div className="clerk-signin-container">
            <style jsx>{`
              .clerk-signin-container .cl-rootBox {
                width: 100%;
              }
              
              .clerk-signin-container .cl-card {
                box-shadow: none !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 12px !important;
              }
              
              .clerk-signin-container .cl-headerTitle {
                display: none !important;
              }
              
              .clerk-signin-container .cl-headerSubtitle {
                display: none !important;
              }
              
              .clerk-signin-container .cl-socialButtonsBlockButton {
                border: 1px solid #e5e7eb !important;
                border-radius: 8px !important;
                padding: 12px !important;
                transition: all 0.2s ease !important;
                background: white !important;
                color: #374151 !important;
              }
              
              .clerk-signin-container .cl-socialButtonsBlockButton:hover {
                border-color: #d1d5db !important;
                background: #f9fafb !important;
              }
              
              .clerk-signin-container .cl-formFieldInput {
                border: 1px solid #e5e7eb !important;
                border-radius: 8px !important;
                padding: 12px !important;
                transition: all 0.2s ease !important;
              }
              
              .clerk-signin-container .cl-formFieldInput:focus {
                border-color: #000 !important;
                box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1) !important;
              }
              
              .clerk-signin-container .cl-formButtonPrimary {
                background: #000 !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 12px !important;
                font-weight: 600 !important;
                transition: all 0.2s ease !important;
              }
              
              .clerk-signin-container .cl-formButtonPrimary:hover {
                background: #1f2937 !important;
              }
              
              .clerk-signin-container .cl-dividerLine {
                background: #e5e7eb !important;
              }
              
              .clerk-signin-container .cl-dividerText {
                color: #6b7280 !important;
                font-size: 14px !important;
              }
              
              .clerk-signin-container .cl-footerActionLink {
                color: #000 !important;
                font-weight: 600 !important;
              }
              
              .clerk-signin-container .cl-footerActionLink:hover {
                color: #374151 !important;
              }
              
              .clerk-signin-container .cl-formFieldAction {
                color: #000 !important;
                font-weight: 500 !important;
              }
              
              .clerk-signin-container .cl-formFieldAction:hover {
                color: #374151 !important;
              }
            `}</style>
            
            <SignIn 
              appearance={{
                elements: {
                  card: "shadow-none border border-gray-200 rounded-xl",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  formFieldInput: "border border-gray-200 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10",
                  formButtonPrimary: "bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors",
                  footerActionLink: "text-black hover:text-gray-700 font-semibold",
                  formFieldAction: "text-black hover:text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm"
                },
                layout: {
                  socialButtonsPlacement: "top"
                }
              }}
              redirectUrl="/dashboard"
              signUpUrl="/signup"
            />
          </div>
          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;