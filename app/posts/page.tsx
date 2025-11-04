'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  status: string;
  views: number;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  // 게시물 목록 불러오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== '전체') {
        params.append('status', filter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/posts?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.error || '게시물 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('게시물 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 게시물 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        alert('게시물이 삭제되었습니다.');
        fetchPosts(); // 목록 새로고침
      } else {
        alert(result.error || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 게시물 상태 변경
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();

      if (result.success) {
        alert(`게시물 상태가 "${newStatus}"로 변경되었습니다.`);
        fetchPosts(); // 목록 새로고침
      } else {
        alert(result.error || '상태 변경에 실패했습니다.');
      }
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 모든 게시물을 가져와서 상태별 카운트 계산
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const result = await response.json();
        if (result.success) {
          setAllPosts(result.data);
        }
      } catch (err) {
        // 무시
      }
    };
    fetchAllPosts();
  }, []);

  const statusCounts = {
    전체: allPosts.length,
    공개: allPosts.filter(p => p.status === '공개').length,
    비공개: allPosts.filter(p => p.status === '비공개').length,
    신고: allPosts.filter(p => p.status === '신고').length,
  };

  // filter 변경 시 즉시, searchTerm 변경 시 debounce 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, searchTerm ? 300 : 0); // searchTerm이 있으면 debounce, 없으면 즉시

    return () => clearTimeout(timer);
  }, [filter, searchTerm]);

  if (loading && posts.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && posts.length === 0) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchPosts}
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
            <h1 className="text-3xl font-bold text-gray-900">게시물 관리</h1>
            <p className="text-gray-600 mt-2">전체 게시물을 관리합니다.</p>
          </div>
          <button
            onClick={fetchPosts}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            새로고침
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="제목 또는 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['전체', '공개', '비공개', '신고'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status} ({statusCounts[status as keyof typeof statusCounts]})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    조회수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      게시물이 없습니다.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={post.status}
                          onChange={(e) => handleStatusChange(post.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            post.status === '공개'
                              ? 'bg-green-100 text-green-800'
                              : post.status === '비공개'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="공개">공개</option>
                          <option value="비공개">비공개</option>
                          <option value="신고">신고</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">보기</button>
                        <button className="text-orange-600 hover:text-orange-900">수정</button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            총 <strong>{posts.length}</strong>개의 게시물
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              이전
            </button>
            <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              다음
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
