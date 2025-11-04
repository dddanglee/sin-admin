import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let users = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: '관리자', status: '활성' },
  { id: 2, name: '김철수', email: 'kim@example.com', role: '사용자', status: '활성' },
  { id: 3, name: '이영희', email: 'lee@example.com', role: '사용자', status: '비활성' },
  { id: 4, name: '박민수', email: 'park@example.com', role: '사용자', status: '활성' },
];

// GET: 사용자 목록 조회
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '사용자 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 사용자 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, status } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: '이름과 이메일은 필수입니다.' },
        { status: 400 }
      );
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      role: role || '사용자',
      status: status || '활성',
    };

    users.push(newUser);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '사용자 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
