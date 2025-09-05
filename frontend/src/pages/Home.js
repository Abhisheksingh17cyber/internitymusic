import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  PlayIcon, 
  MusicalNoteIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  CloudDownloadIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <MusicalNoteIcon className="h-8 w-8 text-primary-600" />,
      title: 'High-Quality Music',
      description: 'Stream and download music in multiple quality formats including lossless audio.'
    },
    {
      icon: <CreditCardIcon className="h-8 w-8 text-primary-600" />,
      title: 'Secure UPI Payments',
      description: 'Pay securely using UPI with instant confirmation and download access.'
    },
    {
      icon: <CloudDownloadIcon className="h-8 w-8 text-primary-600" />,
      title: 'Instant Downloads',
      description: 'Download purchased music instantly in your preferred quality format.'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-600" />,
      title: 'Secure Platform',
      description: 'Your data and payments are protected with enterprise-grade security.'
    }
  ];

  const stats = [
    { label: 'Songs Available', value: '10,000+' },
    { label: 'Happy Users', value: '50,000+' },
    { label: 'Artists', value: '1,000+' },
    { label: 'Downloads', value: '1M+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow animate-fade-in-up">
              Welcome to <span className="text-yellow-300">MusicStream Pro</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Discover, stream, and download high-quality music with secure payments. Your premium music experience starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              {!user ? (
                <Link
                  to="/login"
                  className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                </Link>
              ) : (
                <Link
                  to="/music"
                  className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Browse Music
                </Link>
              )}
              <Link
                to="/music"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
              >
                Explore Library
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <MusicalNoteIcon className="h-12 w-12 text-white opacity-20" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float animation-delay-1000">
          <PlayIcon className="h-16 w-16 text-white opacity-20" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MusicStream Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience music like never before with our premium features and secure platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sign Up & Browse
              </h3>
              <p className="text-gray-600">
                Create your free account and explore our vast music library
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Choose & Pay
              </h3>
              <p className="text-gray-600">
                Select your favorite tracks and pay securely using UPI
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Download & Enjoy
              </h3>
              <p className="text-gray-600">
                Download instantly and enjoy high-quality music offline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 gradient-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Musical Journey?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Join thousands of music lovers who trust MusicStream Pro for their music needs
            </p>
            <Link
              to="/login"
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Sign Up Now - It's Free!
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
