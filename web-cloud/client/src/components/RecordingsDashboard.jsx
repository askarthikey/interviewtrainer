import { useState } from 'react';
import { LayoutDashboard, User, ChevronLeft, ChevronRight, Filter, PlayCircle, Video } from 'lucide-react';

// Main App component that renders the entire application
export default function RecordingsDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all');

  // Dummy data for the interview recordings
  const recordings = [
    { id: 1, title: 'Interview with John Doe', date: '2025-03-15' },
    { id: 2, title: 'Interview with Jane Smith', date: '2025-03-10' },
    { id: 3, title: 'Interview with Bob Johnson', date: '2025-03-05' },
    { id: 4, title: 'Interview with Alice Williams', date: '2025-03-01' },
    { id: 5, title: 'Interview with Charlie Brown', date: '2025-02-28' },
    { id: 6, title: 'Interview with Lucy Van Pelt', date: '2025-02-25' },
    { id: 7, title: 'Interview with Schroeder', date: '2025-02-20' },
    { id: 8, title: 'Interview with Peppermint Patty', date: '2025-02-18' },
    { id: 9, title: 'Interview with Linus', date: '2025-02-15' },
  ];

  // Logic to handle filter
  const filteredRecordings = recordings.filter(rec => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const lastMonth = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    
    switch (filter) {
      case 'today':
        return rec.date === today;
      case 'yesterday':
        return rec.date === yesterday;
      case 'last week':
        return new Date(rec.date) > new Date(lastWeek);
      case 'last month':
        return new Date(rec.date) > new Date(lastMonth);
      default:
        return true;
    }
  });

  // Calendar related functions
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    for (let i = 1; i <= numDays; i++) {
      calendarDays.push(
        <div key={`day-${i}`} className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-blue-200">
          {i}
        </div>
      );
    }
    return calendarDays;
  };

  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen font-inter p-4 sm:p-8">
      {/* Header Section */}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Recordings Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-gray-800">Interview Recordings</h1>
            <div className="flex items-center space-x-4">
              <span className="text-lg text-gray-600 font-medium">Date: </span>
              <span className="text-lg text-gray-800 font-semibold">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecordings.map(recording => (
              <div key={recording.id} className="relative aspect-video bg-gray-300 rounded-xl overflow-hidden shadow-lg flex items-center justify-center group">
                <PlayCircle className="absolute w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition duration-300 cursor-pointer" />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <span className="block text-sm font-semibold truncate">{recording.title}</span>
                  <span className="block text-xs text-gray-300">{recording.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Filter Section */}
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
          
          {/* Calendar Section */}
          <div className="p-6 bg-gray-200 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4 text-gray-700 font-semibold text-xl">
              <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-300 transition duration-200">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
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
            <div className="grid grid-cols-7 text-center">
              {renderCalendar()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
