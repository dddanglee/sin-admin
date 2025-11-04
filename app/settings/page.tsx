import AdminLayout from '../components/AdminLayout';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          <p className="text-gray-600 mt-2">시스템 설정을 관리합니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">일반 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트 이름
                </label>
                <input
                  type="text"
                  defaultValue="관리자 페이지"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트 설명
                </label>
                <textarea
                  rows={3}
                  defaultValue="관리자 대시보드"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">알림 설정</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">이메일 알림 받기</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700">새 사용자 가입 알림</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">시스템 오류 알림</span>
              </label>
            </div>
          </div>

          <div className="border-t pt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              설정 저장
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
