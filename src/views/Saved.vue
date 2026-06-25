<template>
  <div class="saved-page">
    <Navbar />
    <div class="container py-5 px-4">
      <h1 class="page-title">Saved jobs</h1>

      <!-- Loading -->
      <div v-if="loading" class="state-box">Loading your saved jobs…</div>

      <!-- Empty -->
      <div v-else-if="jobs.length === 0" class="state-box">
        <i class="far fa-bookmark state-icon"></i>
        <p>You haven't saved any jobs yet.</p>
        <button class="btn-browse" @click="$router.push('/home')">Browse jobs</button>
      </div>

      <!-- List -->
      <div v-else class="jobs-feed">
        <div class="job-card mb-4" v-for="job in jobs" :key="job.id">
          <div class="job-header">
            <h5 class="job-title">{{ job.title }}</h5>
            <i
              class="fas fa-bookmark action-icon bookmark-icon bookmarked"
              title="Remove from saved"
              @click="unsave(job)"
            ></i>
          </div>
          <p class="job-desc">{{ job.description }}</p>
          <div class="job-footer">
            <span class="job-budget">${{ job.budget }}</span>
            <span class="job-speciality">{{ job.speciality }}</span>
            <button class="btn-view" @click="$router.push(`/project/${job.id}`)">View details</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Robot Icon -->
    <div class="robot-wrapper" @click="toggleChatbot">
      <div class="robot-circle"><img src="/assets/Chat bot.png" alt="Robot" class="robot-img"></div>
    </div>

    <!-- Chatbot Modal -->
    <div v-if="showChatbot" class="chatbot-modal" @click.self="closeChatbot">
      <div class="chatbot-container">
        <div class="chatbot-header"><h3>SkillLink Chatbot</h3><button class="close-chatbot" @click="closeChatbot"><i class="fas fa-times"></i></button></div>
        <div class="chatbot-body"><iframe src="https://graduation-chatbot-project--toqamohsen592.replit.app" frameborder="0" class="chatbot-iframe"></iframe></div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { userAPI } from '@/api'
import { useToast } from '@/composables/useToast'

export default {
  name: 'Saved',
  components: { Navbar },
  setup() {
    return { toast: useToast() }
  },
  data() {
    return {
      showChatbot: false,
      loading: true,
      jobs: []
    }
  },
  async mounted() {
    await this.loadSavedJobs()
  },
  methods: {
    async loadSavedJobs() {
      this.loading = true
      try {
        const { data } = await userAPI.getSavedJobs()
        this.jobs = data?.data || []
      } catch (err) {
        // Backend unreachable or not a freelancer — show an empty list rather than crash.
        this.jobs = []
      } finally {
        this.loading = false
      }
    },
    async unsave(job) {
      // Optimistically remove from the list, then tell the server.
      const previous = this.jobs
      this.jobs = this.jobs.filter((j) => j.id !== job.id)
      try {
        await userAPI.unsaveJob(job.id)
        this.toast.success('Removed from saved jobs')
      } catch (err) {
        this.jobs = previous // roll back on failure
        this.toast.error('Could not remove this job. Please try again.')
      }
    },
    toggleChatbot() { this.showChatbot = !this.showChatbot; },
    closeChatbot() { this.showChatbot = false; }
  }
}
</script>

<style scoped>
.saved-page { min-height: 100vh; background-color: #F5F5F5; padding-bottom: 50px; }
.page-title { font-size: 32px; font-weight: 700; color: #000000; margin-bottom: 30px; }
.jobs-feed { max-width: 900px; margin: 0 auto; }
.state-box { max-width: 900px; margin: 40px auto; background: #fff; border: 1px solid #E0E0E0; border-radius: 20px; padding: 50px; text-align: center; color: #666; font-size: 18px; }
.state-icon { font-size: 42px; color: #0C9892; display: block; margin-bottom: 15px; }
.btn-browse, .btn-view { margin-top: 15px; padding: 10px 24px; background: #0C9892; color: #fff; border: none; border-radius: 25px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-browse:hover, .btn-view:hover { background: #0a827d; }
.job-card { background-color: white; border-radius: 20px; padding: 25px; box-shadow: 3px 3px 6px rgba(0,0,0,0.1); transition: transform 0.2s; border: 1px solid #E0E0E0; margin-bottom: 25px; }
.job-card:hover { transform: translateY(-2px); box-shadow: 4px 4px 8px rgba(0,0,0,0.15); }
.job-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.job-title { font-size: 22px; font-weight: 700; color: #000; margin: 0; }
.job-desc { font-size: 16px; line-height: 1.6; color: #444; margin: 0 0 18px; }
.job-footer { display: flex; align-items: center; gap: 18px; padding-top: 15px; border-top: 1px solid #f0f0f0; }
.job-budget { font-size: 18px; font-weight: 700; color: #0C9892; }
.job-speciality { font-size: 14px; color: #666; background: #F0F0F0; padding: 4px 12px; border-radius: 20px; }
.job-footer .btn-view { margin-top: 0; margin-left: auto; }
.action-icon { font-size: 22px; cursor: pointer; transition: all 0.2s; color: #999; }
.action-icon:hover { transform: scale(1.15); }
.bookmark-icon.bookmarked { color: #0C9892; }
.robot-wrapper { position: fixed; right: 30px; top: 50%; transform: translateY(-50%); z-index: 100; animation: bounce 2s ease-in-out infinite; cursor: pointer; }
@keyframes bounce { 0%, 100% { transform: translateY(-50%) translateY(0); } 50% { transform: translateY(-50%) translateY(-15px); } }
.robot-circle { width: 70px; height: 70px; border-radius: 50%; background-color: #FFFFFF; border: 3px solid #0C9892; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 6px rgba(0,0,0,0.16); transition: transform 0.2s; overflow: hidden; }
.robot-circle:hover { transform: scale(1.1); }
.robot-img { width: 50px; height: 50px; object-fit: contain; }
.chatbot-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.chatbot-container { background-color: white; border-radius: 20px; width: 90%; max-width: 500px; height: 80vh; max-height: 700px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; animation: slideUp 0.3s ease; }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.chatbot-header { background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
.chatbot-header h3 { margin: 0; font-size: 20px; font-weight: 700; }
.close-chatbot { background: none; border: none; color: white; font-size: 24px; cursor: pointer; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; }
.close-chatbot:hover { background-color: rgba(255,255,255,0.2); transform: rotate(90deg); }
.chatbot-body { flex: 1; overflow: hidden; }
.chatbot-iframe { width: 100%; height: 100%; border: none; }
@media (max-width: 768px) { .robot-wrapper { display: none; } }
</style>
