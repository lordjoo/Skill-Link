<template>
  <nav class="bg-white shadow-sm py-2">
    <div class="w-full px-4 flex items-center justify-between">
      <a class="flex items-center no-underline" href="#" @click.prevent="$router.push('/')">
        <span class="brand-s">S</span><span class="brand-killlink">killLink</span>
      </a>
      <div class="nav-icons-wrapper flex items-center gap-4">
        <button class="nav-icon-btn" title="Messages" aria-label="Messages" @click="$router.push('/messages')">
          <i class="far fa-comment-dots"></i>
        </button>
        <div class="icon-with-badge">
          <button class="nav-icon-btn" :class="{ active: showNotifications }" title="Notifications" aria-label="Notifications" @click="toggleNotifications">
            <i class="far fa-bell"></i>
          </button>
          <span class="badge-notification" v-if="notifState.unreadCount > 0">{{ notifState.unreadCount }}</span>
        </div>
        <div class="profile-pic" @click="$router.push('/client-profile')">
          <img :src="avatar || '/assets/pexels danx.jpg'" alt="Profile" class="rounded-full">
        </div>
        <button class="nav-icon-btn" :class="{ active: showMenu }" title="Menu" aria-label="Menu" @click="toggleMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  </nav>


  <div v-if="showNotifications" class="notifications-dropdown">
    <div v-if="notifState.items.length === 0" class="notification-empty">
      You're all caught up — no notifications yet.
    </div>
    <div
      v-for="notif in notifState.items"
      :key="notif.id"
      class="notification-item"
      :class="{ unread: !notif.read_at }"
      @click="openNotification(notif)"
    >
      <i class="notification-bell fas fa-bell"></i>
      <div class="notification-content">
        <div class="notification-header"><h6 class="notification-name">{{ notif.title }}</h6><span class="notification-time">{{ timeAgo(notif.created_at) }}</span></div>
        <p class="notification-text">{{ notif.body }}</p>
      </div>
    </div>
  </div>

  <div v-if="showMenu" class="menu-dropdown">
    <div class="menu-item" @click="navigate('/client-profile')"><i class="fas fa-user"></i><span>Profile</span></div>
    <div class="menu-item" @click="navigate('/client-settings')"><i class="fas fa-cog"></i><span>Settings</span></div>
    <div class="menu-item" @click="navigate('/client-saved')"><i class="fas fa-bookmark"></i><span>Saved</span></div>
    <div class="menu-item" @click="navigate('/client-report')"><i class="fas fa-exclamation-triangle"></i><span>Report</span></div>
    <div class="menu-item" @click="logout"><i class="fas fa-sign-out-alt"></i><span>Logout</span></div>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import { useProfileAvatar } from '@/composables/useProfileAvatar'

export default {
  name: 'ClientNavbar',
  setup() {
    // Shared notification state (bell badge + dropdown list).
    const { state, load, markRead } = useNotifications()
    const { avatar, loadAvatar } = useProfileAvatar()
    return { notifState: state, loadNotifications: load, markNotificationRead: markRead, avatar, loadAvatar }
  },
  mounted() {
    this.loadNotifications()
    this.loadAvatar()
  },
  data() {
    return {
      showMenu: false, showNotifications: false
    }
  },
  methods: {
    // Turn an ISO timestamp into a short "2h ago" style label.
    timeAgo(iso) {
      if (!iso) return ''
      const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
      if (seconds < 60) return 'just now'
      const minutes = Math.floor(seconds / 60)
      if (minutes < 60) return `${minutes}m ago`
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}h ago`
      return `${Math.floor(hours / 24)}d ago`
    },
    openNotification(notif) {
      this.markNotificationRead(notif.id)
      this.showNotifications = false
      if (notif.link) this.$router.push(notif.link)
    },
    navigate(path) { this.$router.push(path); this.showMenu = false; },
    logout() {
      const { logout } = useAuth();
      logout();
      this.showMenu = false;
      this.$router.push('/login');
    },
    toggleMenu() { this.showMenu = !this.showMenu; this.showNotifications = false; },
    toggleNotifications() { this.showNotifications = !this.showNotifications; this.showMenu = false; }
  }
}
</script>

<style scoped>
.brand-s { font-family: 'Dancing Script', cursive; color: #0C9892; font-size: 48px; font-weight: 700; line-height: 1; margin-right: 2px; cursor: pointer; }
.brand-killlink { color: #000000; font-size: 26px; font-weight: 700; line-height: 1; }
.nav-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border: none; background: transparent; border-radius: 50%; color: #4b5563; font-size: 20px; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
.nav-icon-btn:hover { color: #0C9892; background-color: #E8F6F5; }
.nav-icon-btn.active { color: #0C9892; background-color: #E8F6F5; }
.nav-icon { width: 32px; height: 32px; cursor: pointer; transition: all 0.3s; opacity: 0.8; }
.nav-icon:hover { opacity: 1; filter: brightness(0) saturate(100%) invert(47%) sepia(77%) saturate(435%) hue-rotate(138deg) brightness(92%) contrast(92%); }
.nav-icon.active { filter: brightness(0) saturate(100%) invert(47%) sepia(77%) saturate(435%) hue-rotate(138deg) brightness(92%) contrast(92%); opacity: 1; }
.menu-icon { width: 34px; height: 34px; }
.profile-pic { cursor: pointer; }
.profile-pic img { width: 42px; height: 42px; object-fit: cover; border: 2px solid #0C9892; }
.icon-with-badge { position: relative; display: inline-block; }
.badge-message, .badge-notification { position: absolute; top: -8px; right: -8px; background-color: #E63946; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; z-index: 10; }
.messages-dropdown, .notifications-dropdown, .menu-dropdown { position: absolute; top: 75px; background-color: white; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border: 2px solid #E0E0E0; min-width: 420px; max-width: 450px; z-index: 1000; padding: 20px; }
.messages-dropdown { right: 150px; }
.notifications-dropdown { right: 90px; }
.menu-dropdown { right: 20px; min-width: 200px; }
.message-item, .notification-item, .menu-item { display: flex; align-items: center; gap: 15px; padding: 15px; border-radius: 15px; cursor: pointer; transition: background-color 0.2s; margin-bottom: 10px; }
.message-item:hover, .notification-item:hover, .menu-item:hover { background-color: #F5F5F5; }
.message-item:last-child, .notification-item:last-child, .menu-item:last-child { margin-bottom: 0; }
.message-avatar, .notification-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.message-content, .notification-content { flex: 1; min-width: 0; }
.message-header, .notification-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.message-name, .notification-name { font-size: 18px; font-weight: 700; color: #000000; margin: 0; }
.message-time, .notification-time { font-size: 14px; color: #0C9892; font-weight: 600; }
.message-text, .notification-text { font-size: 15px; color: #666; margin: 0; }
.menu-item { font-size: 16px; color: #000000; font-weight: 600; }
.menu-item i { color: #000000; width: 20px; font-size: 18px; }
.notification-item.unread { background-color: #E8F6F5; }
.notification-bell { width: 50px; height: 50px; border-radius: 50%; background: #E8F6F5; color: #0C9892; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.notification-empty { padding: 20px; text-align: center; color: #888; font-size: 15px; }
@media (max-width: 768px) { .brand-s { font-size: 36px; } .brand-killlink { font-size: 20px; } .messages-dropdown, .notifications-dropdown { right: 10px; left: 10px; min-width: auto; max-width: none; } }
</style>