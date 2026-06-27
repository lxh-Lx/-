<script setup>
import { onMounted, computed } from 'vue'
import { useStatisticsStore } from '@/stores'
import {
  TrendCharts,
  Document,
  ChatDotRound,
  View,
  User
} from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])
const statisticsStore = useStatisticsStore()
onMounted(() => {
  statisticsStore.getAll()
})
const overviewCards = computed(() => {
  const overview = statisticsStore.overview
  return [
    {
      title: '文章总数',
      value: overview.totalArticles || 0,
      icon: Document,
      color: '#409eff',
      bgColor: '#ecf5ff'
    },
    {
      title: '评论总数',
      value: overview.totalComments || 0,
      icon: ChatDotRound,
      color: '#67c23a',
      bgColor: '#f0f9eb'
    },
    {
      title: '总浏览量',
      value: overview.totalViews || 0,
      icon: View,
      color: '#e6a23c',
      bgColor: '#fdf6ec'
    },
    {
      title: '用户总数',
      value: overview.totalUsers || 0,
      icon: User,
      color: '#f56c6c',
      bgColor: '#fef0f0'
    }
  ]
})
const trendChartOption = computed(() => {
  const trend = statisticsStore.trend
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e5e5',
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      data: ['文章数', '评论数', '浏览量'],
      textStyle: {
        color: '#666'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trend.days || [],
      axisLabel: {
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e5e5'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e5e5'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f5f5f5'
        }
      }
    },
    series: [
      {
        name: '文章数',
        type: 'line',
        smooth: true,
        data: trend.articles || [],
        itemStyle: {
          color: '#409eff'
        }
      },
      {
        name: '评论数',
        type: 'line',
        smooth: true,
        data: trend.comments || [],
        itemStyle: {
          color: '#67c23a'
        }
      },
      {
        name: '浏览量',
        type: 'bar',
        data: trend.views || [],
        itemStyle: {
          color: '#e6a23c'
        }
      }
    ]
  }
})
const channelChartOption = computed(() => {
  const data = statisticsStore.channelDistribution
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e5e5',
      textStyle: {
        color: '#333'
      },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#666'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            formatter: '{b}\n{c}'
          }
        },
        labelLine: {
          show: false
        },
        data: data || []
      }
    ]
  }
})
</script>

<template>
  <page-container title="数据统计分析">
    <template #extra>
      <el-button type="primary" @click="statisticsStore.getAll">
        <TrendCharts /> 刷新数据
      </el-button>
    </template>

    <!-- 概览卡片 -->
    <div class="overview-cards">
      <el-card
        v-for="card in overviewCards"
        :key="card.title"
        class="overview-card"
      >
        <div class="card-content">
          <div
            class="card-icon"
            :style="{ backgroundColor: card.bgColor, color: card.color }"
          >
            <component :is="card.icon" />
          </div>
          <div class="card-info">
            <div class="card-value">{{ card.value }}</div>
            <div class="card-title">{{ card.title }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-wrapper">
      <el-card class="chart-card">
        <template #header>
          <span>近7日数据趋势</span>
        </template>
        <v-chart :option="trendChartOption" style="height: 350px" autoresize />
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <span>文章分类分布</span>
        </template>
        <v-chart
          :option="channelChartOption"
          style="height: 350px"
          autoresize
        />
      </el-card>
    </div>

    <!-- 热门文章 -->
    <el-card class="top-articles-card">
      <template #header>
        <span>热门文章 TOP5</span>
      </template>
      <el-table :data="statisticsStore.articleTop" style="width: 100%">
        <el-table-column label="排名" width="80">
          <template #default="{ $index }">
            <span
              :class="[
                'rank',
                {
                  'rank-1': $index === 0,
                  'rank-2': $index === 1,
                  'rank-3': $index === 2
                }
              ]"
              >{{ $index + 1 }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="文章标题" prop="title">
          <template #default="{ row }">
            <el-link type="primary" underline="never">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" prop="views">
          <template #default="{ row }">
            <span class="view-count"><View /> {{ row.views }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论数" prop="comments">
          <template #default="{ row }">
            <span class="comment-count"
              ><ChatDotRound /> {{ row.comments }}</span
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </page-container>
</template>

<style lang="scss" scoped>
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.overview-card {
  .card-content {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .card-info {
    .card-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-color);
    }

    .card-title {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
  }
}

.charts-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  min-height: 400px;
}

.top-articles-card {
  .rank {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: #e5e5e5;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    color: #666;

    &.rank-1 {
      background-color: #ffd700;
      color: #fff;
    }

    &.rank-2 {
      background-color: #c0c0c0;
      color: #fff;
    }

    &.rank-3 {
      background-color: #cd7f32;
      color: #fff;
    }
  }

  .view-count,
  .comment-count {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--text-secondary);

    :deep(.el-icon) {
      font-size: 16px;
    }
  }
}

@media (max-width: 1200px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
}
</style>
