<template>
  <div class="messages-page">
    <component :is="navbarComponent" />

    <div class="messages-shell">
      <!-- Left: conversation list -->
      <aside class="room-list">
        <h2 class="panel-title">Messages</h2>

        <div v-if="loadingRooms" class="muted pad">Loading conversations…</div>

        <div v-else-if="rooms.length === 0" class="muted pad">
          <i class="far fa-comments empty-glyph"></i>
          <p>No conversations yet.</p>
          <small>A chat opens automatically once a client accepts an offer.</small>
        </div>

        <ul v-else class="rooms">
          <li
            v-for="room in rooms"
            :key="room.id"
            class="room"
            :class="{ active: activeRoom && activeRoom.id === room.id }"
            @click="openRoom(room)"
          >
            <div class="room-avatar"><i class="fas fa-user"></i></div>
            <div class="room-meta">
              <span class="room-name">{{ roomLabel(room) }}</span>
              <span class="room-sub">Job #{{ room.job_id }}</span>
            </div>
          </li>
        </ul>
      </aside>

      <!-- Right: active conversation -->
      <section class="conversation">
        <template v-if="activeRoom">
          <header class="conversation-header">
            <div class="room-avatar"><i class="fas fa-user"></i></div>
            <div>
              <div class="conversation-title">{{ roomLabel(activeRoom) }}</div>
              <div class="conversation-sub">Job #{{ activeRoom.job_id }}</div>
            </div>
          </header>

          <div ref="thread" class="thread">
            <div v-if="loadingMessages" class="muted pad">Loading messages…</div>
            <div v-else-if="messages.length === 0" class="muted pad center">
              No messages yet — say hello 👋
            </div>
            <div
              v-for="message in messages"
              :key="message.id"
              class="bubble-row"
              :class="{ mine: isMine(message) }"
            >
              <div class="bubble">
                <p class="bubble-text">{{ message.body }}</p>
                <span class="bubble-time">{{ formatTime(message.created_at) }}</span>
              </div>
            </div>
          </div>

          <form class="composer" @submit.prevent="send">
            <input
              v-model="draft"
              class="composer-input"
              placeholder="Write a message…"
              :disabled="sending"
            />
            <button class="composer-send" type="submit" :disabled="sending || !draft.trim()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </template>

        <div v-else class="conversation-empty">
          <i class="far fa-comment-dots empty-glyph big"></i>
          <p>Select a conversation to start chatting.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import ClientNavbar from '@/components/ClientNavbar.vue'
import { commonAPI } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

export default {
  name: 'Messages',
  components: { Navbar, ClientNavbar },
  setup() {
    const { state, userType } = useAuth()
    return { auth: state, userType, toast: useToast() }
  },
  data() {
    return {
      rooms: [],
      activeRoom: null,
      messages: [],
      draft: '',
      loadingRooms: true,
      loadingMessages: false,
      sending: false
    }
  },
  computed: {
    // Freelancers ('user') see the freelancer navbar; clients see theirs.
    navbarComponent() {
      return this.userType === 'client' ? 'ClientNavbar' : 'Navbar'
    }
  },
  async mounted() {
    await this.loadRooms()
  },
  methods: {
    async loadRooms() {
      this.loadingRooms = true
      try {
        const { data } = await commonAPI.getChatRooms()
        this.rooms = data?.data || []
        // Auto-open the first conversation for convenience.
        if (this.rooms.length) await this.openRoom(this.rooms[0])
      } catch (err) {
        this.rooms = []
      } finally {
        this.loadingRooms = false
      }
    },
    async openRoom(room) {
      this.activeRoom = room
      this.loadingMessages = true
      this.messages = []
      try {
        const { data } = await commonAPI.getChatMessages(room.id)
        this.messages = data?.data || []
        this.scrollToBottom()
      } catch (err) {
        this.toast.error('Could not load this conversation.')
      } finally {
        this.loadingMessages = false
      }
    },
    async send() {
      const body = this.draft.trim()
      if (!body || !this.activeRoom) return
      this.sending = true
      try {
        const { data } = await commonAPI.sendMessage(this.activeRoom.id, { body })
        if (data?.data) this.messages.push(data.data)
        this.draft = ''
        this.scrollToBottom()
      } catch (err) {
        this.toast.error('Message could not be sent.')
      } finally {
        this.sending = false
      }
    },
    // A message is "mine" when its sender type matches my account type.
    isMine(message) {
      return message.sender_type === this.userType
    },
    roomLabel(room) {
      // Rooms only carry ids, so label by the counterpart's role.
      return this.userType === 'client' ? 'Freelancer' : 'Client'
    },
    formatTime(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      return d.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.thread
        if (el) el.scrollTop = el.scrollHeight
      })
    }
  }
}
</script>

<style scoped>
.messages-page { min-height: 100vh; background: #F5F5F5; }
.messages-shell { max-width: 1100px; margin: 24px auto; display: grid; grid-template-columns: 320px 1fr; gap: 20px; padding: 0 16px; height: calc(100vh - 140px); }

.room-list, .conversation { background: #fff; border: 1px solid #E0E0E0; border-radius: 20px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); overflow: hidden; display: flex; flex-direction: column; }

.panel-title { font-size: 22px; font-weight: 700; color: #111; padding: 22px 22px 12px; margin: 0; }
.rooms { list-style: none; margin: 0; padding: 8px; overflow-y: auto; }
.room { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; cursor: pointer; transition: background 0.15s; }
.room:hover { background: #F4F8F8; }
.room.active { background: #E8F6F5; }
.room-avatar { width: 44px; height: 44px; border-radius: 50%; background: #E8F6F5; color: #0C9892; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.room-meta { display: flex; flex-direction: column; min-width: 0; }
.room-name { font-weight: 700; color: #111; }
.room-sub { font-size: 13px; color: #888; }

.conversation-header { display: flex; align-items: center; gap: 12px; padding: 16px 22px; border-bottom: 1px solid #EFEFEF; }
.conversation-title { font-weight: 700; color: #111; }
.conversation-sub { font-size: 13px; color: #888; }

.thread { flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; gap: 12px; }
.bubble-row { display: flex; }
.bubble-row.mine { justify-content: flex-end; }
.bubble { max-width: 70%; background: #fff; border: 1px solid #E6E6E6; padding: 10px 14px; border-radius: 16px 16px 16px 4px; }
.bubble-row.mine .bubble { background: linear-gradient(135deg, #0C9892, #14B5A5); border: none; color: #fff; border-radius: 16px 16px 4px 16px; }
.bubble-text { margin: 0; line-height: 1.5; word-break: break-word; }
.bubble-time { display: block; margin-top: 4px; font-size: 11px; opacity: 0.7; }

.composer { display: flex; gap: 10px; padding: 16px; border-top: 1px solid #EFEFEF; }
.composer-input { flex: 1; border: 1px solid #DDD; border-radius: 30px; padding: 12px 18px; font-size: 15px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.composer-input:focus { border-color: #0C9892; box-shadow: 0 0 0 3px rgba(12,152,146,0.12); }
.composer-send { width: 48px; height: 48px; border: none; border-radius: 50%; background: linear-gradient(135deg, #0C9892, #14B5A5); color: #fff; font-size: 16px; cursor: pointer; transition: transform 0.15s, opacity 0.2s; }
.composer-send:hover:not(:disabled) { transform: translateY(-2px); }
.composer-send:disabled { opacity: 0.5; cursor: not-allowed; }

.conversation-empty, .muted { color: #888; }
.conversation-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
.muted.pad { padding: 22px; }
.muted.center { text-align: center; margin: auto; }
.empty-glyph { font-size: 34px; color: #0C9892; display: block; margin-bottom: 10px; }
.empty-glyph.big { font-size: 54px; }

@media (max-width: 860px) {
  .messages-shell { grid-template-columns: 1fr; height: auto; }
  .conversation { min-height: 60vh; }
}
</style>
