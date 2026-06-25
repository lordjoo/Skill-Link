<template>
  <!-- Renders all active toasts. Mounted once in App.vue so it works everywhere. -->
  <div class="toast-host">
    <transition-group name="toast">
      <div
        v-for="toast in toastState.items"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
        @click="dismiss(toast.id)"
      >
        <i class="toast-icon fas" :class="iconFor(toast.type)"></i>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'

export default {
  name: 'ToastHost',
  setup() {
    const { state, dismiss } = useToast()
    return { toastState: state, dismiss }
  },
  methods: {
    iconFor(type) {
      if (type === 'success') return 'fa-circle-check'
      if (type === 'error') return 'fa-circle-exclamation'
      return 'fa-circle-info'
    }
  }
}
</script>

<style scoped>
.toast-host { position: fixed; top: 20px; right: 20px; z-index: 11000; display: flex; flex-direction: column; gap: 12px; pointer-events: none; }
.toast { pointer-events: auto; display: flex; align-items: center; gap: 12px; min-width: 260px; max-width: 360px; padding: 14px 18px; border-radius: 14px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border-left: 5px solid #0C9892; cursor: pointer; font-size: 15px; color: #222; }
.toast--success { border-left-color: #22C55E; }
.toast--error { border-left-color: #E63946; }
.toast--info { border-left-color: #0C9892; }
.toast-icon { font-size: 20px; }
.toast--success .toast-icon { color: #22C55E; }
.toast--error .toast-icon { color: #E63946; }
.toast--info .toast-icon { color: #0C9892; }
.toast-message { flex: 1; line-height: 1.4; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
