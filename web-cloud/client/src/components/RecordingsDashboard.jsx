import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

export default function RecordingsDashboard() {
  const [recordings, setRecordings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetch("http://localhost:5000/api/recordings")
      .then((res) => res.json())
      .then((data) => {
        // Keep only recordings with a valid path
        const existing = data.filter((rec) => rec.path);
        setRecordings(existing);
      })
      .catch((err) => console.error("Error fetching recordings:", err));
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecordings.map((rec) => (
              <div
                key={rec._id}
                className="relative aspect-video bg-gray-300 rounded-xl overflow-hidden shadow-lg flex items-center justify-center group"
              >
                <PlayCircle className="absolute w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition duration-300 cursor-pointer" />
                <video
                  src={`http://localhost:5000${rec.path}`}
                  controls
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.mp4"; // fallback video
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
            ))}
          </div>
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
    </div>
  );
}
