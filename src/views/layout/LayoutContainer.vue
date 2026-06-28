<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Moon,
  Sunny,
  DataAnalysis,
  Bell,
  Delete,
  Check
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore, useThemeStore, useNoticeStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const themeStore = useThemeStore()
const noticeStore = useNoticeStore()
const router = useRouter()

onMounted(() => {
  userStore.getUser()
  themeStore.initTheme()
  noticeStore.initNotices()
})

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}

// 通知相关
const noticeDialogVisible = ref(false)

const openNotice = () => {
  noticeDialogVisible.value = true
}

const formatTime = (time) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

const getNoticeIcon = (type) => {
  const icons = {
    system: Bell,
    comment: 'ChatDotRound',
    article: 'Document'
  }
  return icons[type] || Bell
}

const getNoticeTypeClass = (type) => {
  const classes = {
    system: 'notice-system',
    comment: 'notice-comment',
    article: 'notice-article'
  }
  return classes[type] || 'notice-system'
}
</script>

<template>
  <!-- 
    el-menu 整个菜单组件
      :default-active="$route.path"  配置默认高亮的菜单项
      router  router选项开启，el-menu-item 的 index 就是点击跳转的路径

    el-menu-item 菜单项
      index="/article/channel" 配置的是访问的跳转路径，配合default-active的值，实现高亮
  -->
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>

        <el-menu-item index="/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </el-menu-item>

        <el-sub-menu index="/user">
          <!-- 多级菜单的标题 - 具名插槽 title -->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>

          <!-- 展开的内容 - 默认插槽 -->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <strong>{{
            userStore.user.nickname || userStore.user.username
          }}</strong>
        </div>
        <div class="header-right">
          <!-- 主题切换按钮 -->
          <el-button
            circle
            :icon="themeStore.theme === 'light' ? Moon : Sunny"
            @click="themeStore.toggleTheme"
            class="theme-btn"
          />
          <!-- 通知按钮 -->
          <el-badge
            :value="noticeStore.unreadCount"
            :hidden="noticeStore.unreadCount === 0"
            :max="99"
          >
            <el-button
              circle
              :icon="Bell"
              @click="openNotice"
              class="notice-btn"
            />
          </el-badge>
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <!-- 展示给用户，默认看到的 -->
            <span class="el-dropdown__box">
              <el-avatar :src="userStore.user.user_pic || avatar" />
              <el-icon><CaretBottom /></el-icon>
            </span>

            <!-- 折叠的下拉部分 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User"
                  >基本资料</el-dropdown-item
                >
                <el-dropdown-item command="avatar" :icon="Crop"
                  >更换头像</el-dropdown-item
                >
                <el-dropdown-item command="password" :icon="EditPen"
                  >重置密码</el-dropdown-item
                >
                <el-dropdown-item command="logout" :icon="SwitchButton"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer></el-footer>
    </el-container>

    <!-- 通知弹窗 -->
    <el-dialog v-model="noticeDialogVisible" title="消息通知" width="450px">
      <div class="notice-header">
        <el-button
          text
          type="primary"
          @click="noticeStore.markAllAsRead"
          :disabled="noticeStore.unreadCount === 0"
        >
          <el-icon><Check /></el-icon>
          全部已读
        </el-button>
        <el-button text type="danger" @click="noticeStore.clearAll">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
      <el-scrollbar height="400px">
        <div v-if="noticeStore.notices.length === 0" class="notice-empty">
          <el-empty description="暂无通知" />
        </div>
        <div v-else>
          <div
            v-for="notice in noticeStore.notices"
            :key="notice.id"
            class="notice-item"
            :class="{ 'notice-unread': !notice.read }"
            @click="noticeStore.markAsRead(notice.id)"
          >
            <div class="notice-icon" :class="getNoticeTypeClass(notice.type)">
              <el-icon><component :is="getNoticeIcon(notice.type)" /></el-icon>
            </div>
            <div class="notice-content">
              <div class="notice-title">{{ notice.title }}</div>
              <div class="notice-text">{{ notice.content }}</div>
              <div class="notice-time">{{ formatTime(notice.time) }}</div>
            </div>
            <el-button
              circle
              plain
              type="danger"
              :icon="Delete"
              size="small"
              class="notice-delete"
              @click.stop="noticeStore.deleteNotice(notice.id)"
            />
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: var(--aside-bg);
    transition: background-color 0.3s;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: var(--header-bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.3s;
    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
      .theme-btn {
        border: none;
        background: transparent;
        &:hover {
          background: var(--border-color);
        }
      }
      .el-dropdown__box {
        display: flex;
        align-items: center;
        .el-icon {
          color: var(--text-secondary);
          margin-left: 10px;
        }

        &:active,
        &:focus {
          outline: none;
        }
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--text-secondary);
  }
}

// 通知样式
.notice-btn {
  border: none;
  background: transparent;
  &:hover {
    background: var(--border-color);
  }
}

.notice-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 15px;
}

.notice-empty {
  padding: 40px 0;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;

  &:hover {
    background-color: var(--hover-bg);

    .notice-delete {
      opacity: 1;
    }
  }

  &.notice-unread {
    background-color: var(--unread-bg);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 40px;
      background-color: #409eff;
      border-radius: 0 2px 2px 0;
    }
  }
}

.notice-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;

  &.notice-system {
    background-color: #ecf5ff;
    color: #409eff;
  }

  &.notice-comment {
    background-color: #fef0f0;
    color: #f56c6c;
  }

  &.notice-article {
    background-color: #f0f9eb;
    color: #67c23a;
  }
}

.notice-content {
  flex: 1;
  min-width: 0;
}

.notice-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
}

.notice-text {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.notice-delete {
  opacity: 0;
  flex-shrink: 0;
  margin-left: 10px;
}

:deep(.dark) {
  .notice-item.notice-unread {
    background-color: rgba(64, 158, 255, 0.1);
  }
}
</style>
