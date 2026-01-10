'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation';

const UniversityLoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const baseUrl =
                process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

            const res = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok && data.access) {
                // Store tokens
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                setMessage('Login successful!');
                // Redirect to dashboard (adjust path as needed)
                router.push('/university/dashboard');
            } else {
                setMessage(`Error: ${data.detail || data.error || 'Login failed.'}`);
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
                <div className="max-w-md w-full space-y-8 animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-xl border-t-4 border-green-400 p-8">
                        <div>
                            <h2 className="mt-2 text-center text-3xl font-serif text-green-900">
                                University Login
                            </h2>
                            <p className="mt-2 text-center text-sm text-green-700 font-sans">
                                Welcome back! Please sign in to your dashboard.
                            </p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="username" className="sr-only">
                                        University ID
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-600 text-green-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="University ID"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="sr-only">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-600 text-green-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-600 text-green-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`text-sm text-center ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                    {message}
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-green-700">
                                Don't have an account?{' '}
                                <a href="/university/register" className="font-medium text-green-600 hover:text-green-500">
                                    Register here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UniversityLoginPage;
