'use client';

import Header from '@/components/Header';
import React from 'react';

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-cyan-50">
        <Header/>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold font-serif text-gray-900 leading-tight">
            Let’s talk about your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-cyan-500">
              hostel needs
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Whether you’re a student, hostel owner, or university admin —  
            we’re here to help you build a smoother hostel experience.
          </p>

          <div className="mt-8 space-y-4 text-gray-700">
            <p><strong>Email:</strong> ********@gmail.com</p>
            <p><strong>Phone:</strong> +91 98765*****</p>
            <p><strong>Location:</strong> India (Remote First)</p>
          </div>
        </div>

        {/* RIGHT - FORM */}
        {/* <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a message
          </h2>

          {/* <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us how we can help you..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-500 to-cyan-500 text-white font-bold py-3 rounded-lg transition-transform duration-300 hover:scale-[1.02]"
            >
              Send Message
            </button>
          </form> */}
        
      </section>
    </main>
  );
};

export default ContactPage;
