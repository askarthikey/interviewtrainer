import { useState, useEffect } from 'react';
import { LayoutDashboard, User, BarChart, LineChart, PieChart, FileText } from 'lucide-react';

// Main App component that renders the entire application
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // A useEffect hook to simulate fetching data
  useEffect(() => {
    // Simulate a network request with a 2-second delay
    const timer = setTimeout(() => {
      setData({
        topicsCovered: ['Data Structures', 'Algorithms', 'System Design', 'Behavioral Questions'],
        topicAnalysis: [
          { topic: 'Data Structures', score: 85, analysis: 'Strong understanding of core concepts. Could practice more complex tree and graph problems.' },
          { topic: 'Algorithms', score: 92, analysis: 'Excellent performance on dynamic programming and greedy algorithms. Showed creative problem-solving skills.' },
          { topic: 'System Design', score: 70, analysis: 'Good high-level overview. Needs more depth on specific components like load balancing and databases.' },
        ],
        progress: [10, 20, 35, 50, 75, 90], // Dummy data for the line chart
        summary: 'The candidate demonstrated a solid foundation in both technical and soft skills. Strengths include a strong grasp of algorithms and problem-solving. Areas for improvement involve a deeper dive into system design principles.',
        pros: [
          'Strong problem-solving ability',
          'Clear and concise communication',
          'Excellent grasp of core algorithms',
          'Good command of C++ (as mentioned by the user!)'
        ],
        cons: [
          'Limited experience with distributed systems',
          'Could provide more detailed examples from past projects',
          'Initial hesitation on a few conceptual questions'
        ],
        suggestions: 'Recommend a follow-up interview focused on a deep-dive system design problem. Encourage a review of common design patterns and trade-offs. Additionally, provide resources for a quick refresher on advanced tree traversals.',
      });
      setLoading(false);
    }, 2000);

    // Clean up the timer to prevent memory leaks
    return () => clearTimeout(timer);
  }, []);

  // Conditional rendering for the loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-xl">Analyzing interview data...</p>
        </div>
      </div>
    );
  }

  // Once data is loaded, render the dashboard
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen font-inter p-4 sm:p-8">
      {/* Header Section */}

      {/* Main Content Area */}
      <div className="space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Interview Analyzer</h1>

        {/* Chart and Analysis Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-200 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Topics Covered</h2>
            <div className="w-full flex-grow flex items-center justify-center">
              <div className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-full border-4 border-blue-600">
                <PieChart className="w-16 h-16 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-200 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Topic-wise Analysis</h2>
            <div className="w-full h-48 flex-grow flex items-end justify-around p-4 space-x-2">
              <div className="w-8 bg-blue-600 rounded-t-full h-1/2"></div>
              <div className="w-8 bg-blue-600 rounded-t-full h-3/4"></div>
              <div className="w-8 bg-blue-600 rounded-t-full h-1/4"></div>
            </div>
          </div>

          <div className="p-6 bg-gray-200 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Progress</h2>
            <div className="w-full h-48 flex-grow flex items-end justify-center">
              <LineChart className="w-full h-full text-blue-600" />
            </div>
          </div>
        </section>

        {/* Summary, Pros & Cons, and Suggestions Sections */}
        <section className="space-y-6">
          <div className="p-6 bg-gray-200 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Brief Summary</h2>
            <p className="text-gray-600 leading-relaxed">{data.summary}</p>
          </div>

          <div className="p-6 bg-gray-200 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Pros & Cons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-green-600 mb-2">Pros</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {data.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-600 mb-2">Cons</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {data.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-200 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Suggestions</h2>
            <p className="text-gray-600 leading-relaxed">{data.suggestions}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
