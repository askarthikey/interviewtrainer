// Here recordings will be found
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle, X } from "lucide-react";

// Get API URL from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RecordingsDashboard() {
  const [recordings, setRecordings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      const token = localStorage.getItem('auth_token'); // Fixed: was 'token', now 'auth_token'
      
      console.log('Token exists:', !!token);
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        setError('Please log in to view your recordings');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/recordings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);

        if (response.status === 401) {
          setError('Session expired or invalid. Please log in again.');
          setLoading(false);
          // Clear invalid token
          localStorage.removeItem('auth_token');
          // Optionally redirect to login after 2 seconds
          setTimeout(() => {
            window.location.href = '/signin';
          }, 2000);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched recordings:', data);
        
        // Keep only recordings with a valid path
        const existing = data.filter((rec) => rec.path);
        setRecordings(existing);
        setError(null);
      } catch (err) {
        console.error("Error fetching recordings:", err);
        setError('Failed to load recordings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  // ===== Filter logic =====
  const filteredRecordings = recordings.filter((rec) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const lastMonth = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    const recDate = rec.createdAt.slice(0, 10);

    switch (filter) {
      case "today":
        return recDate === today;
      case "yesterday":
        return recDate === yesterday;
      case "last week":
        return recDate > lastWeek;
      case "last month":
        return recDate > lastMonth;
      default:
        return true;
    }
  });

  // ===== Calendar helpers =====
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    for (let i = 1; i <= numDays; i++)
      calendarDays.push(
        <div
          key={`day-${i}`}
          className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-blue-200"
        >
          {i}
        </div>
      );
    return calendarDays;
  };

  const handlePrevMonth = () => setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const openModal = (recording) => {
    console.log('Opening recording:', recording);
    console.log('Video URL:', recording.url);
    console.log('Video path:', recording.path);
    setSelectedRecording(recording);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecording(null);
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen font-sans p-4 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Recordings */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-gray-800">Interview Recordings</h1>
            <div className="flex items-center space-x-4">
              <span className="text-lg text-gray-600 font-medium">Date: </span>
              <span className="text-lg text-gray-800 font-semibold">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md">
              <p className="font-semibold text-lg">⚠️ {error}</p>
              {error.includes('log in') && (
                <a href="/signin" className="text-blue-600 underline mt-2 inline-block">
                  Go to Sign In
                </a>
              )}
            </div>
          )}

          {/* Recordings Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRecordings.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-xl text-gray-500">No recordings found</p>
                  <p className="text-gray-400 mt-2">Start your first interview to see recordings here!</p>
                </div>
              ) : (
                filteredRecordings.map((rec) => (
                  <div
                    key={rec._id}
                    className="relative aspect-video bg-gray-300 rounded-xl overflow-hidden shadow-lg flex items-center justify-center group cursor-pointer"
                    onClick={() => openModal(rec)}
                  >
                    <PlayCircle className="absolute w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300 z-10" />
                    <video
                      src={rec.url || `${API_BASE_URL}${rec.path}`}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.classList.add('bg-gray-500');
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                      <span className="block text-sm font-semibold truncate">{rec.filename}</span>
                      <span className="block text-xs text-gray-300">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                      <span className="block text-xs text-gray-300">
                        Role: {rec.role}, Difficulty: {rec.difficulty}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Filter */}
          <div className="p-6 bg-gray-200 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter</h2>
            <select
              className="w-full p-2 rounded-lg bg-gray-300 border border-gray-400 text-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">all</option>
              <option value="today">today</option>
              <option value="yesterday">yesterday</option>
              <option value="last week">last week</option>
              <option value="last month">last month</option>
            </select>
          </div>

          {/* Calendar */}
          <div className="p-6 bg-gray-200 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4 text-gray-700 font-semibold text-xl">
              <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-300 transition duration-200">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span>
                {selectedDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-300 transition duration-200">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>
            <div className="grid grid-cols-7 text-center">{renderCalendar()}</div>
          </div>
        </div>
      </div>

      {/* Video Modal - LeetCode Glassmorphism Theme */}
      {isModalOpen && selectedRecording && (
        <div 
          className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-gray-900/80 via-slate-900/80 to-zinc-900/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div 
            className="relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 max-w-6xl w-full max-h-[92vh] overflow-hidden transform transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-50 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md text-white rounded-full p-2.5 transition-all duration-200 border border-red-400/30 hover:border-red-400/50 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header - Glassmorphism */}
            <div className="bg-gradient-to-r from-slate-800/40 via-gray-800/40 to-zinc-800/40 backdrop-blur-xl px-8 py-5 border-b border-white/10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {selectedRecording.filename}
              </h2>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-gray-200 flex items-center gap-2">
                  <span className="text-blue-400">📅</span>
                  {new Date(selectedRecording.createdAt).toLocaleString()}
                </span>
                <span className="px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-lg border border-emerald-400/30 text-emerald-300 flex items-center gap-2">
                  <span>👔</span>
                  {selectedRecording.role}
                </span>
                <span className={`px-3 py-1.5 backdrop-blur-md rounded-lg border flex items-center gap-2 ${
                  selectedRecording.difficulty === 'easy' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                  selectedRecording.difficulty === 'medium' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                  'bg-red-500/20 border-red-400/30 text-red-300'
                }`}>
                  <span>⚡</span>
                  {selectedRecording.difficulty}
                </span>
                {selectedRecording.size && (
                  <span className="px-3 py-1.5 bg-purple-500/20 backdrop-blur-md rounded-lg border border-purple-400/30 text-purple-300 flex items-center gap-2">
                    <span>📦</span>
                    {(selectedRecording.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                )}
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative bg-black/40 backdrop-blur-sm p-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <video
                  key={selectedRecording._id}
                  controls
                  autoPlay
                  className="w-full max-h-[65vh] object-contain bg-black"
                  onError={(e) => {
                    console.error('Video load error:', e);
                    console.error('Attempted URL:', selectedRecording.url || `${API_BASE_URL}${selectedRecording.path}`);
                  }}
                >
                  <source 
                    src={selectedRecording.url || `${API_BASE_URL}${selectedRecording.path}`} 
                    type="video/webm" 
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Modal Footer - Glassmorphism */}
            <div className="bg-gradient-to-r from-slate-800/40 via-gray-800/40 to-zinc-800/40 backdrop-blur-xl px-8 py-5 border-t border-white/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {selectedRecording.bucket && (
                    <span className="px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-lg border border-blue-400/30 text-blue-300 text-sm font-medium">
                      🗄️ {selectedRecording.bucket}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 hover:from-blue-500 hover:to-cyan-500 backdrop-blur-md text-white font-semibold rounded-xl transition-all duration-200 border border-blue-400/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
