import api, { multipart, isFormData } from './apiClient'

// Client endpoints (account type === 'client').
export const clientAPI = {
  // Profile
  getClientProfile: () => api.get('/client/profile'),
  updateClientProfile: (data) =>
    api.put('/client/profile', data, isFormData(data) ? multipart : undefined),
  updateProfilePicture: (formData) => api.put('/client/profile-picture', formData, multipart),
  getClients: (params) => api.get('/client/', { params }),

  sendPhoneOTP: (data) => api.post('/client/profile/phone/send-otp', data),
  verifyPhone: (data) => api.put('/client/profile/phone/verify', data),

  // Jobs & offers
  createJob: (data) => api.post('/client/jobs', data),
  getMyJobs: (params) => api.get('/client/jobs', { params }),
  getJobOffers: (jobId) => api.get(`/client/jobs/${jobId}/offers`),
  acceptOffer: (offerId) => api.post(`/client/offers/${offerId}/accept`),
  approveCompletion: (jobId) => api.post(`/client/jobs/${jobId}/approve-completion`),

  // Saved jobs (bookmarks)
  getClientSavedJobs: () => api.get('/client/saved-jobs'),
  saveJob: (jobId) => api.post(`/client/jobs/${jobId}/save`),
  unsaveJob: (jobId) => api.delete(`/client/jobs/${jobId}/save`),

  // Support / issue reports
  getMyReports: () => api.get('/client/reports'),
  submitReport: (data) => api.post('/client/reports', data),

  // Wallet & payments (runs through the backend mock gateway)
  getWallet: () => api.get('/payments/wallet'),
  topUpWallet: (data) => api.post('/payments/top-up', data)
}
