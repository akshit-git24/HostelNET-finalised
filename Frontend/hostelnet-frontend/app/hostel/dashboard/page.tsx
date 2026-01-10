'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation';

const HostelDashboard: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'allotment' | 'rooms'>('details');

  // Room State
  const [rooms, setRooms] = useState<any[]>([]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'double', capacity: 2, floor: 1 });

  // Allotment State
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  // Room Management State
  const [allotments, setAllotments] = useState<any[]>([]);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<any>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [studentToMove, setStudentToMove] = useState<any>(null);
  const [moveTargetRoomId, setMoveTargetRoomId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/hostel/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
        const res = await fetch(`${baseUrl}/hostel/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          localStorage.removeItem('access_token');
          router.push('/hostel/login');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'details') {
      fetchRooms();
    } else if (activeTab === 'allotment') {
      fetchPendingStudents();
      fetchRooms();
    } else if (activeTab === 'rooms') {
      fetchRooms(); // Need basic room list for dropdowns
      fetchAllotments();
    }
  }, [activeTab]);

  const fetchRooms = async () => {
    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
    try {
      const res = await fetch(`${baseUrl}/hostel/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchPendingStudents = async () => {
    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
    try {
      const res = await fetch(`${baseUrl}/hostel/students/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingStudents(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchAllotments = async () => {
    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';
    try {
      const res = await fetch(`${baseUrl}/hostel/rooms/allotments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllotments(data);

        // Update selected room details if modal is open
        if (selectedRoomDetails) {
          const updated = data.find((r: any) => r.id === selectedRoomDetails.id);
          if (updated) setSelectedRoomDetails(updated);
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

    const formData = new FormData();
    formData.append('room_number', newRoom.room_number);
    formData.append('room_type', newRoom.room_type);
    formData.append('capacity', newRoom.capacity.toString());
    formData.append('floor', newRoom.floor.toString());

    try {
      const res = await fetch(`${baseUrl}/hostel/room/create`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('Room added successfully');
        setShowAddRoom(false);
        setNewRoom({ room_number: '', room_type: 'double', capacity: 2, floor: 1 });
        fetchRooms();
      } else {
        const err = await res.json();
        alert('Failed to add room: ' + err.message);
      }
    } catch (e) { console.error(e); }
  };

  const handleAllocate = async () => {
    if (!selectedStudent || !selectedRoomId) return;
    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

    const formData = new FormData();
    formData.append('student_id', selectedStudent.student_id);
    formData.append('room_id', selectedRoomId);

    try {
      const res = await fetch(`${baseUrl}/hostel/allocate_room`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('Room allocated!');
        setShowAllocateModal(false);
        setSelectedStudent(null);
        setSelectedRoomId('');
        fetchPendingStudents();
        fetchRooms();
      } else {
        const err = await res.json();
        alert('Allocation failed: ' + err.message);
      }
    } catch (e) { console.error(e); }
  };

  const handleDeallocate = async (studentId: any) => {
    if (!confirm("Are you sure you want to remove this student from the room?")) return;

    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

    const formData = new FormData();
    formData.append('student_id', studentId);

    try {
      const res = await fetch(`${baseUrl}/hostel/deallocate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Student deallocated.");
        fetchAllotments();
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (e) { console.error(e); }
  };

  const handleReallocate = async () => {
    if (!studentToMove || !moveTargetRoomId) return;

    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

    const formData = new FormData();
    formData.append('student_id', studentToMove.student_id);
    formData.append('new_room_id', moveTargetRoomId);

    try {
      const res = await fetch(`${baseUrl}/hostel/reallocate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Student moved successfully.");
        setShowMoveModal(false);
        setStudentToMove(null);
        setMoveTargetRoomId('');
        fetchAllotments();
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (e) { console.error(e); }
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="min-h-[calc(100vh-140px)] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-serif text-blue-900 mb-2">Hostel Dashboard</h1>
                {profile && <p className="text-gray-600">Welcome, {profile.name} ({profile.hostel_id})</p>}
              </div>
              <button onClick={() => { localStorage.removeItem('access_token'); router.push('/hostel/login'); }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">Logout</button>
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-4 font-medium transition-colors ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Details & Rooms
              </button>
              <button
                onClick={() => setActiveTab('allotment')}
                className={`py-2 px-4 font-medium transition-colors ${activeTab === 'allotment' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Hostel Allotment
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`py-2 px-4 font-medium transition-colors ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Room Management
              </button>
            </div>

            {/* DETAILS TAB */}
            {activeTab === 'details' && profile && (
              <div className="animate-fadeIn">
                <section className="mb-10">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Hostel Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div><span className="block text-xs font-bold text-blue-800 uppercase">Location</span> {profile.location}</div>
                    <div><span className="block text-xs font-bold text-blue-800 uppercase">Capacity</span> {profile.capacity}</div>
                    <div><span className="block text-xs font-bold text-blue-800 uppercase">Contact</span> {profile.contact_number}</div>
                    <div><span className="block text-xs font-bold text-blue-800 uppercase">University</span> {profile.university}</div>
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Rooms Overview</h2>
                    <button onClick={() => setShowAddRoom(!showAddRoom)} className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded">
                      {showAddRoom ? 'Cancel' : '+ Add Room'}
                    </button>
                  </div>

                  {showAddRoom && (
                    <form onSubmit={handleAddRoom} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                      <h3 className="font-bold mb-3 text-gray-700">New Room</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input placeholder="Room Number (e.g. 101)" required value={newRoom.room_number} onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })} className="p-2 border rounded" />
                        <select value={newRoom.room_type} onChange={e => setNewRoom({ ...newRoom, room_type: e.target.value })} className="p-2 border rounded">
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="triple">Triple</option>
                          <option value="quad">Quad</option>
                        </select>
                        <input type="number" placeholder="Capacity" required value={newRoom.capacity} onChange={e => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })} className="p-2 border rounded" />
                        <input type="number" placeholder="Floor" required value={newRoom.floor} onChange={e => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })} className="p-2 border rounded" />
                      </div>
                      <button type="submit" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded text-sm font-bold">Save Room</button>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {rooms.map((room) => (
                      <div key={room.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-bold text-gray-800">Room {room.room_number}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${room.available_capacity === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {room.available_capacity === 0 ? 'Full' : 'Available'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Type: <span className="capitalize">{room.room_type}</span></p>
                          <p>Floor: {room.floor}</p>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((room.capacity - room.available_capacity) / room.capacity) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                    {rooms.length === 0 && <p className="text-gray-500 col-span-full text-center py-4">No rooms added yet.</p>}
                  </div>
                </section>
              </div>
            )}

            {/* ALLOTMENT TAB */}
            {activeTab === 'allotment' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Allocations</h2>
                <p className="text-sm text-gray-500 mb-4">Students assigned to your hostel by University, but not yet allocated a room. <br /> <span className="text-red-500 font-bold">* Students with disabilities are prioritized.</span></p>

                <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingStudents.map((student) => (
                        <tr key={student.student_id} className={student.is_disabled ? 'bg-yellow-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.is_disabled && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">PWD Priority</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.contact_number}</td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => { setSelectedStudent(student); setShowAllocateModal(true); }}
                              className="text-blue-600 hover:text-blue-900 font-semibold"
                            >
                              Allocate Room
                            </button>
                          </td>
                        </tr>
                      ))}
                      {pendingStudents.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">No pending students found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ROOM MANAGEMENT TAB */}
            {activeTab === 'rooms' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Room Allocations</h2>
                <p className="text-sm text-gray-500 mb-6">View and manage students in each room.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allotments.map(room => (
                    <div key={room.id} onClick={() => { setSelectedRoomDetails(room); setShowRoomModal(true); }} className="bg-white border hover:border-blue-400 cursor-pointer rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600">Room {room.room_number}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">{room.type}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Occupancy</span>
                          <span>{room.capacity - room.available_capacity} / {room.capacity}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${room.available_capacity === 0 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${((room.capacity - room.available_capacity) / room.capacity) * 100}%` }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {room.students.length > 0 ? (
                          room.students.slice(0, 3).map((s: any, i: number) => (
                            <div key={i} className="flex items-center space-x-2 text-sm text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {s.name.charAt(0)}
                              </div>
                              <span className="truncate">{s.name}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic">Empty</p>
                        )}
                        {room.students.length > 3 && <p className="text-xs text-gray-500 pl-8">+{room.students.length - 3} more...</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ALLOCATION MODAL (Existing) */}
            {showAllocateModal && selectedStudent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-start mb-4 border-b pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Allocation Request</h3>
                      <p className="text-sm text-gray-500">Applicant: <span className="font-semibold text-gray-700">{selectedStudent.name}</span></p>
                    </div>
                    {selectedStudent.is_disabled && <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">PWD PRIORITY</span>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-1">Application Details</h4>
                      <div>
                        <span className="block text-xs text-gray-500">Roommate Preference</span>
                        <p className="text-gray-800 text-sm">{selectedStudent.roommate_preference || 'None'}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Remarks</span>
                        <p className="text-gray-800 text-sm">{selectedStudent.remarks || 'None'}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Documents</span>
                        {selectedStudent.documents ? (
                          <a href={`http://localhost:8012${selectedStudent.documents}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center">
                            View Document ↗
                          </a>
                        ) : <span className="text-sm text-gray-400">No documents</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-1 mb-3">Room Selection</h4>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Room</label>
                        <select
                          className="w-full border rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={selectedRoomId}
                          onChange={e => setSelectedRoomId(e.target.value)}
                          size={5}
                        >
                          <option value="" disabled className="text-gray-400">-- Available Rooms --</option>
                          {rooms.filter(r => r.available_capacity > 0).map(r => (
                            <option key={r.id} value={r.id} className="py-1">
                              Room {r.room_number} ({r.room_type}) - Floor {r.floor}
                            </option>
                          ))}
                        </select>
                        {rooms.filter(r => r.available_capacity > 0).length === 0 && <p className="text-red-500 text-xs mt-1">No available rooms!</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => { setShowAllocateModal(false); setSelectedStudent(null); setSelectedRoomId(''); }}
                      className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAllocate}
                      disabled={!selectedRoomId}
                      className={`px-5 py-2 text-white rounded-md transition-shadow font-medium shadow-sm ${selectedRoomId ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' : 'bg-blue-300 cursor-not-allowed'}`}
                    >
                      Confirm Allocation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ROOM DETAILS MODAL */}
            {showRoomModal && selectedRoomDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Room {selectedRoomDetails.room_number}</h3>
                    <button onClick={() => setShowRoomModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>

                  <div className="mb-6 space-y-4">
                    {selectedRoomDetails.students.length > 0 ? (
                      selectedRoomDetails.students.map((student: any) => (
                        <div key={student.student_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.contact_number}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => { setStudentToMove(student); setShowMoveModal(true); }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full tooltip"
                              title="Change Room"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                              </svg>

                            </button>
                            <button
                              onClick={() => handleDeallocate(student.student_id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                              title="Remove Allocation"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No students in this room.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MOVE ROOM MODAL */}
            {showMoveModal && studentToMove && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Change Room</h3>
                  <p className="text-sm text-gray-600 mb-4">Select a new room for <span className="font-semibold">{studentToMove.name}</span></p>

                  <div className="mb-4">
                    <select
                      className="w-full border rounded p-2"
                      value={moveTargetRoomId}
                      onChange={e => setMoveTargetRoomId(e.target.value)}
                    >
                      <option value="">-- Select New Room --</option>
                      {rooms.filter(r => r.available_capacity > 0 && r.id !== selectedRoomDetails?.id).map(r => (
                        <option key={r.id} value={r.id}>Room {r.room_number} (Free: {r.available_capacity})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => { setShowMoveModal(false); setStudentToMove(null); }}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReallocate}
                      disabled={!moveTargetRoomId}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      Confirm Move
                    </button>
                  </div>
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

export default HostelDashboard;
