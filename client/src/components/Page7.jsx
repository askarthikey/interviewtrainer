import { Star, CheckCircle } from "lucide-react";

export default function Page7() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Welcome */}
      <header className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-indigo-400">User 👋</span>
        </h1>
        <p className="text-gray-400">Ready to ace your next interview?</p>
      </header>

      {/* Two-column layout */}
      <section className="grid md:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="md:col-span-2 space-y-6">
          {/* Last Interview Result */}
          <div className="bg-white/10 border border-gray-600 rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2">
              ⚠️ Last Interview Result
            </h3>
            <p className="text-gray-400 mt-1">
              Short summary of the interview
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold text-white">
              Start Interview
            </button>
            <button className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold text-white">
              Previous Insights
            </button>
            <button className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold text-white">
              Check Recording
            </button>
            <button className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold text-white">
              Analyze Resume
            </button>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white/10 border border-gray-600 rounded-lg p-4">
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="text-gray-400">Last Practiced: 2 days ago</p>
          </div>

          {/* Performance Summary */}
          <div className="bg-white/10 border border-gray-600 rounded-lg p-4">
            <h3 className="font-semibold">Performance Summary</h3>
            <p>Accuracy Rate: <b>75%</b></p>
            <p>Weakest Areas: Topic Name</p>
            <p>Average Score: 7.8</p>
          </div>

          {/* Badges */}
          <div className="bg-white/10 border border-gray-600 rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">Badges Earned 🏅</h3>
            <div className="flex items-center justify-center gap-6 text-4xl">
              <Star className="text-yellow-400 w-10 h-10" />
              <CheckCircle className="text-green-500 w-10 h-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Footer */}
      <footer className="bg-white/10 border border-gray-600 rounded-lg p-4 text-center">
        <p className="font-semibold">Recommended For You</p>
        <p className="text-gray-300">
          You’ve struggled with <span className="text-indigo-400">TOPIC_NAME</span> · Try these 5 problems
        </p>
      </footer>
    </main>
  );
}
