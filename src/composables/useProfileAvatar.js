import { computed } from 'vue'
import { userAPI, clientAPI } from '@/api'
import { useAuth } from './useAuth'

// ---------------------------------------------------------------------------
// useProfileAvatar — keeps the logged-in user's profile photo in shared state.
// ---------------------------------------------------------------------------
// The avatar URL is cached on the session user object (auth.state.user
// .profile_picture_url), so every navbar that imports this stays in sync and we
// only fetch it once. Call loadAvatar() on mount; call setAvatar(url) right
// after an upload so the navbar updates instantly without a refetch.
export function useProfileAvatar() {
  const { state } = useAuth()

  const avatar = computed(() => state.user?.profile_picture_url || '')

  async function loadAvatar() {
    const user = state.user
    // Already known (or nobody logged in) — nothing to do.
    if (!user || user.profile_picture_url) return
    try {
      const res = user.type === 'client'
        ? await clientAPI.getClientProfile()
        : await userAPI.getMyProfile()
      const url = res.data?.data?.profile_picture_url
      if (url) setAvatar(url)
    } catch (err) {
      // Non-fatal: the navbar simply keeps the default image.
    }
  }

  function setAvatar(url) {
    if (!state.user) return
    state.user.profile_picture_url = url || null
    localStorage.setItem('user', JSON.stringify(state.user))
  }

  return { avatar, loadAvatar, setAvatar }
}
