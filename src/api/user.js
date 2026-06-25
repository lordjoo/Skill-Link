import api, { multipart, isFormData } from './apiClient'

// Student / freelancer endpoints (account type === 'user').
export const userAPI = {
  // Profile
  getMyProfile: () => api.get('/user/profile'),
  updateMyProfile: (data) =>
    api.put('/user/profile', data, isFormData(data) ? multipart : undefined),
  updateProfilePicture: (formData) => api.put('/user/profile-picture', formData, multipart),
  getPublicProfile: (userId) => api.get(`/user/profiles/${userId}`),

  sendPhoneOTP: () => api.post('/user/profile/phone/send-otp'),
  verifyPhone: (data) => api.put('/user/profile/phone/verify', data),

  // Jobs & offers
  getRecommendedJobs: () => api.get('/user/jobs'),
  getJobDetails: (jobId) => api.get(`/user/jobs/${jobId}`),
  applyForJob: (jobId, data) => api.post(`/user/jobs/${jobId}/offers`, data),
  submitCompletion: (jobId, data) => api.post(`/user/jobs/${jobId}/submit-completion`, data),
  approveCompletion: (jobId) => api.post(`/user/jobs/${jobId}/approve-completion`),
  getMyOffers: () => api.get('/user/offers'),

  // Saved jobs (bookmarks)
  getSavedJobs: () => api.get('/user/saved-jobs'),
  saveJob: (jobId) => api.post(`/user/jobs/${jobId}/save`),
  unsaveJob: (jobId) => api.delete(`/user/jobs/${jobId}/save`),

  // Support / issue reports
  getMyReports: () => api.get('/user/reports'),
  submitReport: (data) => api.post('/user/reports', data)
}
