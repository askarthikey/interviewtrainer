import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  TrendingUp,
  Target,
  Award,
  Calendar,
  FileText,
  Video,
  Code,
  BookOpen,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Flame,
  Star,
  Zap,
  Brain,
  Users,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch dashboard stats from new API
      const statsRes = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setDashboardData(stats);
      } else {
        console.error("Failed to fetch dashboard stats");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  // Chart configurations with user-friendly colors
  const performanceData = {
    labels: ["3 Weeks Ago", "2 Weeks Ago", "Last Week", "This Week"],
    datasets: [
      {
        label: "Performance Score",
        data: dashboardData?.performanceTrend || [0, 0, 0, 0],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const skillsData = {
    labels: ["Technical", "Communication", "Problem Solving", "Confidence"],
    datasets: [
      {
        data: [
          dashboardData?.skillsBreakdown?.technical || 0,
          dashboardData?.skillsBreakdown?.communication || 0,
          dashboardData?.skillsBreakdown?.problemSolving || 0,
          dashboardData?.skillsBreakdown?.confidence || 0,
        ],
        backgroundColor: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  const topicsData = {
    labels: dashboardData?.topTopics?.map(t => t.topic) || ["No Data"],
    datasets: [
      {
        label: "Practice Count",
        data: dashboardData?.topTopics?.map(t => t.count) || [0],
        backgroundColor: [
          "#3b82f6", // Blue
          "#8b5cf6", // Purple
          "#06b6d4", // Cyan
          "#10b981", // Green
          "#f59e0b", // Amber
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };
  const QuickStatCard = ({ icon: Icon, label, value, trend, onClick, gradient, subtitle, badge }) => (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`${gradient} text-white p-3 rounded-xl shadow-md`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend.includes('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
        {badge && <div className="mt-2">{badge}</div>}
        {subtitle && !badge && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  const calculateStreak = () => {
    if (!dashboardData?.recentActivity || dashboardData.recentActivity.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasActivity = dashboardData.recentActivity.some(activity => {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === checkDate.getTime();
      });
      if (hasActivity) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 8) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 6) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 4) return { text: 'Fair', color: 'bg-orange-100 text-orange-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  const streak = dashboardData ? calculateStreak() : 0;
  const avgScore = dashboardData?.averageScore || 0;
  const scoreBadge = getScoreBadge(avgScore);

  // Show loading only if no cached data
  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Streak */}
      <div className="border-b border-gray-200 bg-white text-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="bg-gray-100 rounded-full p-3 sm:p-4">
                <Brain className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  Welcome back, {user?.firstName || user?.name || "User"}! 👋
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm sm:text-base">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  Let's continue your interview preparation journey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Streak Badge */}
              <div className="bg-gray-100 rounded-xl px-3 sm:px-6 py-2 sm:py-3 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{streak}</p>
                    <p className="text-xs text-gray-600">Day Streak 🔥</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="flex items-center gap-2 bg-white text-blue-600 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg border border-gray-200 text-sm sm:text-base"
              >
                <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Upgrade to Pro</span>
                <span className="sm:hidden">Pro</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <QuickStatCard
            icon={Target}
            label="Interviews Completed"
            value={dashboardData?.totalInterviews || "0"}
            subtitle="Total sessions recorded"
            onClick={() => navigate("/interview-report")}
            gradient="bg-blue-600"
          />
          <QuickStatCard
            icon={Award}
            label="Average Score"
            value={avgScore.toFixed(1)}
            badge={
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${scoreBadge.color}`}>
                <Star className="w-3 h-3" />
                {scoreBadge.text}
              </span>
            }
            onClick={() => navigate("/interview-report")}
            gradient="bg-purple-600"
          />
          <QuickStatCard
            icon={BarChart3}
            label="Interviews Analysed"
            value={dashboardData?.totalAnalyses || "0"}
            subtitle="AI-powered feedback"
            onClick={() => navigate("/interview-report")}
            gradient="bg-cyan-600"
          />
          <QuickStatCard
            icon={BookOpen}
            label="Practice Sessions"
            value={dashboardData?.practiceSessionsCount || "0"}
            subtitle="Keep learning!"
            onClick={() => navigate("/practice-page")}
            gradient="bg-green-600"
          />
        </div>

        {/* Progress Overview Banner */}
        {dashboardData && dashboardData.totalInterviews > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-200 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="bg-gray-100 rounded-2xl p-3 sm:p-4 md:p-6">
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                    You're making great progress! 🚀
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {dashboardData.totalAnalyses > 0 
                      ? `You've analyzed ${dashboardData.totalAnalyses} interview${dashboardData.totalAnalyses > 1 ? 's' : ''} and your average score is ${avgScore.toFixed(1)}/10`
                      : `You've completed ${dashboardData.totalInterviews} interview${dashboardData.totalInterviews > 1 ? 's' : ''}! Keep going!`
                    }
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-gray-900">{streak} day streak</span>
                    </div>
                    {avgScore >= 7 && (
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold text-gray-900">Top Performer</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/start-interview")}
                className="bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-gray-800 transition-all shadow-lg w-full sm:w-auto"
              >
                Start New Interview →
              </button>
            </div>
          </div>
        )}

        {/* Empty State Banner */}
        {dashboardData && dashboardData.totalInterviews === 0 && (
          <div className="bg-blue-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-blue-100 rounded-2xl p-6">
                  <Sparkles className="w-16 h-16 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready to start your journey? 🎯
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-2xl">
                    Begin your first AI-powered mock interview and receive personalized feedback
                    to improve your interview skills. Our advanced AI will analyze your responses
                    and provide actionable insights.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Real-time feedback</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Performance analytics</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Skill improvement tips</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/start-interview")}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start First Interview →
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Performance Trend
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your progress over the last 4 weeks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  dashboardData?.performanceTrend?.slice(-1)[0] > dashboardData?.performanceTrend?.[0]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {dashboardData?.performanceTrend?.slice(-1)[0] > dashboardData?.performanceTrend?.[0] 
                    ? '📈 Improving' 
                    : '📊 Tracking'}
                </div>
              </div>
            </div>
            {dashboardData?.performanceTrend && dashboardData.performanceTrend.some(v => v > 0) ? (
              <div className="h-64">
                <Line data={performanceData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No performance data yet</p>
                  <p className="text-sm text-gray-400 mt-2">Complete analyzed interviews to see your trends</p>
                </div>
              </div>
            )}
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Skills Breakdown
            </h2>
            <p className="text-sm text-gray-600 mb-6">Your strengths & areas to improve</p>
            {dashboardData?.skillsBreakdown && Object.values(dashboardData.skillsBreakdown).some(v => v > 0) ? (
              <div className="h-64 flex items-center justify-center">
                <Doughnut
                  data={skillsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          color: "#374151",
                          font: { size: 11 },
                          padding: 12,
                          usePointStyle: true,
                        },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No skills data yet</p>
                  <p className="text-sm text-gray-400 mt-2">Analyze interviews to track skills</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Quick Actions
            </h2>
            <p className="text-sm text-gray-600 mb-6">Jump right into your preparation</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/start-interview")}
                className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-all group shadow-lg hover:shadow-xl"
              >
                <Target className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-lg">Start Interview</p>
                <p className="text-sm text-blue-100 mt-2">Begin AI mock session</p>
              </button>
              <button
                onClick={() => navigate("/practice-page")}
                className="bg-white border-2 border-purple-200 text-gray-900 p-6 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all group hover:scale-105"
              >
                <Code className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform text-purple-600" />
                <p className="font-bold text-lg">Practice</p>
                <p className="text-sm text-gray-600 mt-2">Solve coding problems</p>
              </button>
              <button
                onClick={() => navigate("/recordings")}
                className="bg-white border-2 border-cyan-200 text-gray-900 p-6 rounded-xl hover:border-cyan-400 hover:shadow-lg transition-all group hover:scale-105"
              >
                <Video className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform text-cyan-600" />
                <p className="font-bold text-lg">View Recordings</p>
                <p className="text-sm text-gray-600 mt-2">Review past sessions</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Recent Activity
            </h2>
            <p className="text-sm text-gray-600 mb-6">Your latest actions</p>
            <div className="space-y-3">
              {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => {
                  const icons = {
                    analysis: CheckCircle,
                    response: Code,
                    recording: Video
                  };
                  const Icon = icons[activity.type] || CheckCircle;
                  const colors = {
                    analysis: 'bg-green-100 text-green-700 border-green-200',
                    response: 'bg-purple-100 text-purple-700 border-purple-200',
                    recording: 'bg-blue-100 text-blue-700 border-blue-200'
                  };
                  const bgColor = colors[activity.type] || 'bg-gray-100 text-gray-700';
                  const daysAgo = Math.floor((Date.now() - new Date(activity.date)) / (1000 * 60 * 60 * 24));
                  const timeText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
                  
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className={`${bgColor} p-2.5 rounded-lg border`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{timeText}</p>
                        {activity.score && (
                          <div className="mt-1">
                            <span className={`text-xs font-bold ${getScoreColor(activity.score)}`}>
                              Score: {activity.score}/10
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                  <button
                    onClick={() => navigate("/start-interview")}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Start your first interview →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Topics Practice Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                Practice by Topic
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your focus areas and expertise
              </p>
            </div>
            <button
              onClick={() => navigate("/practice")}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View All Topics
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {dashboardData?.topTopics && dashboardData.topTopics.length > 0 && dashboardData.topTopics[0].topic !== 'No Data Yet' ? (
            <div className="h-64">
              <Bar
                data={topicsData}
                options={{
                  ...chartOptions,
                  indexAxis: "y",
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      ...chartOptions.plugins.tooltip,
                      callbacks: {
                        label: function(context) {
                          return `Practice Count: ${context.parsed.x}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No topic data yet</p>
                <p className="text-sm text-gray-400 mt-2">Start practicing to see your focus areas</p>
              </div>
            </div>
          )}
        </div>

        {/* Insights & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-gray-900 flex items-center gap-2">
                  AI Insights
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </h3>
                <p className="text-sm text-gray-600">
                  Personalized recommendations for you
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {dashboardData && dashboardData.totalAnalyses > 0 ? (
                <>
                  {avgScore < 7 && (
                    <div className="bg-white border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1 text-gray-900">Boost Your Score</p>
                          <p className="text-sm text-gray-700">
                            Your current average is {avgScore.toFixed(1)}/10. Focus on structured responses using the STAR method to improve.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {dashboardData.skillsBreakdown?.communication < 6 && (
                    <div className="bg-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1 text-gray-900">Improve Communication</p>
                          <p className="text-sm text-gray-700">
                            Practice speaking clearly and concisely. Record yourself and review for clarity.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {streak < 3 && (
                    <div className="bg-white border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Flame className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1 text-gray-900">Build Consistency</p>
                          <p className="text-sm text-gray-700">
                            Practice daily to build a streak. Even 15 minutes a day makes a difference!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1 text-gray-900">Get Started!</p>
                      <p className="text-sm text-gray-700">
                        Complete your first interview to receive personalized AI insights and recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-xl text-gray-900 mb-1 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-purple-600" />
              Your Achievements
            </h3>
            <p className="text-sm text-gray-600 mb-6">Milestones you've unlocked</p>
            <div className="space-y-4">
              {streak >= 5 && (
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="bg-orange-500 text-white p-3 rounded-xl shadow-md">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">🔥 Fire Streak!</p>
                    <p className="text-sm text-gray-600">
                      {streak} days of continuous practice
                    </p>
                  </div>
                </div>
              )}
              {dashboardData?.totalInterviews >= 5 && (
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="bg-blue-500 text-white p-3 rounded-xl shadow-md">
                    <Target className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">🎯 Interview Pro</p>
                    <p className="text-sm text-gray-600">
                      Completed {dashboardData.totalInterviews} interviews
                    </p>
                  </div>
                </div>
              )}
              {avgScore >= 8 && (
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white p-3 rounded-xl shadow-lg">
                    <Star className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">⭐ Excellence Award</p>
                    <p className="text-sm text-gray-600">
                      Average score of {avgScore.toFixed(1)}/10
                    </p>
                  </div>
                </div>
              )}
              {dashboardData?.totalAnalyses >= 3 && (
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white p-3 rounded-xl shadow-lg">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">📊 Data Driven</p>
                    <p className="text-sm text-gray-600">
                      {dashboardData.totalAnalyses} interviews analyzed
                    </p>
                  </div>
                </div>
              )}
              {(!dashboardData || (dashboardData.totalInterviews === 0 && streak === 0)) && (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No achievements yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start practicing to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
