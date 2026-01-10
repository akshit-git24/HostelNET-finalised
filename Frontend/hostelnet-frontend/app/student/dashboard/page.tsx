'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation';

const StudentDashboard: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/student/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
        const res = await fetch(`${baseUrl}/student/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          localStorage.removeItem('access_token');
          router.push('/student/login');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="min-h-[calc(100vh-140px)] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-serif text-green-900 mb-4">My Dashboard</h1>
              <button onClick={() => { localStorage.removeItem('access_token'); router.push('/student/login'); }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">Logout</button>
            </div>

            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Student Profile</h2>
                  <div className="space-y-3">
                    <p><span className="font-semibold text-gray-600">Name:</span> {profile.name}</p>
                    <p><span className="font-semibold text-gray-600">ID:</span> {profile.student_uni_id}</p>
                    <p><span className="font-semibold text-gray-600">Email:</span> {profile.email}</p>
                    <p><span className="font-semibold text-gray-600">Contact:</span> {profile.contact_number}</p>
                    <p><span className="font-semibold text-gray-600">University:</span> {profile.university}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Hostel Allotment</h2>
                  {profile.hostel ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-green-900">{profile.hostel.name}</h3>
                          {/* <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">{profile.hostel.hostel_id}</span> */}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-green-800">
                        <p><span className="font-semibold">Location:</span> {profile.hostel.location}</p>
                        <p><span className="font-semibold">Contact:</span> {profile.hostel.contact_number}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800 flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      <p>No hostel allotted yet. Please contact your university administration.</p>
                    </div>
                  )}

                  {/* ROOM DETAILS - NEW SECTION */}
                  {profile.room && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-bold text-blue-900 mb-2">Room Details</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><span className="font-semibold">Room Number:</span> {profile.room.room_number}</p>
                        <p><span className="font-semibold">Roommates:</span> {profile.room.roommates.length > 0 ? profile.room.roommates.join(", ") : "None"}</p>
                      </div>
                    </div>
                  )}


                  {/* HOSTEL APPLICATION FORM */}
                  {profile.hostel && !profile.room && (
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Hostel Application</h2>
                      <ApplicationForm profile={profile} />
                    </div>
                  )}

                  {profile.room && (
                    <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
                      <p className="font-semibold">You have officially been allocated to a room. No further application is needed.</p>
                    </div>
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

const ApplicationForm = ({ profile }: { profile: any }) => {
  const [formData, setFormData] = useState({
    student_name: profile.name,
    roommate_preference: '',
    remarks: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('Please upload required documents.');
      return;
    }

    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

    const data = new FormData();
    data.append('student_name', formData.student_name);
    data.append('roommate_preference', formData.roommate_preference);
    data.append('remarks', formData.remarks);
    data.append('documents', file);

    try {
      const res = await fetch(`${baseUrl}/hostel/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        setMessage('Application submitted successfully!');
        setFormData({ ...formData, roommate_preference: '', remarks: '' });
        setFile(null);
      } else {
        setMessage(result.message || 'Failed to submit application.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
      {message && <div className={`p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Student Name</label>
        <input
          type="text"
          value={formData.student_name}
          onChange={e => setFormData({ ...formData, student_name: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Roommate Preference</label>
        <textarea
          value={formData.roommate_preference}
          onChange={e => setFormData({ ...formData, roommate_preference: e.target.value })}
          placeholder="E.g. Prefer quiet roommate, etc."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Remarks</label>
        <textarea
          value={formData.remarks}
          onChange={e => setFormData({ ...formData, remarks: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Documents</label>
        <input
          type="file"
          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </div>
      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
        Submit Application
      </button>
    </form>
  );
};

export default StudentDashboard;
