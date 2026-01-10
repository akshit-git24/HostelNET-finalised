'use client'
import React from 'react';
import Header from '@/components/Header';
import SplitText from '@/components/SplitText';
import TextType from '@/components/TextType';

// --- React Bits Library Simulation (Consistent with HomePage) ---

const Button = ({ children, className, ...props }) => (
  <button
    className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 ${className}`} 
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

// --- End of Simulation --

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative text-center bg-gradient-to-br from-lime-100 via-white to-sky-100 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Title as="h2" className="text-5xl md:text-7xl text-slate-900">
            <SplitText
            text="About HostelNET"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            />
            </Title>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-sans">
            We're a passionate team dedicated to simplifying the hostel experience, fostering connections, and building communities for travelers and students worldwide.
          </p>
          <div className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-sans">
            <TextType
            text={["Welcome to HostelNET!","Book Your Hostel Room Virtually", "Don't worry , no any first come first serve"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            />
          </div>
        </div>
      </section>

      {/* Our Story (Timeline Section) */}
      <section id="our-story" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Title as="h3" className="text-4xl text-slate-900">Our Journey</Title>
            <p className="text-slate-600 mt-4 text-lg font-sans">From a simple idea to a thriving platform.</p>
          </div>
          <div className="relative timeline-container">
            {/* Timeline Item 1 */}
            <div className="timeline-item">
              <div className="timeline-content bg-lime-50 border-l-4 border-lime-400">
                <time className="font-semibold text-lime-800">July 2024</time>
                <h4 className="text-xl font-serif font-bold my-1 text-slate-800">The Spark</h4>
                <p className="text-slate-600 font-sans">HostelNET was born from a shared frustration: finding good Room, reliable hostel accommodation was harder than it needed to be.</p>
              </div>
            </div>
            {/* Timeline Item 2 */}
            <div className="timeline-item">
              <div className="timeline-content bg-sky-50 border-l-4 border-sky-400">
                <time className="font-semibold text-sky-800">June 2025</time>
                <h4 className="text-xl font-serif font-bold my-1 text-slate-800">Platform Launch</h4>
                <p className="text-slate-600 font-sans">After months of development, we launched the first version of our platform.</p>
              </div>
            </div>
            {/* Timeline Item 3 */}
            <div className="timeline-item">
              <div className="timeline-content bg-lime-50 border-l-4 border-lime-400">
                <time className="font-semibold text-lime-800">2025</time>
                <h4 className="text-xl font-serif font-bold my-1 text-slate-800">Ideation Community Features</h4>
                <p className="text-slate-600 font-sans">We introduced roommate matching and event management tools to help build a true sense of community among users.</p>
              </div>
            </div>
             {/* Timeline Item 4 */}
            <div className="timeline-item">
              <div className="timeline-content bg-sky-50 border-l-4 border-sky-400">
                <time className="font-semibold text-sky-800">Today</time>
                <h4 className="text-xl font-serif font-bold my-1 text-slate-800">Looking Ahead</h4>
                <p className="text-slate-600 font-sans">We're continuously innovating, expanding our network, and building new tools to make hostel life better than ever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Title as="h3" className="text-4xl text-slate-900">Meet The Team</Title>
            <p className="text-slate-600 mt-4 text-lg font-sans">The minds behind the mission.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <img className="w-40 h-40 rounded-full mx-auto shadow-lg ring-4 ring-lime-200" src="https://placehold.co/200x200/a7f3d0/14532d?text=AS" alt="Alex Smith"/>
              <h4 className="text-xl font-serif font-bold mt-4 text-slate-900">Akshit sahore</h4>
              <p className="text-slate-500 font-sans">Co-Founder & CEO</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="md:col-span-1">
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">HostelNET</h4>
              <p className="text-gray-400 font-sans">Simplifying hostel living for students and young professionals worldwide.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">Quick Links</h4>
              <ul className="space-y-2 font-sans">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">Contact Us</h4>
              <p className="text-gray-400 font-sans">Email: support@hostelnet.com</p>
              <p className="text-gray-400 font-sans">Phone: +1-800-HOSTEL</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">Follow Us</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.284 2.856 7.92 6.74 9.31.5.093.683-.217.683-.482 0-.237-.008-.868-.013-1.703-2.77.604-3.35-1.342-3.35-1.342-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.068-.608.068-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.34 1.087 2.91.83.09-.645.35-1.086.635-1.337-2.22-.253-4.555-1.113-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.104-.253-.448-1.27.098-2.645 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.908-1.296 2.747-1.026 2.747-1.026.548 1.375.204 2.392.1 2.645.64.698 1.03 1.592 1.03 2.682 0 3.84-2.338 4.687-4.566 4.935.36.308.682.92.682 1.852 0 1.336-.012 2.41-.012 2.736 0 .267.18.577.688.48 3.88-1.39 6.732-5.026 6.732-9.31C22 6.477 17.523 2 12 2z" clipRule="evenodd"></path></svg></a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-700 text-center text-slate-500 font-sans">
            <p>&copy; {new Date().getFullYear()} HostelNET. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');

        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }

        /* Timeline Styles */
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #e2e8f0;
          transform: translateX(-50%);
        }
        .timeline-item {
          position: relative;
          width: 50%;
          padding: 20px 40px;
          box-sizing: border-box;
        }
        .timeline-item:nth-child(odd) {
          left: 0;
          padding-left: 0;
        }
        .timeline-item:nth-child(even) {
          left: 50%;
          padding-right: 0;
        }
        .timeline-item::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          right: -10px;
          background-color: white;
          border: 4px solid #a7f3d0;
          top: 25px;
          border-radius: 50%;
          z-index: 1;
        }
        .timeline-item:nth-child(even)::after {
          left: -10px;
          border-color: #bae6fd;
        }
        .timeline-content {
          padding: 20px 30px;
          position: relative;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
