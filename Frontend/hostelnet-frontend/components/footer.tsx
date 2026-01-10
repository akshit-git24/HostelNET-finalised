import React from 'react'

const Footer = () => {
  return (
    <div><footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="md:col-span-1">
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">HostelNET</h4>
              <p className="text-gray-400 font-sans">Simplifying allotment process, smooth, transparent, and efficient.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">Quick Links</h4>
              <ul className="space-y-2 font-sans">
                <li><a href="/" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">Contact Us</h4>
              <p className="text-gray-400 font-sans">Email: ********@gmail.com</p>
              <p className="text-gray-400 font-sans">Phone: +91-82197*****</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-lime-400 font-serif">Follow Us</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
                  <a href="https://github.com/akshit-git24" className="text-gray-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.284 2.856 7.92 6.74 9.31.5.093.683-.217.683-.482 0-.237-.008-.868-.013-1.703-2.77.604-3.35-1.342-3.35-1.342-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.068-.608.068-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.34 1.087 2.91.83.09-.645.35-1.086.635-1.337-2.22-.253-4.555-1.113-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.104-.253-.448-1.27.098-2.645 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.908-1.296 2.747-1.026 2.747-1.026.548 1.375.204 2.392.1 2.645.64.698 1.03 1.592 1.03 2.682 0 3.84-2.338 4.687-4.566 4.935.36.308.682.92.682 1.852 0 1.336-.012 2.41-.012 2.736 0 .267.18.577.688.48 3.88-1.39 6.732-5.026 6.732-9.31C22 6.477 17.523 2 12 2z" clipRule="evenodd"></path></svg></a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-700 text-center text-slate-500 font-sans">
            <p>&copy; {new Date().getFullYear()} HostelNET. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
