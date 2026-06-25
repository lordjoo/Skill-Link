// Barrel file: import any resource group from a single place, e.g.
//   import { userAPI, commonAPI } from '@/api'
// The underlying axios instance is the default export of apiClient.js, re-exported
// here as the default export too (so `import api from '@/api'` also works).
export { default } from './apiClient'
export { authAPI } from './auth'
export { userAPI } from './user'
export { clientAPI } from './client'
export { commonAPI } from './common'
