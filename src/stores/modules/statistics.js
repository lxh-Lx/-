import { defineStore } from 'pinia'
import { ref } from 'vue'
import { statisticsApi } from '@/api/mock/statistics'

export const useStatisticsStore = defineStore(
  'big-statistics',
  () => {
    const overview = ref({})
    const trend = ref({})
    const channelDistribution = ref([])
    const articleTop = ref([])
    const loading = ref(false)

    const getOverview = async () => {
      const res = await statisticsApi.getOverview()
      overview.value = res.data
      return res
    }

    const getTrend = async () => {
      const res = await statisticsApi.getTrend()
      trend.value = res.data
      return res
    }

    const getChannelDistribution = async () => {
      const res = await statisticsApi.getChannelDistribution()
      channelDistribution.value = res.data
      return res
    }

    const getArticleTop = async () => {
      const res = await statisticsApi.getArticleTop()
      articleTop.value = res.data
      return res
    }

    const getAll = async () => {
      loading.value = true
      const res = await statisticsApi.getAll()
      overview.value = res.data.overview
      trend.value = res.data.trend
      channelDistribution.value = res.data.channelDistribution
      articleTop.value = res.data.articleTop
      loading.value = false
      return res
    }

    return {
      overview,
      trend,
      channelDistribution,
      articleTop,
      loading,
      getOverview,
      getTrend,
      getChannelDistribution,
      getArticleTop,
      getAll
    }
  }
)