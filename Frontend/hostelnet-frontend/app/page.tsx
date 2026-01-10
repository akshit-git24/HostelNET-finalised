'use client'
import React from 'react';
import Header from '@/components/Header';
import BlurText from '@/components/BlurText';
import Footer from '@/components/footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden relative">
      <Header />

      {/* Hero Section */}
      <section className="relative text-slate-800 py-20 sm:py-28 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-100 via-white to-sky-100 -skew-y-3"></div>
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-lime-200/50 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sky-200/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left animate-fade-in-up">
            <h2 className="font-extrabold font-serif tracking-tight text-5xl md:text-7xl mb-6 text-slate-900">
              <BlurText
                text="Driving momentum for local communities"
                delay={150}
                animateBy="words"
                direction="top"
              />
            </h2>

            <div className="text-lg md:text-xl mb-10 max-w-xl mx-auto md:mx-0 text-slate-600 animate-fade-in-up animation-delay-300 font-sans">
              <BlurText
                text="Your one-stop platform for finding, managing, and enjoying hostel life with ease and community."
                delay={150}
                animateBy="words"
                direction="top"
              />
            </div>

            <button className="px-6 py-3 font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 text-lg bg-gradient-to-r from-lime-500 to-sky-500 text-white hover:scale-105 shadow-xl hover:shadow-lime-500/50 focus:ring-lime-400/50 animate-fade-in-up animation-delay-500">
              Get Started Now
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center animate-fade-in-up animation-delay-700">
            <div className="relative w-72 h-[34rem] bg-slate-800 rounded-[3rem] p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <div className="absolute inset-0 rounded-[3rem] animate-electric-border z-0"></div>
              <div className="relative w-full h-full bg-white rounded-[2.5rem] p-1.5 z-10">
                <div className="w-full h-full bg-slate-50 rounded-[2.2rem] flex flex-col overflow-hidden">
                  <div className="bg-white p-3 flex items-center shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-lime-300 to-sky-300 animate-pulse"></div>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full ml-3"></div>
                  </div>
                  <div className="p-3 space-y-3 flex-grow">
                    <div className="h-28 bg-sky-100 rounded-lg animate-pulse-light"></div>
                    <div className="h-4 bg-slate-200/70 rounded-full w-3/4"></div>
                    <div className="h-4 bg-slate-200/70 rounded-full w-1/2"></div>
                    <div className="flex-grow bg-lime-100/50 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="font-extrabold font-serif tracking-tight text-4xl text-slate-900">
              How It Works
            </h3>
            <p className="text-slate-600 mt-4 text-lg font-sans">
              Finding your new home has never been easier.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
            {[
              ['01', 'Search', 'Filter and browse hostels that fit your needs and budget.'],
              ['02', 'Connect', 'Connect with potential roommates and find your perfect match.'],
              ['03', 'Book', 'Secure your spot and manage your entire stay with our app.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="relative text-center transform hover:-translate-y-2 transition-transform duration-300">
                <p className="text-6xl font-serif font-bold text-lime-200">{num}</p>
                <h4 className="font-extrabold font-serif tracking-tight text-2xl text-slate-900 mb-2 mt-2">
                  {title}
                </h4>
                <p className="text-slate-600 font-sans">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;
