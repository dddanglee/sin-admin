import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let users = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: '관리자', status: '활성' },
  { id: 2, name: '김철수', email: 'kim@example.com', role: '사용자', status: '활성' },
  { id: 3, name: '이영희', email: 'lee@example.com', role: '사용자', status: '비활성' },
  { id: 4, name: '박민수', email: 'park@example.com', role: '사용자', status: '활성' },
];

// PUT: 사용자 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    users[userIndex] = { ...users[userIndex], ...body };

    return NextResponse.json({ success: true, data: users[userIndex] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '사용자 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 사용자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    users.splice(userIndex, 1);

    return NextResponse.json({ success: true, message: '사용자가 삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '사용자 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
