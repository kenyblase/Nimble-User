'use client'
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call - replace with your actual reset password API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleReturnToLogin = () => {
    router.push('/login');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full mx-auto min-h-screen bg-white">
      {/* Back Button */}
      <div className="flex items-center mb-6 p-6">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      
      <div className="px-6 pt-6 pb-8 max-w-md mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-8 text-black">
          <h1 className="text-xl font-bold mb-2">LOGO</h1>
          <h2 className="text-2xl font-bold">Reset password</h2>
          <p className="text-gray-600 mt-2">
            {isSubmitted 
              ? 'Check your email for reset instructions' 
              : 'Input the email address associated with your account'
            }
          </p>
        </div>

        {!isSubmitted ? (
          <>
            {/* Email Input */}
            <div className="space-y-5 mb-6" onKeyPress={handleKeyPress}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Example@gmail.com"
                  className={`w-full px-4 placeholder-gray-500 text-black py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    emailError ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-full transition-colors duration-200 mb-6 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </>
        ) : (
          /* Success State */
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <p className="text-gray-700 mb-6">
              We've sent password reset instructions to:<br />
              <span className="font-medium text-black">{email}</span>
            </p>

            <button
              onClick={handleReturnToLogin}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors duration-200"
            >
              Return to login
            </button>

            <p className="text-sm text-gray-600">
              Didn't receive the email?{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-orange-600 hover:underline font-medium"
              >
                Try again
              </button>
            </p>
          </div>
        )}

        {/* Return to Login Link - Only show when not in success state */}
        {!isSubmitted && (
          <div className="text-center mt-6">
            <button
              onClick={handleReturnToLogin}
              className="text-sm text-orange-600 hover:underline font-medium"
            >
              Return to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;