import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let posts = [
  { id: 1, title: '첫 번째 게시물', author: '홍길동', category: '공지사항', status: '공개', views: 123, createdAt: '2024-01-15' },
  { id: 2, title: '두 번째 게시물', author: '김철수', category: '자유게시판', status: '공개', views: 456, createdAt: '2024-01-14' },
  { id: 3, title: '세 번째 게시물', author: '이영희', category: '질문', status: '비공개', views: 78, createdAt: '2024-01-13' },
  { id: 4, title: '네 번째 게시물', author: '박민수', category: '공지사항', status: '공개', views: 234, createdAt: '2024-01-12' },
  { id: 5, title: '신고된 게시물', author: '임시1', category: '자유게시판', status: '신고', views: 89, createdAt: '2024-01-11' },
];

// GET: 게시물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredPosts = [...posts];

    if (status && status !== '전체') {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }

    if (search) {
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({ success: true, data: filteredPosts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '게시물 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
