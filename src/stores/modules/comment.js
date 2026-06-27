import { defineStore } from 'pinia'
import { ref } from 'vue'
import { commentApi } from '@/api/mock/comment'

export const useCommentStore = defineStore(
  'big-comment',
  () => {
    const comments = ref([])
    const loading = ref(false)

    const getComments = async (articleId) => {
      loading.value = true
      const res = await commentApi.getList(articleId)
      comments.value = res.data.list
      loading.value = false
      return res
    }

    const addComment = async (articleId, content) => {
      const res = await commentApi.add(articleId, content)
      return res
    }

    const deleteComment = async (commentId) => {
      const res = await commentApi.delete(commentId)
      return res
    }

    const getCommentCount = (articleId) => {
      return commentApi.getTotalByArticle(articleId)
    }

    return {
      comments,
      loading,
      getComments,
      addComment,
      deleteComment,
      getCommentCount
    }
  }
)