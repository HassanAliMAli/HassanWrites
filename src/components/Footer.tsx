'use client';

import { useState } from 'react';
import GithubIcon from './icons/GithubIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import MediumIcon from './icons/MediumIcon';
import XIcon from './icons/XIcon';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://blog-newsletter-proxy.hassanali205031.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-300">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Subscribe to my newsletter</h3>
          <form onSubmit={handleSubmit} className="flex justify-center">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="ml-2 p-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && <p className="text-green-600 mt-2">Thanks for subscribing!</p>}
          {status === 'error' && <p className="text-red-600 mt-2">Something went wrong. Please try again.</p>}
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="https://github.com/HassanAliMAli" target="_blank" rel="noopener noreferrer">
            <GithubIcon />
          </a>
          <a href="https://www.linkedin.com/in/hassanalimali" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon />
          </a>
          <a href="https://medium.com/@hassanalimali" target="_blank" rel="noopener noreferrer">
            <MediumIcon />
          </a>
          <a href="https://x.com/itzalm1ghty" target="_blank" rel="noopener noreferrer">
            <XIcon />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} HassanWrites. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
