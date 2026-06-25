import { ref } from 'vue'

// ---------------------------------------------------------------------------
// useAsync — a tiny helper that removes the repetitive loading/error boilerplate
// around API calls.
// ---------------------------------------------------------------------------
// Instead of manually toggling `loading` and `try/catch`-ing in every method,
// wrap the async function once and call `run()`:
//
//   import { useAsync } from '@/composables/useAsync'
//   import { userAPI } from '@/api'
//
//   // inside setup()
//   const { data, loading, error, run } = useAsync(() => userAPI.getMyProfile())
//   run() // kicks off the request; `loading` is true while it runs
//
// `data` holds the resolved value, `loading` is a boolean, and `error` holds a
// friendly message string (or null). `run` re-runs the call and returns the
// resolved value, so you can also `await run()` and react to the result.

// Pull the clearest message out of an axios error for display.
export function extractErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return err?.response?.data?.message || err?.message || fallback
}

export function useAsync(fn, { initialData = null } = {}) {
  const data = ref(initialData)
  const loading = ref(false)
  const error = ref(null)

  async function run(...args) {
    loading.value = true
    error.value = null
    try {
      const result = await fn(...args)
      data.value = result
      return result
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, run }
}
