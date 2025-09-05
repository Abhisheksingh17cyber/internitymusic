import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import QRCode from 'qrcode.react';
import {
  CreditCardIcon,
  QrCodeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Payment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [cartItems] = useState([
    // Mock cart items - in real app, this would come from context/props
    {
      _id: '1',
      title: 'Sample Song 1',
      artist: 'Sample Artist',
      price: 15,
      quality: 'high'
    }
  ]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const createPayment = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const musicItems = cartItems.map(item => ({
        musicId: item._id,
        quality: item.quality
      }));

      const response = await paymentAPI.create(musicItems);
      setPaymentData(response.data);
      setPaymentStatus('pending');
      
      // Start polling for payment status
      pollPaymentStatus(response.data.transactionId);
    } catch (error) {
      console.error('Payment creation failed:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = (transactionId) => {
    const interval = setInterval(async () => {
      try {
        const response = await paymentAPI.getStatus(transactionId);
        const status = response.data.status;
        
        if (status === 'completed') {
          setPaymentStatus('completed');
          clearInterval(interval);
        } else if (status === 'failed') {
          setPaymentStatus('failed');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 3000); // Check every 3 seconds

    // Stop polling after 15 minutes
    setTimeout(() => {
      clearInterval(interval);
      if (paymentStatus === 'pending') {
        setPaymentStatus('timeout');
      }
    }, 15 * 60 * 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-16 w-16 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-16 w-16 text-yellow-500 animate-spin" />;
      default:
        return <CreditCardIcon className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'completed':
        return {
          title: 'Payment Successful!',
          description: 'Your music has been added to your library and is ready for download.',
          color: 'text-green-600'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.',
          color: 'text-red-600'
        };
      case 'pending':
        return {
          title: 'Waiting for Payment',
          description: 'Please complete the payment using the UPI QR code or link below.',
          color: 'text-yellow-600'
        };
      case 'timeout':
        return {
          title: 'Payment Timeout',
          description: 'The payment session has expired. Please start a new payment.',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Complete Your Purchase',
          description: 'Review your items and proceed with secure UPI payment.',
          color: 'text-gray-600'
        };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to make a purchase.</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(paymentStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Secure Payment</h1>
            <p className="text-primary-100">Complete your music purchase</p>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Items ({cartItems.length})</span>
                    <span className="font-medium text-gray-900">Price</span>
                  </div>
                </div>
                {cartItems.map((item, index) => (
                  <div key={index} className="px-4 py-3 border-b last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.artist}</p>
                        <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                          {item.quality} quality
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">₹{item.price}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-50 px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center space-y-4">
                {getStatusIcon(paymentStatus)}
                <div>
                  <h2 className={`text-2xl font-bold ${statusInfo.color} mb-2`}>
                    {statusInfo.title}
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {statusInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            {paymentStatus === 'idle' && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <QrCodeIcon className="h-6 w-6 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">UPI Payment</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Pay securely using any UPI app like GPay, PhonePe, Paytm, or your bank's UPI app.
                  </p>
                  <button
                    onClick={createPayment}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="h-5 w-5" />
                        <span>Pay ₹{totalAmount} with UPI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* QR Code Display */}
            {paymentStatus === 'pending' && paymentData && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Scan QR Code to Pay
                  </h3>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <QRCode value={paymentData.upiUrl} size={200} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with any UPI app to complete your payment
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-gray-900">{paymentData.transactionId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">₹{paymentData.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Or pay using UPI link:</p>
                  <a
                    href={paymentData.upiUrl}
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Open UPI App
                  </a>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium mb-1">Payment expires in 15 minutes</p>
                      <p className="text-yellow-700">
                        Please complete your payment within the time limit to avoid expiration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Actions */}
            {paymentStatus === 'completed' && (
              <div className="text-center space-y-4">
                <button
                  onClick={() => window.location.href = '/music'}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Go to My Music
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="block mx-auto text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            )}

            {/* Retry Actions */}
            {(paymentStatus === 'failed' || paymentStatus === 'timeout') && (
              <div className="text-center space-y-4">
                <button
                  onClick={() => {
                    setPaymentStatus('idle');
                    setPaymentData(null);
                  }}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
