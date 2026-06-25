import { reactive } from 'vue'
import { commonAPI } from '@/api'

// ---------------------------------------------------------------------------
// useNotifications — shared state for the bell dropdown in the navbars.
// ---------------------------------------------------------------------------
// Like useToast, the state is a single shared object so the freelancer navbar
// and client navbar stay in sync. Call `load()` on mount to fetch the list and
// the unread badge count; call `markRead(id)` when the user opens one.
//
// The backend shape is: { data: { items: [...], unread_count: N } }.
// If the request fails (e.g. backend not running), we just leave the list empty
// instead of crashing the page.

const state = reactive({
  items: [],
  unreadCount: 0,
  loading: false,
  loaded: false
})

async function load() {
  state.loading = true
  try {
    const { data } = await commonAPI.getNotifications()
    const payload = data?.data || {}
    state.items = payload.items || []
    state.unreadCount = payload.unread_count ?? 0
    state.loaded = true
  } catch (err) {
    // Non-fatal: the bell simply shows no notifications.
    state.items = []
    state.unreadCount = 0
  } finally {
    state.loading = false
  }
}

async function markRead(id) {
  const item = state.items.find((n) => n.id === id)
  if (!item || item.read_at) return

  // Optimistically update the UI, then tell the server.
  item.read_at = new Date().toISOString()
  state.unreadCount = Math.max(0, state.unreadCount - 1)
  try {
    await commonAPI.markNotificationRead(id)
  } catch (err) {
    // Ignore — the optimistic update is good enough for the demo.
  }
}

export function useNotifications() {
  return { state, load, markRead }
}
