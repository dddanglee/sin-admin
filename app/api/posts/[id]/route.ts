import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let posts = [
  { id: 1, title: '첫 번째 게시물', author: '홍길동', category: '공지사항', status: '공개', views: 123, createdAt: '2024-01-15' },
  { id: 2, title: '두 번째 게시물', author: '김철수', category: '자유게시판', status: '공개', views: 456, createdAt: '2024-01-14' },
  { id: 3, title: '세 번째 게시물', author: '이영희', category: '질문', status: '비공개', views: 78, createdAt: '2024-01-13' },
  { id: 4, title: '네 번째 게시물', author: '박민수', category: '공지사항', status: '공개', views: 234, createdAt: '2024-01-12' },
  { id: 5, title: '신고된 게시물', author: '임시1', category: '자유게시판', status: '신고', views: 89, createdAt: '2024-01-11' },
];

// PUT: 게시물 상태 변경
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);
    const body = await request.json();

    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    posts[postIndex] = { ...posts[postIndex], ...body };

    return NextResponse.json({ success: true, data: posts[postIndex] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '게시물 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 게시물 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: '게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    posts.splice(postIndex, 1);

    return NextResponse.json({ success: true, message: '게시물이 삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '게시물 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
