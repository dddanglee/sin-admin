import { NextResponse } from 'next/server';

// 임시 데이터 - 월별 사용자 가입수
// 실제로는 데이터베이스에서 집계해야 합니다
const monthlySignups = [
  { month: '1월', count: 45 },
  { month: '2월', count: 52 },
  { month: '3월', count: 48 },
  { month: '4월', count: 61 },
  { month: '5월', count: 55 },
  { month: '6월', count: 78 },
  { month: '7월', count: 82 },
  { month: '8월', count: 95 },
  { month: '9월', count: 88 },
  { month: '10월', count: 102 },
  { month: '11월', count: 115 },
  { month: '12월', count: 128 },
];

// GET: 대시보드 통계 데이터
export async function GET() {
  try {
    const totalUsers = monthlySignups.reduce((sum, item) => sum + item.count, 0);
    const activeUsers = Math.floor(totalUsers * 0.7); // 70% 가정
    const todayVisitors = Math.floor(Math.random() * 200) + 100;
    const totalRevenue = totalUsers * 10000; // 예시 계산

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          todayVisitors,
          totalRevenue,
        },
        monthlySignups,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '통계 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
