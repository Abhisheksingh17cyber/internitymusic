import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { MusicalNoteIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await login(credentialResponse.credential);
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
  };

  const benefits = [
    {
      icon: <MusicalNoteIcon className="h-6 w-6 text-primary-600" />,
      title: 'Access Premium Music',
      description: 'Stream and download high-quality music from our extensive library'
    },
    {
      icon: <CreditCardIcon className="h-6 w-6 text-primary-600" />,
      title: 'Secure UPI Payments',
      description: 'Pay safely using UPI with instant confirmation and access'
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6 text-primary-600" />,
      title: 'Safe & Secure',
      description: 'Your data is protected with enterprise-grade security'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <MusicalNoteIcon className="h-10 w-10 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">MusicStream Pro</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to access premium music features
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div className="mt-6">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex flex-col space-y-4">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      disabled={loading}
                      text="signin_with"
                      shape="rectangular"
                      theme="outline"
                      size="large"
                      width="100%"
                    />
                  </div>
                  
                  {loading && (
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                        <span className="text-sm text-gray-600">Signing you in...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Why sign up?</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image/Design */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h2 className="text-4xl font-bold mb-6">
              Premium Music Experience
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Join thousands of music lovers who trust MusicStream Pro for high-quality music streaming and downloads.
            </p>
            <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm">Premium Tracks</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm">Happy Users</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-sm">Downloads</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating musical notes */}
        <div className="absolute top-20 left-20 animate-float">
          <MusicalNoteIcon className="h-8 w-8 text-white opacity-30" />
        </div>
        <div className="absolute bottom-32 right-20 animate-float animation-delay-1000">
          <MusicalNoteIcon className="h-12 w-12 text-white opacity-20" />
        </div>
        <div className="absolute top-1/2 left-10 animate-float animation-delay-500">
          <MusicalNoteIcon className="h-6 w-6 text-white opacity-40" />
        </div>
      </div>
    </div>
  );
};

export default Login;
