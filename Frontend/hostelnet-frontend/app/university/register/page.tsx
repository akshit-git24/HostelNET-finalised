'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
// RegisterCard removed

const UniversityRegisterPage: React.FC = () => {
  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Confirmpassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [universityLocation, setUniversityLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (password !== Confirmpassword) {
      setMessage('Password does not match');
      return;
    }

    const UserData = new FormData();
    const formData = new FormData();
    // formData.append('username', username); // Removed
    UserData.append('email', email);
    UserData.append('password', password);
    formData.append('contact_number', phoneNumber);
    formData.append('university_name', universityName);
    formData.append('location', universityLocation);
    UserData.append('role', 'University'); // Required for Auth
    if (file) formData.append('documents', file);
    console.log("User Data:", UserData);
    console.log("Form Data:", formData);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        body: UserData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`University User Created successfully! Uni ID: ${data.user_id}.Note down the ID for login purpose.`);

        // Only call allocation service if Auth succeeded
        const response = await fetch(`${baseUrl}/university/register`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${data.access_token}`, // Add Token
          },
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          setMessage2(`University registered successfully!`);
        } else {
          const errorData = await response.json();
          setMessage2(`Error: ${errorData.detail || 'Allocation Registration failed.'}`);
        }

      } else {
        setMessage(`Error: ${data.detail || 'Registration failed.'}`);
      }

    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
      <Header />

      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-teal-50">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">

          <div className="text-center md:text-left animate-fade-in-up">
            <h2 className="font-serif text-4xl md:text-5xl text-green-900 leading-tight">
              Register Your University
            </h2>

            <p className="mt-4 text-lg text-green-700 font-sans">
              Join our platform to manage student housing, verify profiles, and create a seamless
              hostel experience for your institution.
            </p>

            <div className="hidden md:block mt-8 w-full max-w-sm h-48 bg-green-100 rounded-lg relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-200/80 rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-200/80 rounded-lg transform rotate-12"></div>
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-300">
            <div className="bg-white rounded-xl shadow-xl border-t-4 border-green-400 p-8 sm:p-12">
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <h3 className="font-serif text-3xl text-center text-green-900">
                  University Sign Up
                </h3>
                <div className="space-y-4">
                  {/* Username Removed - Auto Generated */}
                  {/*
                  <div>
                    <label className="block text-sm font-medium text-green-800">Username</label>
                    <input ... />
                  </div>
                  */}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-green-800">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="official@university.edu"
                    />
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-green-800">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-800">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={Confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-green-800">Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1 w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* University Name */}
                  <div>
                    <label className="block text-sm font-medium text-green-800">University Name</label>
                    <input
                      type="text"
                      required
                      value={universityName}
                      onChange={(e) => setUniversityName(e.target.value)}
                      className="mt-1 w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Institute of Technology"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-green-800">Location</label>
                    <input
                      type="text"
                      value={universityLocation}
                      onChange={(e) => setUniversityLocation(e.target.value)}
                      className="mt-1 w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="City, State"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-green-800">Verification Document</label>
                    <div className="mt-1 flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p className="mb-2 text-sm text-green-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-green-600">PDF, PNG, JPG (MAX. 5MB)</p>
                          {file && <p className="mt-2 text-sm font-medium text-green-800">Selected: {file.name}</p>}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                      </label>
                    </div>
                  </div>

                  {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.toLowerCase().includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {message}
                    </div>
                  )}
                  {message2 && (
                    <div className={`p-4 rounded-lg text-sm ${message2.toLowerCase().includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {message2}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/30"
                  >
                    Complete Registration
                  </button>
                </div>

                {/* {message && (
                  <p
                    className={`text-center font-sans pt-2 ${
                      message.toLowerCase().includes('success')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {message}
                  </p>
                )} */}

                <p className="text-center text-sm font-sans text-green-700 pt-4">
                  Already registered?{' '}
                  <a
                    href="/university/login"
                    className="font-medium text-green-600 hover:text-green-500 transition-colors"
                  >
                    Log in
                  </a>
                </p>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityRegisterPage;
