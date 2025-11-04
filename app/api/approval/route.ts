import { NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let pendingUsers = [
  { id: 1, name: '임시1', email: 'temp1@example.com', submittedAt: '2024-01-15', status: '대기' },
  { id: 2, name: '임시2', email: 'temp2@example.com', submittedAt: '2024-01-14', status: '대기' },
  { id: 3, name: '임시3', email: 'temp3@example.com', submittedAt: '2024-01-13', status: '대기' },
];

// GET: 승인 대기 사용자 목록 조회
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: pendingUsers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '승인 대기 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
