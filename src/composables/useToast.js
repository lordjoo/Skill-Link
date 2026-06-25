import { reactive } from 'vue'

// ---------------------------------------------------------------------------
// useToast — app-wide "toast" notifications (the small messages that slide in at
// the corner of the screen).
// ---------------------------------------------------------------------------
// The state lives in a single shared object (a module-level singleton), so any
// component can push a toast and the one <ToastHost /> in App.vue renders them.
//
// Usage from any component (Options API or Composition API):
//
//   import { useToast } from '@/composables/useToast'
//   const toast = useToast()
//   toast.success('Saved!')
//   toast.error('Could not save your changes.')
//
// Prefer this over `alert(...)` — it is non-blocking and looks far better.

const state = reactive({
  items: [] // each item: { id, message, type }
})

let nextId = 1

function dismiss(id) {
  const index = state.items.findIndex((t) => t.id === id)
  if (index !== -1) state.items.splice(index, 1)
}

function show(message, type = 'info', timeout = 3500) {
  const id = nextId++
  state.items.push({ id, message, type })
  if (timeout) {
    setTimeout(() => dismiss(id), timeout)
  }
  return id
}

export function useToast() {
  return {
    state,
    show,
    success: (msg, t) => show(msg, 'success', t),
    error: (msg, t) => show(msg, 'error', t),
    info: (msg, t) => show(msg, 'info', t),
    dismiss
  }
}
