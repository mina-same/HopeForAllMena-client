import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { format, subMonths, startOfMonth } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import factCounterService from '../../services/factCounterService';
import './AnalyticsManagement.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Import the fact counter data structure with modern color palette
const FACT_COUNTER_DATA = [
  {
    count: 8860,
    text: "Members",
    color: '#3b82f6',
    bgColor: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
    icon: '👥',
    category: 'members'
  },
  {
    count: 456,
    text: "Leaders Training",
    color: '#ef4444',
    bgColor: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
    icon: '🎓',
    category: 'leaders'
  },
  {
    count: 55,
    text: "Published books",
    color: '#f59e0b',
    bgColor: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
    icon: '📚',
    category: 'books'
  },
  {
    count: 10000,
    text: "given Magazines",
    color: '#10b981',
    bgColor: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
    icon: '📰',
    category: 'magazines'
  }
];

const AnalyticsManagement = () => {
  const { user, token } = useAuth();
  const [timeRange, setTimeRange] = useState('12'); // months
  const [chartType, setChartType] = useState('line');
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentStats, setCurrentStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    members: '',
    leadersTraining: '',
    publishedBooks: '',
    givenMagazines: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await factCounterService.getStats();
        setCurrentStats(response.data);
        setEditForm({
          members: response.data.members.toString(),
          leadersTraining: response.data.leadersTraining.toString(),
          publishedBooks: response.data.publishedBooks.toString(),
          givenMagazines: response.data.givenMagazines.toString()
        });
        setError(null);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Generate monthly data based on current stats and time range
  useEffect(() => {
    const generateMonthlyData = async () => {
      if (!currentStats) return;

      try {
        const response = await factCounterService.getHistory(parseInt(timeRange));
        setMonthlyData(response.data.history);
      } catch (err) {
        // Fallback to mock data if history API fails
        const months = parseInt(timeRange);
        const data = [];
        
        for (let i = months - 1; i >= 0; i--) {
          const date = subMonths(new Date(), i);
          const monthLabel = format(date, 'MMM yyyy');
          
          // Generate realistic growth patterns for each metric
          const monthData = {
            month: monthLabel,
            date: date,
            members: Math.floor(currentStats.members * (0.7 + (months - i) * 0.3 / months) + Math.random() * 200),
            leadersTraining: Math.floor(currentStats.leadersTraining * (0.6 + (months - i) * 0.4 / months) + Math.random() * 30),
            publishedBooks: Math.floor(currentStats.publishedBooks * (0.5 + (months - i) * 0.5 / months) + Math.random() * 5),
            givenMagazines: Math.floor(currentStats.givenMagazines * (0.6 + (months - i) * 0.4 / months) + Math.random() * 500)
          };
          
          data.push(monthData);
        }
        
        // Ensure the last month matches current totals
        if (data.length > 0) {
          const lastMonth = data[data.length - 1];
          lastMonth.members = currentStats.members;
          lastMonth.leadersTraining = currentStats.leadersTraining;
          lastMonth.publishedBooks = currentStats.publishedBooks;
          lastMonth.givenMagazines = currentStats.givenMagazines;
        }
        
        setMonthlyData(data);
      }
    };

    generateMonthlyData();
  }, [timeRange, currentStats]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleUpdateStats = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      setUpdating(true);
      const updates = {
        members: parseInt(editForm.members),
        leadersTraining: parseInt(editForm.leadersTraining),
        publishedBooks: parseInt(editForm.publishedBooks),
        givenMagazines: parseInt(editForm.givenMagazines)
      };

      const response = await factCounterService.updateStats(updates, token);
      setCurrentStats(response.data);
      setIsEditing(false);
      setError(null);
      
      // Show success message (you can add a toast notification here)
      console.log('Statistics updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update statistics');
    } finally {
      setUpdating(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (currentStats) {
      setEditForm({
        members: currentStats.members.toString(),
        leadersTraining: currentStats.leadersTraining.toString(),
        publishedBooks: currentStats.publishedBooks.toString(),
        givenMagazines: currentStats.givenMagazines.toString()
      });
    }
  };

  // Chart configuration with modern styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 13,
            weight: '600',
            family: 'Inter, sans-serif'
          },
          color: '#374151'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13,
          weight: '500'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8
        }
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        borderWidth: 3,
        backgroundColor: '#ffffff'
      },
      line: {
        borderWidth: 3,
        tension: 0.4
      },
      bar: {
        borderRadius: 8,
        borderSkipped: false,
      }
    }
  };

  const chartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Members',
        data: monthlyData.map(item => item.members),
        borderColor: '#3b82f6',
        backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Leaders Training',
        data: monthlyData.map(item => item.leadersTraining),
        borderColor: '#ef4444',
        backgroundColor: chartType === 'bar' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Published Books',
        data: monthlyData.map(item => item.publishedBooks),
        borderColor: '#f59e0b',
        backgroundColor: chartType === 'bar' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Given Magazines',
        data: monthlyData.map(item => item.givenMagazines),
        borderColor: '#10b981',
        backgroundColor: chartType === 'bar' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Current totals for summary cards
  const currentData = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1] : null;
  const previousData = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2] : null;

  const calculateGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Doughnut chart for current distribution with modern styling
  const doughnutData = {
    labels: FACT_COUNTER_DATA.map(item => item.text),
    datasets: [
      {
        data: FACT_COUNTER_DATA.map(item => item.count),
        backgroundColor: FACT_COUNTER_DATA.map(item => item.color),
        borderWidth: 4,
        borderColor: '#ffffff',
        hoverBorderWidth: 6,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 13,
            weight: '600',
            family: 'Inter, sans-serif'
          },
          color: '#374151'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13,
          weight: '500'
        }
      }
    },
    elements: {
      arc: {
        borderRadius: 8
      }
    }
  };

  return (
    <div className="analytics-management fade-in">
      <Container fluid>
        {/* Modern Header */}
        <div className="analytics-header slide-up bg-gray-200">
          <h2>Analytics & Reports</h2>
          <p>Track the growth and performance of key metrics over time</p>
        </div>

        {/* Edit Statistics Form */}
        {isEditing && (
          <div className="control-section slide-up mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0" style={{ color: '#1e293b', fontWeight: '700' }}>✏️ Edit Statistics</h4>
              <div className="d-flex gap-2">
                <button 
                  className="modern-btn" 
                  onClick={handleCancelEdit}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button 
                  className="modern-btn active" 
                  onClick={handleUpdateStats}
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateStats}>
              <Row>
                <Col md={6} lg={3} className="mb-3">
                  <label className="control-label">👥 Members</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.members}
                    onChange={(e) => handleInputChange('members', e.target.value)}
                    min="0"
                    required
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  />
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <label className="control-label">🎓 Leaders Training</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.leadersTraining}
                    onChange={(e) => handleInputChange('leadersTraining', e.target.value)}
                    min="0"
                    required
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  />
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <label className="control-label">📚 Published Books</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.publishedBooks}
                    onChange={(e) => handleInputChange('publishedBooks', e.target.value)}
                    min="0"
                    required
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  />
                </Col>
                <Col md={6} lg={3} className="mb-3">
                  <label className="control-label">📰 Given Magazines</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.givenMagazines}
                    onChange={(e) => handleInputChange('givenMagazines', e.target.value)}
                    min="0"
                    required
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  />
                </Col>
              </Row>
            </form>
            {error && (
              <div className="alert alert-danger mt-3" style={{ borderRadius: '12px' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Modern Summary Cards */}
        <Row className="mb-4">
          <Col xs={12} className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h3 style={{ color: '#1e293b', fontWeight: '700', margin: 0 }}>📊 Current Statistics</h3>
              {user && !isEditing && (
                <button 
                  className="modern-btn active"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  ✏️ Edit Numbers
                </button>
              )}
            </div>
          </Col>
          {loading ? (
            <Col xs={12}>
              <div className="text-center py-5">
                <div className="loading-shimmer" style={{ height: '200px', borderRadius: '20px' }}></div>
              </div>
            </Col>
          ) : (
            FACT_COUNTER_DATA.map((item, index) => {
              const currentValue = currentStats ? currentStats[Object.keys(currentStats)[index]] : item.count;
              const currentData = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1] : null;
              const previousData = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2] : null;
              const previousValue = previousData ? Object.values(previousData)[index + 1] : 0;
              const growthRate = calculateGrowthRate(currentValue, previousValue);
              
              return (
                <Col md={6} lg={3} key={index} className="mb-4">
                  <div className={`summary-card ${item.category} slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="summary-card-title">{item.text}</div>
                    <div className="summary-card-value" style={{ color: item.color }}>
                      {currentValue?.toLocaleString() || item.count.toLocaleString()}
                    </div>
                    <div className={`summary-card-growth ${growthRate >= 0 ? 'positive' : 'negative'}`}>
                      <span>{growthRate >= 0 ? '↗' : '↘'}</span>
                      {Math.abs(growthRate)}% from last month
                    </div>
                    <div 
                      className="summary-card-icon"
                      style={{ background: item.bgColor }}
                    >
                      {item.icon}
                    </div>
                  </div>
                </Col>
              );
            })
          )}
        </Row>

        {/* Modern Controls */}
        <div className="mb-4 bg-gray-50 p-4 rounded-2xl">
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label fw-semibold mb-2 d-block" style={{ color: '#374151', fontSize: '0.875rem' }}>Time Range</label>
                <div className="d-flex gap-2">
                  <button 
                    className={`btn ${timeRange === '6' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setTimeRange('6')}
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: timeRange === '6' ? '#3b82f6' : '#f8fafc',
                      color: timeRange === '6' ? '#ffffff' : '#64748b'
                    }}
                  >
                    6 Months
                  </button>
                  <button 
                    className={`btn ${timeRange === '12' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setTimeRange('12')}
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: timeRange === '12' ? '#3b82f6' : '#f8fafc',
                      color: timeRange === '12' ? '#ffffff' : '#64748b'
                    }}
                  >
                    12 Months
                  </button>
                  <button 
                    className={`btn ${timeRange === '24' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setTimeRange('24')}
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: timeRange === '24' ? '#3b82f6' : '#f8fafc',
                      color: timeRange === '24' ? '#ffffff' : '#64748b'
                    }}
                  >
                    24 Months
                  </button>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label fw-semibold mb-2 d-block" style={{ color: '#374151', fontSize: '0.875rem' }}>Chart Type</label>
                <div className="d-flex gap-2">
                  <button 
                    className={`btn ${chartType === 'line' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setChartType('line')}
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: chartType === 'line' ? '#3b82f6' : '#f8fafc',
                      color: chartType === 'line' ? '#ffffff' : '#64748b'
                    }}
                  >
                    📈 Line
                  </button>
                  <button 
                    className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setChartType('bar')}
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: chartType === 'bar' ? '#3b82f6' : '#f8fafc',
                      color: chartType === 'bar' ? '#ffffff' : '#64748b'
                    }}
                  >
                    📊 Bar
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Modern Charts */}
        <Row className="mb-4">
          <Col lg={8}>
            <div className="chart-card slide-up">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0" style={{ color: '#1e293b', fontWeight: '700' }}>Monthly Growth Trends</h4>
                <div className="d-flex align-items-center gap-2" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  <span>📊</span>
                  <span>Last {timeRange} months</span>
                </div>
              </div>
              <div className="chart-container">
                {chartType === 'line' ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <Bar data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="chart-card slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0" style={{ color: '#1e293b', fontWeight: '700' }}>Distribution</h4>
                <div className="d-flex align-items-center gap-2" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  <span>🎯</span>
                  <span>Current totals</span>
                </div>
              </div>
              <div className="chart-container">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </Col>
        </Row>

        {/* Modern Growth Rate Table */}
        <div className="analytics-table slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5>📈 Monthly Growth Analysis</h5>
              <div className="d-flex align-items-center gap-2" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                <span>Last 6 months</span>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>👥 Members</th>
                    <th>🎓 Leaders Training</th>
                    <th>📚 Published Books</th>
                    <th>📰 Given Magazines</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.slice(-6).map((data, index) => {
                    const prevData = index > 0 ? monthlyData[monthlyData.length - 6 + index - 1] : null;
                    return (
                      <tr key={data.month}>
                        <td><strong>{data.month}</strong></td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{data.members.toLocaleString()}</span>
                            {prevData && (
                              <span className={`growth-indicator ${calculateGrowthRate(data.members, prevData.members) >= 0 ? 'positive' : 'negative'}`}>
                                {calculateGrowthRate(data.members, prevData.members) >= 0 ? '↗' : '↘'} {Math.abs(calculateGrowthRate(data.members, prevData.members))}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{data.leadersTraining.toLocaleString()}</span>
                            {prevData && (
                              <span className={`growth-indicator ${calculateGrowthRate(data.leadersTraining, prevData.leadersTraining) >= 0 ? 'positive' : 'negative'}`}>
                                {calculateGrowthRate(data.leadersTraining, prevData.leadersTraining) >= 0 ? '↗' : '↘'} {Math.abs(calculateGrowthRate(data.leadersTraining, prevData.leadersTraining))}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{data.publishedBooks.toLocaleString()}</span>
                            {prevData && (
                              <span className={`growth-indicator ${calculateGrowthRate(data.publishedBooks, prevData.publishedBooks) >= 0 ? 'positive' : 'negative'}`}>
                                {calculateGrowthRate(data.publishedBooks, prevData.publishedBooks) >= 0 ? '↗' : '↘'} {Math.abs(calculateGrowthRate(data.publishedBooks, prevData.publishedBooks))}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{data.givenMagazines.toLocaleString()}</span>
                            {prevData && (
                              <span className={`growth-indicator ${calculateGrowthRate(data.givenMagazines, prevData.givenMagazines) >= 0 ? 'positive' : 'negative'}`}>
                                {calculateGrowthRate(data.givenMagazines, prevData.givenMagazines) >= 0 ? '↗' : '↘'} {Math.abs(calculateGrowthRate(data.givenMagazines, prevData.givenMagazines))}%
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AnalyticsManagement;