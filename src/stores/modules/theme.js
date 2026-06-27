import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 主题状态管理
export const useThemeStore = defineStore(
  'big-theme',
  () => {
    // 当前主题：light 或 dark
    const theme = ref('light')

    // 切换主题
    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      applyTheme()
    }

    // 设置指定主题
    const setTheme = (newTheme) => {
      theme.value = newTheme
      applyTheme()
    }

    // 应用主题到 DOM
    const applyTheme = () => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme.value)
    }

    // 初始化主题
    const initTheme = () => {
      applyTheme()
    }

    return {
      theme,
      toggleTheme,
      setTheme,
      initTheme
    }
  },
  {
    // 持久化存储用户的主题偏好
    persist: true
  }
)