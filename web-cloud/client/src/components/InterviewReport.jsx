import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle2, XCircle, AlertCircle, BarChart3 } from 'lucide-react';

// Get API URL from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function InterviewReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Please log in to view reports');
        setLoading(false);
        return;
      }
      
      // Get the interview ID from location state or fetch latest
      const interviewId = location.state?.interviewId;
      
      const endpoint = interviewId 
        ? `${API_BASE_URL}/api/interview-report/${interviewId}`
        : `${API_BASE_URL}/api/interview-report/latest`;
      
      console.log('Fetching from:', endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch report data');
      }

      const data = await response.json();
      console.log('Report data:', data);
      setReportData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Analyzing interview data...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Report</h2>
          <p className="text-gray-600 mb-6">{error || 'No interview data found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Use analysisResult instead of geminiResponse
  const { analysisResult, createdAt, role, difficulty } = reportData;

  console.log('Analysis Result:', analysisResult);

  // Ensure arrays exist with fallbacks
  const safeResponse = {
    overallScore: analysisResult?.overallScore || 0,
    clarityScore: analysisResult?.clarityScore || 0,
    technicalScore: analysisResult?.technicalScore || 0,
    feedback: analysisResult?.feedback || 'No feedback available',
    strengths: Array.isArray(analysisResult?.strengths) ? analysisResult.strengths : [],
    improvements: Array.isArray(analysisResult?.improvements) ? analysisResult.improvements : [],
    mistakes: Array.isArray(analysisResult?.mistakes) ? analysisResult.mistakes : [],
    recommendations: Array.isArray(analysisResult?.recommendations) ? analysisResult.recommendations : []
  };

  console.log('Safe response:', safeResponse);

  // Calculate percentage for visual representation
  const getScorePercentage = (score) => Math.min((score / 10) * 100, 100);
  const getScoreColor = (score) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getBarColor = (score) => {
    if (score >= 7) return 'bg-green-600';
    if (score >= 4) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">Interview Report</h1>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Interview Details */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500">Role:</span>
              <span className="ml-2 font-medium text-gray-900">{role || 'N/A'}</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div>
              <span className="text-gray-500">Difficulty:</span>
              <span className={`ml-2 font-medium ${
                difficulty === 'easy' ? 'text-green-600' :
                difficulty === 'medium' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Overall Score */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Overall Score</span>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(safeResponse.overallScore)}`}>
              {safeResponse.overallScore}/10
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getBarColor(safeResponse.overallScore)}`}
                style={{ width: `${getScorePercentage(safeResponse.overallScore)}%` }}
              ></div>
            </div>
          </div>

          {/* Clarity Score */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Clarity Score</span>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(safeResponse.clarityScore)}`}>
              {safeResponse.clarityScore}/10
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getBarColor(safeResponse.clarityScore)}`}
                style={{ width: `${getScorePercentage(safeResponse.clarityScore)}%` }}
              ></div>
            </div>
          </div>

          {/* Technical Score */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Technical Score</span>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(safeResponse.technicalScore)}`}>
              {safeResponse.technicalScore}/10
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getBarColor(safeResponse.technicalScore)}`}
                style={{ width: `${getScorePercentage(safeResponse.technicalScore)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: 'Overall Performance', score: safeResponse.overallScore },
              { label: 'Communication Clarity', score: safeResponse.clarityScore },
              { label: 'Technical Knowledge', score: safeResponse.technicalScore }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>
                    {item.score}/10
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getBarColor(item.score)}`}
                    style={{ width: `${getScorePercentage(item.score)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {safeResponse.feedback}
          </p>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Strengths</h2>
            </div>
            {safeResponse.strengths.length > 0 ? (
              <ul className="space-y-3">
                {safeResponse.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No strengths recorded</p>
            )}
          </div>

          {/* Areas for Improvement */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Areas for Improvement</h2>
            </div>
            {safeResponse.improvements.length > 0 ? (
              <ul className="space-y-3">
                {safeResponse.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No improvements recorded</p>
            )}
          </div>
        </div>

        {/* Mistakes */}
        {safeResponse.mistakes && safeResponse.mistakes.length > 0 && (
          <div className="border border-red-200 rounded-lg p-6 mb-8 bg-red-50">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Common Mistakes</h2>
            </div>
            <ul className="space-y-3">
              {safeResponse.mistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {safeResponse.recommendations && safeResponse.recommendations.length > 0 && (
          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
            </div>
            <ul className="space-y-3">
              {safeResponse.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/start-interview')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
          >
            Take Another Interview
          </button>
          <button
            onClick={() => navigate('/recordings')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            View Recordings
          </button>
        </div>
      </div>
    </div>
  );
}


// A helper component to dynamically render the Bar Chart
const ScoreBarChart = ({ topicAnalysis }) => {
  const maxScore = 100;
  const navigate = useNavigate();
  return (
    <div className="flex w-full h-48 items-end justify-around p-4 space-x-4">
      {topicAnalysis.map((item) => {
        const heightPercentage = `${(item.score / maxScore) * 100}%`;
        const barColor = item.score > 80 ? 'bg-green-500' : item.score > 60 ? 'bg-yellow-500' : 'bg-red-500';

        return (
          <div key={item.topic} className="flex flex-col items-center group cursor-help">
            <div
              style={{ height: heightPercentage }}
              className={`w-10 ${barColor} rounded-t-lg transition-all duration-500 ease-out shadow-md hover:shadow-xl`}
            ></div>
            <p className="text-xs mt-2 text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-10 text-center" title={item.topic}>
              {item.topic.split(' ')[0]}
            </p>
            {/* Tooltip on hover */}
            <span className="absolute bottom-full mb-2 hidden group-hover:block px-3 py-1 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
              {item.topic}: {item.score}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

// A helper component to dynamically render a simple Line Chart using SVG
const ProgressLineChart = ({ progress }) => {
  if (!progress || progress.length < 2) {
    return <div className="text-center text-gray-500">Not enough data to draw line chart.</div>;
  }
  
  const maxProgress = 100;
  const points = progress.map((value, index) => {
    const x = (index / (progress.length - 1)) * 100;
    // In SVG, Y=0 is the top, so we subtract from maxProgress (100)
    const y = maxProgress - (value / maxProgress) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      {/* Line connecting the points */}
      <polyline
        fill="none"
        stroke="#3b82f6" // Tailwind's blue-500
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Points (Circles) */}
      {progress.map((value, index) => {
        const cx = (index / (progress.length - 1)) * 100;
        const cy = maxProgress - (value / maxProgress) * 100;
        return (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r="2"
            fill="#1e40af" // Tailwind's blue-800 for the points
          />
        );
      })}
      {/* Horizontal lines for context (e.g., 50% and 100%) */}
      <line x1="0" y1="50" x2="100" y2="50" stroke="#d1d5db" strokeDasharray="1,1" strokeWidth="0.5" />
      <text x="0" y="52" fill="#6b7280" fontSize="4" dominantBaseline="hanging">50%</text>
    </svg>
  );
};
