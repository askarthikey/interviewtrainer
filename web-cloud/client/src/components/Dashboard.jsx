import React from "react";

const Dashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Welcome Section */}
      <section className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Welcome back, <span className="text-indigo-600">User</span> 👋
        </h2>
        <p className="text-gray-600 mt-3 text-lg">
          Ready to <span className="font-semibold text-indigo-500">ace</span> your next interview?
        </p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Last Interview */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <button className="w-full border border-gray-300 p-5 rounded-xl flex items-center justify-center font-semibold text-gray-700 hover:bg-gray-50 transition">
              ⚠ Last Interview Result
            </button>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              Short summary of the interview goes here. Highlight strengths and weaknesses clearly
              for better feedback.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <button className="p-5 bg-indigo-500 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-600 transition transform hover:-translate-y-1 hover:scale-105">
              Start Interview
            </button>
            <button className="p-5 bg-gray-100 rounded-xl font-semibold text-gray-700 shadow hover:bg-gray-200 transition transform hover:-translate-y-1 hover:scale-105">
              Previous Insights
            </button>
            <button className="p-5 bg-gray-100 rounded-xl font-semibold text-gray-700 shadow hover:bg-gray-200 transition transform hover:-translate-y-1 hover:scale-105">
              Check Recording
            </button>
            <button className="p-5 bg-gray-100 rounded-xl font-semibold text-gray-700 shadow hover:bg-gray-200 transition transform hover:-translate-y-1 hover:scale-105">
              Analyze Resume
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <p className="text-sm text-gray-500">Recent Activity</p>
            <p className="text-gray-800 font-medium mt-2">
              Last Practiced:{" "}
              <span className="text-indigo-600 font-semibold">2 days ago</span>
            </p>
          </div>

          {/* Performance Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <p className="font-semibold text-gray-700 mb-3 text-lg">
              📊 Performance Summary
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium text-gray-800">Accuracy Rate:</span>{" "}
                75%
              </li>
              <li>
                <span className="font-medium text-gray-800">Weakest Areas:</span>{" "}
                Topic Name
              </li>
              <li>
                <span className="font-medium text-gray-800">Average Score:</span>{" "}
                7.8
              </li>
            </ul>
          </div>

          {/* Badges */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <p className="font-semibold text-gray-700 mb-4">🏅 Badges Earned</p>
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center text-3xl shadow-md hover:scale-110 transition">
                🏅
              </div>
              <div className="w-16 h-16 bg-green-300 rounded-full flex items-center justify-center text-3xl shadow-md hover:scale-110 transition">
                ✅
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-10 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-gray-700 font-medium">
          🔥 Recommended For You: You’ve struggled with{" "}
          <span className="font-bold text-yellow-700">TOPIC_NAME</span> – Try
          these <span className="text-indigo-600 font-bold">5 practice problems</span>.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
