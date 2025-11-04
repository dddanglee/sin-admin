'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface PendingUser {
  id: number;
  name: string;
  email: string;
  submittedAt: string;
  status: string;
}

export default function ApprovalPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 승인 대기 사용자 목록 불러오기
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/approval');
      const result = await response.json();

      if (result.success) {
        setPendingUsers(result.data);
      } else {
        setError(result.error || '승인 대기 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('승인 대기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // 사용자 승인
  const handleApprove = async (id: number) => {
    try {
      const response = await fetch('/api/approval/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (result.success) {
        alert('사용자가 승인되었습니다.');
        fetchPendingUsers(); // 목록 새로고침
      } else {
        alert(result.error || '승인에 실패했습니다.');
      }
    } catch (err) {
      alert('승인에 실패했습니다.');
    }
  };

  // 사용자 거부
  const handleReject = async (id: number) => {
    if (!confirm('정말 거부하시겠습니까?')) return;

    try {
      const response = await fetch('/api/approval/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (result.success) {
        alert('사용자가 거부되었습니다.');
        fetchPendingUsers(); // 목록 새로고침
      } else {
        alert(result.error || '거부에 실패했습니다.');
      }
    } catch (err) {
      alert('거부에 실패했습니다.');
    }
  };

  const pendingCount = pendingUsers.length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchPendingUsers}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            다시 시도
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">사용자 승인</h1>
            <p className="text-gray-600 mt-2">승인 대기 중인 사용자를 관리합니다.</p>
          </div>
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">{pendingCount}건</span> 승인 대기
              </div>
            )}
            <button
              onClick={fetchPendingUsers}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">승인 대기 중인 사용자가 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.submittedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        거부
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>안내:</strong> 승인된 사용자는 사용자 관리 페이지에서 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
