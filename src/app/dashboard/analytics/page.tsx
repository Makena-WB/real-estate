"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Star,
  Home,
  DollarSign,
  Users,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Download,
  Activity,
  Building,
} from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

type AnalyticsStats = {
  totalListings: number
  totalViews: number
  totalFavorites: number
  totalReviews: number
  averagePrice: number
  monthlyViews?: number[]
  propertyTypes?: { [key: string]: number }
  recentActivity?: Array<{
    date: string
    views: number
    favorites: number
    reviews: number
  }>
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/dashboard/analytics?range=${timeRange}`)
        const data = await res.json()
        if (res.ok) {
          setStats(data)
        } else {
          setError(data.error || "Failed to fetch analytics")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [timeRange])

  const handleRefresh = () => {
    setStats(null)
    fetchStats()
  }

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/dashboard/analytics?range=${timeRange}`)
      const data = await res.json()
      if (res.ok) {
        setStats(data)
      } else {
        setError(data.error || "Failed to fetch analytics")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 mb-4">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-slate-200 mb-2">Loading Analytics</h3>
          <p className="text-slate-400">Please wait while we fetch your analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-2xl rounded-2xl sm:rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Error Loading Analytics</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg border border-slate-500/30 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link href="/dashboard" className="flex-1">
                <button className="w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const barData = {
    labels: ["Listings", "Views", "Favorites", "Reviews"],
    datasets: [
      {
        label: "Analytics",
        data: [stats.totalListings, stats.totalViews, stats.totalFavorites, stats.totalReviews],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(245, 158, 66, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(245, 158, 66, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(71, 85, 105, 0.5)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { size: 12, weight: 500 },
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
          drawBorder: false,
        },
        border: { display: false },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          font: { size: 12, weight: 500 },
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
          drawBorder: false,
        },
        border: { display: false },
      },
    },
  }

  // Line chart for monthly views
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Views",
        data: stats.monthlyViews || [120, 190, 300, 500, 200, 300, 450, 600, 400, 350, 280, 320],
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(71, 85, 105, 0.5)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { size: 12, weight: 500 },
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
          drawBorder: false,
        },
        border: { display: false },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          font: { size: 12, weight: 500 },
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
          drawBorder: false,
        },
        border: { display: false },
      },
    },
  }

  // Doughnut chart for property types
  const doughnutData = {
    labels: Object.keys(stats.propertyTypes || { Apartment: 45, House: 30, Condo: 15, Studio: 10 }),
    datasets: [
      {
        data: Object.values(stats.propertyTypes || { Apartment: 45, House: 30, Condo: 15, Studio: 10 }),
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(245, 158, 66, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(245, 158, 66, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#94a3b8",
          font: { size: 12, weight: 500 },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(71, 85, 105, 0.5)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-slate-600/30">
              <BarChart3 className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-slate-100">
              Analytics Dashboard
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Track your property performance, monitor engagement, and gain insights to optimize your listings
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-300">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{stats.totalListings}</div>
                <div className="text-sm sm:text-base">Active Listings</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm sm:text-base">Total Views</div>
              </div>
              <div className="w-px h-12 bg-slate-600/50"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200">{stats.totalFavorites}</div>
                <div className="text-sm sm:text-base">Total Favorites</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-200 transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/50 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button
              onClick={handleRefresh}
              className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500/50 text-slate-200 hover:text-slate-100 rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-slate-500/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <Home className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-100">Total Listings</h3>
                <p className="text-slate-400 text-sm">Active properties</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-2">{stats.totalListings}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">+12%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>

          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-slate-500/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/30">
                <Eye className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-100">Total Views</h3>
                <p className="text-slate-400 text-sm">Property impressions</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-2">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">+24%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>

          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-slate-500/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-100">Total Favorites</h3>
                <p className="text-slate-400 text-sm">Saved properties</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-2">{stats.totalFavorites}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">+8%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>

          <div className="group bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-slate-500/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                <Star className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-100">Total Reviews</h3>
                <p className="text-slate-400 text-sm">Customer feedback</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-2">{stats.totalReviews}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">+15%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <BarChart3 className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Analytics Overview</h2>
            </div>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <Activity className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Monthly Views Trend</h2>
            </div>
            <div className="h-80">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Types Distribution */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <Building className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Property Types</h2>
            </div>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Average Price Card */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <DollarSign className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Average Price</h2>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-100 mb-4">
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(stats.averagePrice)}
              </div>
              <div className="flex items-center justify-center gap-1 text-sm mb-4">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+5.2%</span>
                <span className="text-slate-400">vs last month</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Average price across all your active property listings
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 shadow-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/30">
                <Users className="w-5 h-5 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {stats.recentActivity?.map((activity, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">Property Views</div>
                        <div className="text-xs text-slate-400">{activity.date}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-slate-100">{activity.views ?? 0}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">New Favorites</div>
                        <div className="text-xs text-slate-400">{activity.date}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-slate-100">{activity.favorites ?? 0}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">New Reviews</div>
                        <div className="text-xs text-slate-400">{activity.date}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-slate-100">{activity.reviews ?? 0}</div>
                  </div>
                </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
