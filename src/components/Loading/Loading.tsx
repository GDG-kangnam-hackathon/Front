export const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center flex-col">
      {/* 그라데이션 스피너 */}
      <div
        className="animate-spin rounded-full h-14 w-14"
        style={{
          background: 'conic-gradient(#ffffff,#F587A0)',
          mask: 'radial-gradient(closest-side, transparent 85%, black 0%)',
          WebkitMask:
            'radial-gradient(closest-side, transparent 85%, black 0%)',
        }}
      ></div>
      {/* 로딩 텍스트 */}
      <p className="font-nanum text-[40px] text-white">로딩중...</p>
    </div>
  )
}
