/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 核心配色规范
        character: '#FF4444', // 生字标注 - 红色
        primary: '#33B5E5',   // 主功能键 - 蓝色
        background: '#FFFFFF', // 白色背景
        eyeCare: '#FFF8E1',    // 护眼黄背景

        // 扩展配色
        'primary-hover': '#2A9BC9',
        'character-light': '#FFE5E5',
        'primary-light': '#66C2F0',
        'success': '#4CAF50',
        'warning': '#FF9800',
      },
      fontFamily: {
        kaiti: ['"KaiTi"', '"STKaiti"', '"楷体"', 'serif'],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"微软雅黑"', 'sans-serif'],
      },
      fontSize: {
        // 字号三档调节
        'xs-kaiti': '0.75rem',
        'sm-kaiti': '0.875rem',
        'md-kaiti': '1rem',
        'lg-kaiti': '1.125rem',
        'xl-kaiti': '1.25rem',
        '2xl-kaiti': '1.5rem',
        '3xl-kaiti': '1.875rem',
        '4xl-kaiti': '2.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
