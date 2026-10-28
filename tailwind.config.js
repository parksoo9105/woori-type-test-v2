/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        woori: {
          bg: '#F8F7F3',
          ink: '#171923',
          surface: '#FFFFFF',
          border: '#E4E2D8',
          coral: '#FF654F',   // 01 마주보며 연결되는 우리
          blue: '#4169E1',    // 02 온라인으로 연결되는 우리
          lime: '#B8E34A',    // 03 새로운 만남에 열린 우리
          violet: '#8064D8',  // 04 나만의 속도로 관계 맺는 우리
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 4px 24px -2px rgba(28, 44, 37, 0.06), 0 2px 8px -2px rgba(28, 44, 37, 0.04)',
        'card': '0 8px 32px -4px rgba(28, 44, 37, 0.08), 0 4px 12px -2px rgba(28, 44, 37, 0.03)',
      }
    },
  },
  plugins: [],
}
