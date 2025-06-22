"use client";

import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        setStatus({ loading: false, success: false, error: data.error || 'An unknown error occurred.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Failed to connect to the server.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="name" className="block text-neutral-300 text-sm font-medium mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Riif..."
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="email" className="block text-neutral-300 text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="riif@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block text-neutral-300 text-sm font-medium mb-2">
          Message or Suggestion
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Your message here..."
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          disabled={status.loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status.loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
      
      {status.success && (
        <p className="mt-4 text-center text-emerald-400">
          Message sent successfully! Thank you for reaching out.
        </p>
      )}
      {status.error && (
        <p className="mt-4 text-center text-red-400">
          Error: {status.error}
        </p>
      )}
    </form>
  );
};

export default ContactForm; 