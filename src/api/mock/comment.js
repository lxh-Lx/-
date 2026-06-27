const STORAGE_KEY = 'big_event_comments'

const getComments = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const saveComments = (comments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
}

export const commentApi = {
  getList: (articleId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allComments = getComments()
        const comments = allComments.filter(c => c.articleId === articleId).sort((a, b) => b.createTime - a.createTime)
        resolve({
          code: 0,
          message: '获取成功',
          data: {
            total: comments.length,
            list: comments
          }
        })
      }, 300)
    })
  },

  add: (articleId, content) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allComments = getComments()
        const newComment = {
          id: Date.now(),
          articleId,
          content,
          createTime: Date.now(),
          nickname: '匿名用户',
          avatar: ''
        }
        allComments.push(newComment)
        saveComments(allComments)
        resolve({
          code: 0,
          message: '评论成功',
          data: newComment
        })
      }, 300)
    })
  },

  delete: (commentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allComments = getComments()
        const filtered = allComments.filter(c => c.id !== commentId)
        saveComments(filtered)
        resolve({
          code: 0,
          message: '删除成功'
        })
      }, 300)
    })
  },

  getTotalByArticle: (articleId) => {
    const allComments = getComments()
    return allComments.filter(c => c.articleId === articleId).length
  }
}