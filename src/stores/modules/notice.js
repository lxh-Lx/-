import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoticeStore = defineStore('notice', () => {
  // 通知列表
  const notices = ref([])

  // 未读数量
  const unreadCount = ref(0)

  // 初始化通知数据
  const initNotices = () => {
    const storedNotices = localStorage.getItem('big_event_notices')
    if (storedNotices) {
      notices.value = JSON.parse(storedNotices)
      updateUnreadCount()
    } else {
      // 初始化一些默认通知
      notices.value = [
        {
          id: 1,
          type: 'system',
          title: '系统通知',
          content: '欢迎使用大事件管理系统，祝您使用愉快！',
          time: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'comment',
          title: '新评论提醒',
          content: '您的文章《Vue3入门教程》收到了一条新评论',
          time: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: 3,
          type: 'article',
          title: '文章发布成功',
          content: '您的文章《React进阶指南》已发布成功！',
          time: new Date(Date.now() - 86400000).toISOString(),
          read: true
        }
      ]
      saveNotices()
      updateUnreadCount()
    }
  }

  // 保存到 localStorage
  const saveNotices = () => {
    localStorage.setItem('big_event_notices', JSON.stringify(notices.value))
  }

  // 更新未读数量
  const updateUnreadCount = () => {
    unreadCount.value = notices.value.filter(n => !n.read).length
  }

  // 添加通知
  const addNotice = (notice) => {
    const newNotice = {
      id: Date.now(),
      time: new Date().toISOString(),
      read: false,
      ...notice
    }
    notices.value.unshift(newNotice)
    saveNotices()
    updateUnreadCount()
  }

  // 标记已读
  const markAsRead = (id) => {
    const notice = notices.value.find(n => n.id === id)
    if (notice) {
      notice.read = true
      saveNotices()
      updateUnreadCount()
    }
  }

  // 全部标记已读
  const markAllAsRead = () => {
    notices.value.forEach(n => {
      n.read = true
    })
    saveNotices()
    updateUnreadCount()
  }

  // 删除通知
  const deleteNotice = (id) => {
    const index = notices.value.findIndex(n => n.id === id)
    if (index > -1) {
      notices.value.splice(index, 1)
      saveNotices()
      updateUnreadCount()
    }
  }

  // 清空所有通知
  const clearAll = () => {
    notices.value = []
    saveNotices()
    updateUnreadCount()
  }

  return {
    notices,
    unreadCount,
    initNotices,
    addNotice,
    markAsRead,
    markAllAsRead,
    deleteNotice,
    clearAll
  }
})
