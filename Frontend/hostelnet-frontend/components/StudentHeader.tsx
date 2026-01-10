'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Button = ({ children, className, ...props }) => (
  <button
    className={`px-5 py-2.5 font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const StudentHeader: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Student') {
      router.push('/student/login');
      return;
    }

    setStudentName(localStorage.getItem('username') || 'John Doe');
    setStudentId(localStorage.getItem('student_id') || 'STU12345');
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/student/login');
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold font-serif bg-gradient-to-r from-lime-500 to-sky-500 bg-clip-text text-transparent">
              HostelNET-Students
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-grow items-center justify-center space-x-8 font-sans font-medium">
            <Link href="/" className="text-slate-700 hover:text-lime-600 transition-colors">Home</Link>
            <Link href="/about" className="text-slate-700 hover:text-lime-600 transition-colors">About</Link>
            <Link href="/student/dashboard" className="text-slate-700 hover:text-lime-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/" className="text-slate-700 hover:text-lime-600 transition-colors">Contact</Link>
          </nav>

          {/* Student Info + Logout */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <div className="text-slate-700 text-sm text-right">
              <div>Welcome,{studentName}</div>
              <div><span>Student ID :</span>{studentId}</div>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 shadow-md"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-700 p-2 rounded-md hover:bg-slate-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <div className={`fixed inset-0 z-50 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-80 h-full bg-white ml-auto p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-lime-600">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-5 font-sans font-medium text-lg">
            <Link href="/" className="text-slate-800 hover:text-lime-600">Home</Link>
            <Link href="/about" className="text-slate-800 hover:text-lime-600">About</Link>
            <Link href="/student/dashboard" className="text-slate-800 hover:text-lime-600">Dashboard</Link>
            <Link href="/" className="text-slate-800 hover:text-lime-600">Contact</Link>
          </nav>
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4 text-sm text-right">
            <div>Welcome,{studentName}</div>
            <div><span>Student ID: </span>{studentId}</div>
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </>
  );
};

export default StudentHeader;
