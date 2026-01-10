'use client';
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation';

const UniversityDashboard: React.FC = () => {
    const router = useRouter();
    const [profile, setProfile] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    // Navigation & View States
    const [activeTab, setActiveTab] = React.useState('details');
    const [viewMode, setViewMode] = React.useState<'list' | 'student_form' | 'hostel_form'>('list');

    // Form States
    const [studentData, setStudentData] = React.useState({ name: '', email: '', contact_number: '', password: '', confirm_password: '', is_disabled: false });
    const [hostelData, setHostelData] = React.useState({ name: '', location: '', contact_number: '', capacity: '', password: '', email: '', owner_name: '', confirm_password: '' });
    const [formMessage, setFormMessage] = React.useState('');
    const [formMessage1, setFormMessage1] = React.useState('');

    // Data Lists
    const [studentsList, setStudentsList] = React.useState<any[]>([]);
    const [hostelsList, setHostelsList] = React.useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/university/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
                const res = await fetch(`${baseUrl}/university/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setProfile(data);
                } else {
                    // Token might be invalid
                    handleLogout();
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/university/login');
    };

    const handleStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

        if (studentData.password !== studentData.confirm_password) {
            setFormMessage("Passwords do not match");
            return;
        }

        try {
            const UniData = new FormData();
            const formData = new FormData();
            UniData.append('name', studentData.name);
            formData.append('email', studentData.email);
            UniData.append('contact_number', studentData.contact_number);
            formData.append('password', studentData.password);
            formData.append('role', 'Student');

            const res = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            console.log(data)
            if (res.ok) {
                setFormMessage(`Success! Student ID: ${data.user_id}`);

            } else {
                setFormMessage('Failed to register student.');
                return;
            }

            console.log("Here is the data : ", data);
            UniData.append('user_id', data.userId);
            UniData.append('is_disabled', studentData.is_disabled.toString());

            const response = await fetch(`${baseUrl}/student/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: UniData
            });
            const uniData = await response.json();
            if (response.ok) {
                setFormMessage1(`Success! Student ID: ${uniData.student_id}`);
                setStudentData({ name: '', email: '', contact_number: '', password: '', confirm_password: '', is_disabled: false });
            } else {
                setFormMessage1('Failed to register student.');
            }
        } catch (err) {
            console.error(err);
            setFormMessage('Error occurred.');
        }
    };

    const handleHostelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (hostelData.password !== hostelData.confirm_password) {
            setFormMessage("Passwords do not match");
            return;
        }

        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

        try {
            const authFormData = new FormData();
            authFormData.append('email', hostelData.email);
            authFormData.append('password', hostelData.password);
            authFormData.append('role', 'Hostel');

            const authRes = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: authFormData
            });

            if (!authRes.ok) {
                const errorData = await authRes.json();
                setFormMessage(`Auth Error: ${errorData.error || 'Failed to create user account'}`);
                return;
            }

            const authData = await authRes.json();
            const userId = authData.userId;

            // 2. Register with Allocation Service
            const formData = new FormData();
            formData.append('name', hostelData.name);
            formData.append('location', hostelData.location);
            formData.append('contact_number', hostelData.contact_number);
            formData.append('capacity', hostelData.capacity);
            formData.append('user_id', userId);
            formData.append('owner_name', hostelData.owner_name);

            const res = await fetch(`${baseUrl}/hostel/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setFormMessage(`Success! Hostel ID: ${authData.user_id}`);
                setHostelData({ name: '', location: '', contact_number: '', capacity: '', password: '', email: '', owner_name: '', confirm_password: '' });
                fetchHostels(); // Refresh list
            } else {
                setFormMessage('Failed to register hostel details.');
            }
        } catch (err) {
            console.error(err);
            setFormMessage('Error occurred.');
        }
    };

    const fetchStudents = async () => {
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
        try {
            const res = await fetch(`${baseUrl}/student/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStudentsList(data);
                console.log("Students List : ", data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHostels = async () => {
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
        try {
            const res = await fetch(`${baseUrl}/hostel/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHostelsList(data);
                console.log("Hostels List : ", data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssignHostel = async (studentId: number, hostelId: string) => {
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

        try {
            const res = await fetch(`${baseUrl}/student/${studentId}/assign_hostel`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hostel_id: parseInt(hostelId) })
            });
            if (res.ok) {
                alert("Hostel assigned successfully");
                fetchStudents();
            } else {
                alert("Failed to assign hostel");
            }
        } catch (error) {
            console.error(error);
            alert("Error assigning hostel");
        }
    };

    useEffect(() => {
        if (activeTab === 'students') {
            fetchStudents();
            fetchHostels();
        } else if (activeTab === 'hostels') {
            fetchHostels();
        }
    }, [activeTab]);

    if (loading) return <div>Loading...</div>;

    if (profile && !profile.is_verified) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
                <Header />
                <main className="min-h-[calc(100vh-140px)] flex items-center justify-center p-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-md max-w-2xl w-full">
                        <div className="flex justify-between">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg leading-6 font-medium text-yellow-800">
                                        Approval Pending
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Your university account ({profile.uni_id}) is currently pending approval.
                                            You will not be able to access the dashboard features until an administrator verifies your documents.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="text-yellow-800 hover:text-yellow-600 font-medium">Logout</button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
            <Header />

            <main className="min-h-[calc(100vh-140px)] p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header & Logout */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-serif text-green-900">University Dashboard</h1>
                            <p className="text-gray-600">Welcome, {profile.university?.name} ({profile.uni_username})</p>
                        </div>

                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">Logout</button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-200 mb-8">
                        <button
                            className={`py-2 px-4 font-medium transition-colors ${activeTab === 'details' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setActiveTab('details'); setViewMode('list'); setFormMessage(''); }}
                        >
                            Details
                        </button>
                        <button
                            className={`py-2 px-4 font-medium transition-colors ${activeTab === 'registration' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setActiveTab('registration'); setViewMode('list'); setFormMessage(''); }}
                        >
                            Registration
                        </button>
                        <button
                            className={`py-2 px-4 font-medium transition-colors ${activeTab === 'students' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setActiveTab('students'); setFormMessage(''); }}
                        >
                            Students
                        </button>
                        <button
                            className={`py-2 px-4 font-medium transition-colors ${activeTab === 'hostels' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setActiveTab('hostels'); setFormMessage(''); }}
                        >
                            Hostels
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-lg shadow-md p-6">

                        {/* DETAILS TAB */}
                        {activeTab === 'details' && (
                            <div>
                                <h2 className="text-xl font-bold text-green-800 mb-4">University Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Placeholder for future details/charts */}
                                    <div className="p-4 bg-gray-50 rounded border">
                                        <h3 className="font-semibold text-gray-700">Registered Students</h3>
                                        <p className="text-2xl font-bold text-green-600">0</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded border">
                                        <h3 className="font-semibold text-gray-700">Registered Hostels</h3>
                                        <p className="text-2xl font-bold text-green-600">0</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REGISTRATION TAB */}
                        {activeTab === 'registration' && viewMode === 'list' && (
                            <div>
                                <h2 className="text-xl font-bold text-green-800 mb-6">Select Registration Type</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Student Registration Card */}
                                    <div
                                        onClick={() => setViewMode('student_form')}
                                        className="cursor-pointer group p-6 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                                            <svg className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Student Registration</h3>
                                        <p className="text-gray-500">Register new students to your university database.</p>
                                    </div>

                                    {/* Hostel Registration Card */}
                                    <div
                                        onClick={() => setViewMode('hostel_form')}
                                        className="cursor-pointer group p-6 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                                            <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Hostel Registration</h3>
                                        <p className="text-gray-500">Add new hostel facilities and manage capacities.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STUDENT FORM */}
                        {viewMode === 'student_form' && (
                            <div className="max-w-lg mx-auto">
                                <button onClick={() => { setViewMode('list'); setFormMessage(''); }} className="mb-4 text-sm text-gray-500 hover:text-gray-800">← Back to Options</button>
                                <h2 className="text-2xl font-bold text-green-800 mb-6">Register Student</h2>
                                {formMessage && <div className={`p-3 rounded mb-4 ${formMessage.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{formMessage}</div>}
                                {formMessage1 && <div className={`p-3 rounded mb-4 ${formMessage1.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{formMessage1}</div>}
                                <form onSubmit={handleStudentSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input required type="text" value={studentData.name} onChange={e => setStudentData({ ...studentData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input required type="email" value={studentData.email} onChange={e => setStudentData({ ...studentData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input required type="text" value={studentData.contact_number} onChange={e => setStudentData({ ...studentData, contact_number: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input required type="password" value={studentData.password} onChange={e => setStudentData({ ...studentData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <input required type="password" value={studentData.confirm_password} onChange={e => setStudentData({ ...studentData, confirm_password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="is_disabled"
                                            type="checkbox"
                                            checked={studentData.is_disabled}
                                            onChange={e => setStudentData({ ...studentData, is_disabled: e.target.checked })}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_disabled" className="ml-2 block text-sm text-gray-900">
                                            Student has a disability (Priority Allocation)
                                        </label>
                                    </div>
                                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">Register Student</button>
                                </form>
                            </div>
                        )}

                        {/* HOSTEL FORM */}
                        {viewMode === 'hostel_form' && (
                            <div className="max-w-lg mx-auto">
                                <button onClick={() => { setViewMode('list'); setFormMessage(''); }} className="mb-4 text-sm text-gray-500 hover:text-gray-800">← Back to Options</button>
                                <h2 className="text-2xl font-bold text-blue-800 mb-6">Register Hostel</h2>
                                {formMessage && <div className={`p-3 rounded mb-4 ${formMessage.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{formMessage}</div>}
                                <form onSubmit={handleHostelSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                                        <input required type="text" value={hostelData.name} onChange={e => setHostelData({ ...hostelData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                        <input required type="text" value={hostelData.owner_name} onChange={e => setHostelData({ ...hostelData, owner_name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input required type="text" value={hostelData.location} onChange={e => setHostelData({ ...hostelData, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input required type="email" value={hostelData.email} onChange={e => setHostelData({ ...hostelData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input required type="text" value={hostelData.contact_number} onChange={e => setHostelData({ ...hostelData, contact_number: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                        <input required type="number" value={hostelData.capacity} onChange={e => setHostelData({ ...hostelData, capacity: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input required type="password" value={hostelData.password} onChange={e => setHostelData({ ...hostelData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <input required type="password" value={hostelData.confirm_password} onChange={e => setHostelData({ ...hostelData, confirm_password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">Register Hostel</button>
                                </form>
                            </div>
                        )}

                        {/* STUDENTS TAB */}
                        {activeTab === 'students' && (
                            <div>
                                <h2 className="text-xl font-bold text-green-800 mb-6">Enrolled Students</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {studentsList.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{student.student_uni_id}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-700">{student.name}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-700">{student.email}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-700">
                                                        <select
                                                            className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                                            value={student.hostel_id || ""}
                                                            onChange={(e) => handleAssignHostel(student.id, e.target.value)}
                                                        >
                                                            <option value="" disabled>Select Hostel</option>
                                                            {hostelsList.map((h) => (
                                                                <option key={h.id} value={h.id}>{h.name} ({h.hostel_id})</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                            {studentsList.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="py-4 px-6 text-center text-sm text-gray-500">No students found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* HOSTELS TAB */}
                        {activeTab === 'hostels' && (
                            <div>
                                <h2 className="text-xl font-bold text-green-800 mb-6">Hostel Facilities</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {hostelsList.map((hostel) => (
                                        <div key={hostel.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-gray-900">{hostel.name}</h3>
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{hostel.hostel_id}</span>
                                            </div>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p><span className="font-semibold">Location:</span> {hostel.location}</p>
                                                <p><span className="font-semibold">Capacity:</span> {hostel.capacity}</p>
                                                <p><span className="font-semibold">Contact:</span> {hostel.contact_number}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {hostelsList.length === 0 && (
                                        <p className="col-span-full text-center text-gray-500">No hostels registered.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UniversityDashboard;
