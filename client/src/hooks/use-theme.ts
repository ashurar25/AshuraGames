
import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // ตรวจสอบการตั้งค่าที่บันทึกไว้
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;
    
    // ตรวจสอบการตั้งค่าของระบบ
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // บันทึกการตั้งค่า
    localStorage.setItem('theme', theme);
    
    // อัพเดต HTML class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
