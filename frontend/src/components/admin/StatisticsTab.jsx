import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
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
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

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

export default function StatisticsTab() {
  const [range, setRange] = useState('this_year');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const getMockData = (selectedRange) => {
    const monthsThisYear = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonthIdx = new Date().getMonth();
    const activeMonths = monthsThisYear.slice(0, currentMonthIdx + 1);

    if (selectedRange === 'last_3_months') {
      const last3 = activeMonths.slice(-3);
      while (last3.length < 3) {
        last3.unshift(monthsThisYear[(12 + currentMonthIdx - last3.length) % 12]);
      }
      return {
        revenue_trend: {
          labels: last3,
          data: [18500000, 24200000, 31050000]
        },
        popular_packages: {
          labels: ['River Tubing Standard', 'Wellness Spa & Tubing', 'Family Tubing & Lunch'],
          data: [120, 85, 95]
        },
        session_occupancy: {
          labels: ['Sesi Pagi (08:00)', 'Sesi Siang (13:00)'],
          data: [82.5, 68.0]
        },
        summary: {
          total_revenue: 73750000,
          total_tickets: 300,
          peak_session: 'Pagi (82.5% Occupancy)'
        }
      };
    } else if (selectedRange === 'last_6_months') {
      const last6 = activeMonths.slice(-6);
      while (last6.length < 6) {
        last6.unshift(monthsThisYear[(12 + currentMonthIdx - last6.length) % 12]);
      }
      return {
        revenue_trend: {
          labels: last6,
          data: [12400000, 14200000, 18500000, 24200000, 31050000, 38650000]
        },
        popular_packages: {
          labels: ['River Tubing Standard', 'Wellness Spa & Tubing', 'Family Tubing & Lunch'],
          data: [260, 195, 210]
        },
        session_occupancy: {
          labels: ['Sesi Pagi (08:00)', 'Sesi Siang (13:00)'],
          data: [79.2, 64.5]
        },
        summary: {
          total_revenue: 139500000,
          total_tickets: 665,
          peak_session: 'Pagi (79.2% Occupancy)'
        }
      };
    } else {
      // Default: this_year
      const yearLabels = activeMonths.length > 0 ? activeMonths : ['Januari', 'Februari', 'Maret'];
      const defaultRevenue = [9200000, 10500000, 12400000, 14200000, 18500000, 24200000, 31050000, 38650000, 41200000, 45800000, 52100000, 64300000];
      const revenueData = yearLabels.map((_, i) => defaultRevenue[i] || 15000000);
      
      return {
        revenue_trend: {
          labels: yearLabels,
          data: revenueData
        },
        popular_packages: {
          labels: ['River Tubing Standard', 'Wellness Spa & Tubing', 'Family Tubing & Lunch'],
          data: [580, 420, 390]
        },
        session_occupancy: {
          labels: ['Sesi Pagi (08:00)', 'Sesi Siang (13:00)'],
          data: [76.8, 59.4]
        },
        summary: {
          total_revenue: revenueData.reduce((a, b) => a + b, 0),
          total_tickets: 1390,
          peak_session: 'Pagi (76.8% Occupancy)'
        }
      };
    }
  };

  useEffect(() => {
    setLoading(true);
    client.get(`/api/admin/reports/statistics?range=${range}`)
      .then(res => {
        setStats(res.data);
      })
      .catch(() => {
        // Fallback to high-quality mock data automatically
        const mock = getMockData(range);
        setStats(mock);
        toast.success("Dasbor analitik dimuat dalam mode demo (fallback).");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [range]);

  // Line Chart Config (Monthly Revenue Trend)
  const lineChartData = {
    labels: stats?.revenue_trend?.labels || [],
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: stats?.revenue_trend?.data || [],
        fill: true,
        backgroundColor: 'rgba(27, 67, 50, 0.1)',
        borderColor: '#1b4332',
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: '#1b4332',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Pendapatan: Rp${context.parsed.y.toLocaleString('id-ID')}`
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => `Rp${(value / 1000000).toFixed(0)}JT`,
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  // Doughnut Chart Config (Popular Packages Distribution)
  const doughnutChartData = {
    labels: stats?.popular_packages?.labels || [],
    datasets: [
      {
        data: stats?.popular_packages?.data || [],
        backgroundColor: [
          '#1b4332', // Deep forest green
          '#40916c', // Mint green
          '#b7e4c7', // Soft green
          '#d8f3dc'  // Pale green
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
            weight: 'bold'
          },
          padding: 15
        }
      }
    }
  };

  // Bar Chart Config (Session Occupancy Ratio)
  const barChartData = {
    labels: stats?.session_occupancy?.labels || [],
    datasets: [
      {
        label: 'Rasio Keterisian Kuota (%)',
        data: stats?.session_occupancy?.data || [],
        backgroundColor: 'rgba(64, 145, 108, 0.85)',
        hoverBackgroundColor: '#2d6a4f',
        borderColor: '#2d6a4f',
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Okupansi: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => `${value}%`,
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Dropdown */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-surface-variant pb-6 gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-primary mb-1">Analisis Statistik & Tren Pendapatan</h1>
          <p className="text-on-surface-variant text-sm font-medium">Pantau kinerja keuangan, popularitas paket, dan okupansi sesi secara interaktif.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="range-filter" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Periode:</label>
          <select
            id="range-filter"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border border-surface-variant rounded-xl px-4 py-2.5 bg-white text-sm font-bold text-primary focus:outline-none focus:border-primary cursor-pointer shadow-sm"
          >
            <option value="this_year">Tahun Ini</option>
            <option value="last_3_months">3 Bulan Terakhir</option>
            <option value="last_6_months">6 Bulan Terakhir</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-4">settings</span>
          <p className="text-on-surface-variant text-sm font-bold">Memuat data analitik...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Executive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.03)] flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-3xl">query_stats</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Pendapatan</p>
                <p className="text-2xl font-bold text-primary">
                  Rp{(stats?.summary?.total_revenue || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.03)] flex items-center gap-4">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-3xl">local_activity</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tiket Terjual</p>
                <p className="text-2xl font-bold text-primary">
                  {stats?.summary?.total_tickets || 0} <span className="text-sm font-medium text-on-surface-variant">pax</span>
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.03)] flex items-center gap-4">
              <div className="w-14 h-14 bg-tertiary-container/20 rounded-xl flex items-center justify-center text-tertiary-container shrink-0">
                <span className="material-symbols-outlined text-3xl">trending_up</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Sesi Terpadat</p>
                <p className="text-xl font-bold text-primary truncate max-w-[200px]">
                  {stats?.summary?.peak_session || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Trend Line Chart */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.03)] flex flex-col">
              <h3 className="font-headline-md text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">show_chart</span>
                Tren Pendapatan Bulanan
              </h3>
              <div className="flex-1 min-h-[320px] relative">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            {/* Popular Packages Doughnut Chart */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.03)] flex flex-col">
              <h3 className="font-headline-md text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">pie_chart</span>
                Proporsi Paket Tubing
              </h3>
              <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
                <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
              </div>
            </div>

            {/* Session Occupancy Bar Chart */}
            <div className="lg:col-span-12 bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_4px_20px_rgb(27,67,50,0.03)] flex flex-col">
              <h3 className="font-headline-md text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">bar_chart</span>
                Rasio Okupansi Sesi (Pagi vs Siang)
              </h3>
              <div className="min-h-[200px] relative">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
