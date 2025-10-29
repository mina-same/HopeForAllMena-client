import React, { useState, useEffect, useCallback } from 'react';
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
import { Container, Row, Col } from 'react-bootstrap';
import { format, subMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useAuth } from '../../context/AuthContext';
import factCounterService from '../../services/factCounterService';
import './AnalyticsManagement.css';
import './AnalyticsManagement-rtl.css';

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
const getFactCounterData = (t) => [
  {
    count: 8860,
    text: t('statistics.countries'),
    color: '#3b82f6',
    bgColor: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
    icon: t('icons.countries'),
    category: 'countries'
  },
  {
    count: 456,
    text: t('statistics.leadersTraining'),
    color: '#ef4444',
    bgColor: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
    icon: t('icons.leadersTraining'),
    category: 'leaders'
  },
  {
    count: 55,
    text: t('statistics.publishedBooks'),
    color: '#f59e0b',
    bgColor: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
    icon: t('icons.publishedBooks'),
    category: 'books'
  },
  {
    count: 10000,
    text: t('statistics.givenMagazines'),
    color: '#10b981',
    bgColor: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
    icon: t('icons.givenMagazines'),
    category: 'magazines'
  }
];

const AnalyticsManagement = () => {
  const { t } = useTranslation('AnalyticsManagement');
  const { language: currentLanguage } = useI18next();
  const { user, token } = useAuth();
  const [timeRange, setTimeRange] = useState('12'); // months
  const [chartType, setChartType] = useState('line');
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentStats, setCurrentStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    countries: '',
    leadersTraining: '',
    publishedBooks: '',
    givenMagazines: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current stats from backend
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await factCounterService.getStats();
      setCurrentStats(response.data);
      setEditForm({
        countries: (response.data.countries || response.data.members || 0).toString(),
        leadersTraining: response.data.leadersTraining.toString(),
        publishedBooks: response.data.publishedBooks.toString(),
        givenMagazines: response.data.givenMagazines.toString()
      });
      setError(null);
    } catch (err) {
      setError(t('errors.loadStats'));
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
          const currentCountries = currentStats.countries || currentStats.members || 0;
          const monthData = {
            month: monthLabel,
            date: date,
            countries: Math.floor(currentCountries * (0.7 + (months - i) * 0.3 / months) + Math.random() * 5),
            leadersTraining: Math.floor(currentStats.leadersTraining * (0.6 + (months - i) * 0.4 / months) + Math.random() * 30),
            publishedBooks: Math.floor(currentStats.publishedBooks * (0.5 + (months - i) * 0.5 / months) + Math.random() * 5),
            givenMagazines: Math.floor(currentStats.givenMagazines * (0.6 + (months - i) * 0.4 / months) + Math.random() * 500)
          };
          
          data.push(monthData);
        }
        
        // Ensure the last month matches current totals
        if (data.length > 0) {
          const lastMonth = data[data.length - 1];
          lastMonth.countries = currentStats.countries || currentStats.members || 0;
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
      setError(t('errors.authRequired'));
      return;
    }

    try {
      setUpdating(true);
      const updates = {
        countries: parseInt(editForm.countries),
        leadersTraining: parseInt(editForm.leadersTraining),
        publishedBooks: parseInt(editForm.publishedBooks),
        givenMagazines: parseInt(editForm.givenMagazines)
      };

      const response = await factCounterService.updateStats(updates, token);
      setCurrentStats(response.data);
      setIsEditing(false);
      setError(null);
      
      // Show success message (you can add a toast notification here)
      console.log(t('success.statsUpdated'));
    } catch (err) {
      setError(err.message || t('errors.updateStats'));
    } finally {
      setUpdating(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (currentStats) {
      setEditForm({
        countries: (currentStats.countries || currentStats.members || 0).toString(),
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
        label: t('statistics.countries'),
        data: monthlyData.map(item => item.countries),
        borderColor: '#3b82f6',
        backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: t('statistics.leadersTraining'),
        data: monthlyData.map(item => item.leadersTraining),
        borderColor: '#ef4444',
        backgroundColor: chartType === 'bar' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: t('statistics.publishedBooks'),
        data: monthlyData.map(item => item.publishedBooks),
        borderColor: '#f59e0b',
        backgroundColor: chartType === 'bar' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
      {
        label: t('statistics.givenMagazines'),
        data: monthlyData.map(item => item.givenMagazines),
        borderColor: '#10b981',
        backgroundColor: chartType === 'bar' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Current totals for summary cards

  const calculateGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Doughnut chart for current distribution with modern styling
  const FACT_COUNTER_DATA = getFactCounterData(t);
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
    <div className={`analytics-management fade-in ${currentLanguage === 'ar' ? 'rtl' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Container fluid>
        {/* Modern Header */}
        <div className="analytics-header slide-up bg-gray-200">
          <h2 className={currentLanguage === 'ar' ? '' : 'text-left'}>{t('header.title')}</h2>
          <p className={currentLanguage === 'ar' ? '' : 'text-left'}>{t('header.description')}</p>
        </div>

        {/* Edit Statistics Form */}
        {isEditing && (
          <div className="control-section slide-up mb-4">
            <div className={`d-flex justify-content-between align-items-center mb-3 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <h4 className="mb-0" style={{ color: '#1e293b', fontWeight: '700' }}>{t('icons.edit')} {t('statistics.editTitle')}</h4>
              <div className={`d-flex gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <button 
                  className="modern-btn" 
                  onClick={handleCancelEdit}
                  disabled={updating}
                >
                  {t('statistics.cancel')}
                </button>
                <button 
                  className="modern-btn active" 
                  onClick={handleUpdateStats}
                  disabled={updating}
                >
                  {updating ? t('statistics.saving') : t('statistics.save')}
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateStats}>
              <Row>
                <Col md={6} lg={3} className="mb-3">
                  <label className={`control-label ${currentLanguage === 'ar' ? '' : 'text-left'}`}>{t('icons.countries')} {t('statistics.countries')}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.countries}
                    onChange={(e) => handleInputChange('countries', e.target.value)}
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
                  <label className={`control-label ${currentLanguage === 'ar' ? '' : 'text-left'}`}>{t('icons.leadersTraining')} {t('statistics.leadersTraining')}</label>
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
                  <label className={`control-label ${currentLanguage === 'ar' ? '' : 'text-left'}`}>{t('icons.publishedBooks')} {t('statistics.publishedBooks')}</label>
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
                  <label className={`control-label ${currentLanguage === 'ar' ? '' : 'text-left'}`}>{t('icons.givenMagazines')} {t('statistics.givenMagazines')}</label>
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
            <div className={`d-flex justify-content-between align-items-center ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <h3 className={currentLanguage === 'ar' ? '' : 'text-left'} style={{ color: '#1e293b', fontWeight: '700', margin: 0 }}>{t('icons.analytics')} {t('statistics.title')}</h3>
              {user && !isEditing && (
                <button 
                  className="modern-btn active"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  {t('icons.edit')} {t('statistics.editButton')}
                </button>
              )}
            </div>
          </Col>
          {loading ? (
            <Col xs={12}>
              <div className="text-center py-5">
                <div className="loading-shimmer" style={{ height: '200px', borderRadius: '20px' }}></div>
                <p className="mt-3">{t('loading.statistics')}</p>
              </div>
            </Col>
          ) : (
            FACT_COUNTER_DATA.map((item, index) => {
              const currentValue = currentStats ? currentStats[Object.keys(currentStats)[index]] : item.count;
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
                    <div className={`summary-card-growth ${growthRate >= 0 ? 'positive' : 'negative'} ${currentLanguage === 'ar' ? '' : 'text-left'}`}>
                      <span>{growthRate >= 0 ? '↗' : '↘'}</span>
                      {Math.abs(growthRate)}% {t('statistics.fromLastMonth')}
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
                <label className={`form-label fw-semibold mb-2 d-block ${currentLanguage === 'ar' ? '' : 'text-left'}`} style={{ color: '#374151', fontSize: '0.875rem' }}>{t('controls.timeRange')}</label>
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
                    {t('controls.sixMonths')}
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
                    {t('controls.twelveMonths')}
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
                    {t('controls.twentyFourMonths')}
                  </button>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className={`form-label fw-semibold mb-2 d-block ${currentLanguage === 'ar' ? '' : 'text-left'}`} style={{ color: '#374151', fontSize: '0.875rem' }}>{t('controls.chartType')}</label>
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
                    {t('icons.trends')} {t('controls.lineChart')}
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
                    {t('icons.analytics')} {t('controls.barChart')}
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
              <div className={`d-flex justify-content-between align-items-center mb-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <h4 className={`mb-0 ${currentLanguage === 'ar' ? '' : 'text-left'}`} style={{ color: '#1e293b', fontWeight: '700' }}>{t('charts.monthlyTrends')}</h4>
                <div className={`d-flex align-items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`} style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  <span>{t('icons.analytics')}</span>
                  <span>{t('charts.lastMonths', { count: timeRange })}</span>
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
              <div className={`d-flex justify-content-between align-items-center mb-4 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                <h4 className={`mb-0 ${currentLanguage === 'ar' ? '' : 'text-left'}`} style={{ color: '#1e293b', fontWeight: '700' }}>{t('charts.distribution')}</h4>
                <div className={`d-flex align-items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`} style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  <span>{t('icons.distribution')}</span>
                  <span>{t('charts.currentTotals')}</span>
                </div>
              </div>
              <div className="chart-container">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AnalyticsManagement;
