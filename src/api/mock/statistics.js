const STORAGE_KEY = 'big_event_statistics'

const getStatistics = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

const saveStatistics = (stats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

const generateMockData = () => {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  
  const days = []
  const articleCounts = []
  const commentCounts = []
  const viewCounts = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now - i * oneDay)
    days.push(`${date.getMonth() + 1}/${date.getDate()}`)
    articleCounts.push(Math.floor(Math.random() * 10) + 1)
    commentCounts.push(Math.floor(Math.random() * 20) + 5)
    viewCounts.push(Math.floor(Math.random() * 200) + 50)
  }
  
  const channelStats = [
    { name: '前端技术', value: 15 },
    { name: '后端技术', value: 12 },
    { name: '数据库', value: 8 },
    { name: '运维部署', value: 6 },
    { name: '项目管理', value: 4 },
    { name: '其他', value: 3 }
  ]
  
  const stats = {
    overview: {
      totalArticles: 128,
      totalComments: 567,
      totalViews: 8920,
      totalUsers: 234
    },
    trend: {
      days,
      articles: articleCounts,
      comments: commentCounts,
      views: viewCounts
    },
    channelDistribution: channelStats,
    articleTop: [
      { title: 'Vue3 组合式API详解', views: 1234, comments: 45 },
      { title: 'TypeScript 高级类型', views: 987, comments: 32 },
      { title: 'Node.js 性能优化', views: 876, comments: 28 },
      { title: 'React Hooks 最佳实践', views: 765, comments: 25 },
      { title: 'Docker 容器化部署', views: 654, comments: 20 }
    ],
    updateTime: now
  }
  
  saveStatistics(stats)
  return stats
}

export const statisticsApi = {
  getOverview: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let stats = getStatistics()
        if (!stats || Date.now() - stats.updateTime > 24 * 60 * 60 * 1000) {
          stats = generateMockData()
        }
        resolve({
          code: 0,
          message: '获取成功',
          data: stats.overview
        })
      }, 500)
    })
  },

  getTrend: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let stats = getStatistics()
        if (!stats) {
          stats = generateMockData()
        }
        resolve({
          code: 0,
          message: '获取成功',
          data: stats.trend
        })
      }, 500)
    })
  },

  getChannelDistribution: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let stats = getStatistics()
        if (!stats) {
          stats = generateMockData()
        }
        resolve({
          code: 0,
          message: '获取成功',
          data: stats.channelDistribution
        })
      }, 500)
    })
  },

  getArticleTop: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let stats = getStatistics()
        if (!stats) {
          stats = generateMockData()
        }
        resolve({
          code: 0,
          message: '获取成功',
          data: stats.articleTop
        })
      }, 500)
    })
  },

  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let stats = getStatistics()
        if (!stats) {
          stats = generateMockData()
        }
        resolve({
          code: 0,
          message: '获取成功',
          data: stats
        })
      }, 600)
    })
  }
}