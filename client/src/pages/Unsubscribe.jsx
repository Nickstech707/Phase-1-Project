import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const Unsubscribe = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading');
  const { email } = useParams();

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/unsubscribe', { email });
        setMessage(response.data.message);
        setStatus('success');
      } catch (error) {
        setMessage('Error unsubscribing. Please try again later.');
        setStatus('error');
        console.error('Unsubscribe error:', error);
      }
    };

    unsubscribe();
  }, [email]);

  const EnvelopeBackground = () => (
    <svg 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 -z-10"
      viewBox="0 0 200 200" 
      width="200" 
      height="200"
    >
      <path
        fill="currentColor"
        d="M20,40 L180,40 L180,160 L20,160 L20,40 Z M100,120 L180,60 L20,60 L100,120 Z"
      />
    </svg>
  );

  const LoadingAnimation = () => (
    <div className="flex justify-center">
      <Mail className="w-16 h-16 text-emerald-500" />
    </div>
  );

  const SuccessAnimation = () => (
    <div className="flex justify-center">
      <CheckCircle className="w-16 h-16 text-emerald-500" />
    </div>
  );

  const ErrorAnimation = () => (
    <div className="flex justify-center">
      <AlertCircle className="w-16 h-16 text-red-500" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 px-4">
      <div className="relative w-full max-w-md bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
        <EnvelopeBackground />
        
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="flex justify-center w-full animate-fade-in">
            {status === 'loading' && <LoadingAnimation />}
            {status === 'success' && <SuccessAnimation />}
            {status === 'error' && <ErrorAnimation />}
          </div>

          <h1 className="text-3xl font-bold text-emerald-500 text-center">
            {status === 'loading' ? 'Processing...' :
             status === 'success' ? 'Unsubscribed!' :
             'Oops!'}
          </h1>

          <p className="text-gray-400 text-lg text-center max-w-sm animate-fade-in">
            {message || 'Processing your request...'}
          </p>

          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-900 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors duration-200 mt-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;