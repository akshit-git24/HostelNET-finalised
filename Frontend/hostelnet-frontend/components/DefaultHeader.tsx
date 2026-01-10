'use client'
import React, { use, useState } from 'react';
import Link from 'next/link';

// --- React Bits Library Simulation (Consistent with other pages) ---

const Button = ({ children, className, ...props }) => (
  <button
    className={`px-5 py-2.5 font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Title = ({ as = 'h2', children, className, ...props }) => {
  const Component = as;
  return (
    <Component className={`font-extrabold font-serif tracking-tight ${className}`} {...props}>
      {children}
    </Component>
  );
};
// --- End of Simulation ---

// --- Icon Component for Social Links ---
const SocialIcon = ({ href, path }) => (
  <Link href={href} className="text-slate-400 hover:text-white transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: path }} />
  </Link>
);

interface DefaultHeaderProps {
  role?: string | null;
  onLogout?: () => void;
}

// --- Main Header Component ---
const DefaultHeader: React.FC<DefaultHeaderProps> = ({ role, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const socialLinks = {
    twitter: '<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>',
    github: '<path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.284 2.856 7.92 6.74 9.31.5.093.683-.217.683-.482 0-.237-.008-.868-.013-1.703-2.77.604-3.35-1.342-3.35-1.342-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.068-.608.068-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.34 1.087 2.91.83.09-.645.35-1.086.635-1.337-2.22-.253-4.555-1.113-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.104-.253-.448-1.27.098-2.645 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.908-1.296 2.747-1.026 2.747-1.026.548 1.375.204 2.392.1 2.645.64.698 1.03 1.592 1.03 2.682 0 3.84-2.338 4.687-4.566 4.935.36.308.682.92.682 1.852 0 1.336-.012 2.41-.012 2.736 0 .267.18.577.688.48 3.88-1.39 6.732-5.026 6.732-9.31C22 6.477 17.523 2 12 2z" clipRule="evenodd"></path>',
  };

  const [islogged, setislogged] = useState(false);

  // Use prop role if available, or check token existence for basic logged-in state
  // But preferably rely on 'role' passed from parent <Header> which handles decoding.

  React.useEffect(() => {
    if (role || localStorage.getItem('access_token')) {
      setislogged(true);
    } else {
      setislogged(false);
    }
  }, [role]);

  const getDashboardLink = () => {
    if (role === 'Student') return '/student/dashboard';
    if (role === 'Hostel') return '/hostel/dashboard';
    if (role === 'University') return '/university/dashboard';
    // Fallback based on some other logic? Or just default to uni
    return '/university/dashboard';
  };

  return (
    <>
      {/* Top Bar */}
      {/* ... (commented out top bar) ... */}

      {/* Main Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold font-serif bg-gradient-to-r from-lime-500 to-sky-500 bg-clip-text text-transparent">
              HostelNET
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-grow items-center justify-center space-x-8 font-sans font-medium">
            <Link href="/" className="text-slate-700 hover:text-lime-600 transition-colors">Home</Link>
            <Link href="/about" className="text-slate-700 hover:text-lime-600 transition-colors">About</Link>
            <div className="relative group">
            </div>
            <Link href="/contact" className="text-slate-700 hover:text-lime-600 transition-colors">Contact</Link>
            <Link href="/RoomieAI" className="text-slate-700 hover:text-lime-600 transition-colors">RoomieAI</Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            {islogged ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button className="bg-transparent text-slate-700 hover:bg-slate-100">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={onLogout} className="bg-gradient-to-r from-lime-500 to-sky-500 text-white hover:from-lime-600 hover:to-sky-600 shadow-md hover:shadow-lg hover:shadow-sky-500/50 focus:ring-lime-400/50">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-transparent text-slate-700 hover:bg-slate-100">
                  <div className="relative group">
                    <Link href="/university/login" className="text-slate-700 hover:text-lime-600 transition-colors flex items-center">
                      <span>Log In</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </Link>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                      <Link href="/student/login" className="block px-4 py-2 text-slate-700 hover:bg-lime-50">Student</Link>
                      <Link href="/university/login" className="block px-4 py-2 text-slate-700 hover:bg-lime-50">University</Link>
                      <Link href="/hostel/login" className="block px-4 py-2 text-slate-700 hover:bg-lime-50">Hostel Login</Link>
                    </div>
                  </div>
                </Button>
                <Link href="/university/register"><Button className="bg-gradient-to-r from-lime-500 to-sky-500 text-white hover:from-lime-600 hover:to-sky-600 shadow-md hover:shadow-lg hover:shadow-sky-500/50 focus:ring-lime-400/50">Sign Up</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-700 p-2 rounded-md hover:bg-slate-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-5 font-sans font-medium text-lg">
            <Link href="/" className="text-slate-800 hover:text-lime-600">Home</Link>
            <Link href="/about" className="text-slate-800 hover:text-lime-600">About</Link>
            <Link href="/contact" className="text-slate-800 hover:text-lime-600">Contact</Link>
          </nav>
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
            {islogged ? (
              <>
                <Link href={role === 'Student' ? '/student/dashboard' : '/university/dashboard'}>
                  <Button className="w-full bg-slate-100 text-slate-800">Dashboard</Button>
                </Link>
                <Button onClick={onLogout} className="w-full bg-gradient-to-r from-lime-500 to-sky-500 text-white">Logout</Button>
              </>
            ) : (
              <>
                <Button className="w-full bg-slate-100 text-slate-800">Log In</Button>
                <Button className="w-full bg-gradient-to-r from-lime-500 to-sky-500 text-white">Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');

        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </>
  );
};

export default DefaultHeader;