'use client';

import { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface MonthlySignup {
  month: string;
  count: number;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  todayVisitors: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlySignups, setMonthlySignups] = useState<MonthlySignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats');
        const result = await response.json();

        if (result.success) {
          setStats(result.data.stats);
          setMonthlySignups(result.data.monthlySignups);
        } else {
          setError(result.error || '데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || '데이터를 불러올 수 없습니다.'}</p>
        </div>
      </AdminLayout>
    );
  }

  const statsData = [
    { label: '전체 사용자', value: stats.totalUsers.toLocaleString(), change: '+12%' },
    { label: '활성 사용자', value: stats.activeUsers.toLocaleString(), change: '+5%' },
    { label: '오늘 방문자', value: stats.todayVisitors.toLocaleString(), change: '+8%' },
    { label: '총 수익', value: `₩${stats.totalRevenue.toLocaleString()}`, change: '+15%' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">월별 사용자 가입수</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlySignups} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="가입수"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

    

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-3">
            {[
              { user: '홍길동', action: '새 계정 생성', time: '5분 전' },
              { user: '김철수', action: '정보 수정', time: '10분 전' },
              { user: '이영희', action: '로그인', time: '15분 전' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-900">{activity.user}</span>
                  <span className="text-gray-600 ml-2">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
