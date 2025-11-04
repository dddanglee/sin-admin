import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let pendingUsers = [
  { id: 1, name: '임시1', email: 'temp1@example.com', submittedAt: '2024-01-15', status: '대기' },
  { id: 2, name: '임시2', email: 'temp2@example.com', submittedAt: '2024-01-14', status: '대기' },
  { id: 3, name: '임시3', email: 'temp3@example.com', submittedAt: '2024-01-13', status: '대기' },
];

// POST: 사용자 거부
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    const userIndex = pendingUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const rejectedUser = pendingUsers[userIndex];
    pendingUsers.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: '사용자가 거부되었습니다.',
      data: rejectedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '사용자 거부에 실패했습니다.' },
      { status: 500 }
    );
  }
}
