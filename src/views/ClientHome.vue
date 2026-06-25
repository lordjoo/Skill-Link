<template>
  <div class="client-dashboard">
    <div v-if="showBackButton" class="back-to-skilllink">
      <button @click="goBackToSkillLink" class="btn-back">
        <i class="fas fa-arrow-left"></i> Back to SkillLink
      </button>
    </div>

    <ClientNavbar />
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading dashboard...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-overlay">
      <p>{{ error }}</p>
      <button @click="refreshData" class="btn-retry">Try Again</button>
    </div>
    
    <!-- Dashboard Content (Only show if loaded) -->
    <div v-else class="dashboard-container">
      <div class="stats-section">
        <h2 class="section-heading">Dashboard</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">{{ totalProjects }}</span>
            <span class="stat-label">Total Projects</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ activeProjectsCount }}</span>
            <span class="stat-label">Active Projects</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ finishedProjectsCount }}</span>
            <span class="stat-label">Finished Projects</span>
          </div>
        </div>
      </div>

      <div class="wallet-section">
        <h2 class="section-heading">Wallet</h2>
        <div class="wallet-card">
          <div class="wallet-balances">
            <div class="wallet-item">
              <span class="wallet-label">Available</span>
              <span class="wallet-value">${{ walletBalance }}</span>
            </div>
            <div class="wallet-divider"></div>
            <div class="wallet-item">
              <span class="wallet-label">Held in escrow</span>
              <span class="wallet-value held">${{ walletHeld }}</span>
            </div>
          </div>
          <div class="wallet-topup">
            <input type="number" min="1" step="any" v-model.number="topUpAmount" placeholder="Amount ($)" class="wallet-input">
            <button class="btn-topup" @click="goTopUp" :disabled="!topUpAmount">Top up</button>
          </div>
        </div>
      </div>

      <div class="create-project-section">
        <h2 class="section-heading">Create project</h2>
        <button v-if="!showCreateForm" class="btn-create-project" @click="toggleCreateForm">+ Create new project</button>
        
        <div v-if="showCreateForm" class="create-form-container">
          <div class="form-header">
            <h3>Create new project</h3>
            <button class="btn-close" @click="toggleCreateForm">&times;</button>
          </div>
          <form @submit.prevent="publishProject">
            <div class="form-row">
              <div class="form-group">
                <input type="text" v-model="projectForm.title" placeholder="Title" class="form-input" required>
              </div>
              <div class="form-group">
                <input type="number" v-model.number="projectForm.budget" placeholder="Budget" class="form-input" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <input type="text" v-model="projectForm.speciality" placeholder="Speciality (e.g. frontend)" class="form-input" required>
              </div>
              <div class="form-group">
                <input type="text" v-model="projectForm.skills" placeholder="Needed skills (comma separated)" class="form-input">
              </div>
            </div>
            <p class="form-hint">Tip: the speciality must match a freelancer's speciality for the job to appear in their feed.</p>
            <div class="form-group full-width">
              <textarea v-model="projectForm.description" placeholder="Description" class="form-input form-textarea" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn-publish" :disabled="submitting">
              {{ submitting ? 'Publishing...' : 'Publish now' }}
            </button>
          </form>
        </div>
      </div>

      <div class="recent-projects-section">
        <h2 class="section-heading">Recent projects</h2>
        <div class="projects-table" v-if="allProjects.length">
          <div class="table-header">
            <span class="col-title">Title</span>
            <span class="col-state">Status</span>
            <span class="col-date">Date</span>
            <span class="col-action">Action</span>
          </div>
          <div class="table-body">
            <div class="table-row" v-for="project in allProjects" :key="project.id">
              <span class="col-title">{{ project.title }}</span>
              <span class="col-state" :class="`state-${project.status}`">{{ statusLabel(project.status) }}</span>
              <span class="col-date">{{ formatDate(project.created_at) }}</span>
              <span class="col-action">
                <button v-if="canApprove(project)" class="btn-approve" @click="approveCompletion(project)">Approve work</button>
                <span v-else class="action-dash">—</span>
              </span>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-gray-500 py-4">You haven't posted any projects yet.</p>
      </div>

      <div class="offers-section">
        <h2 class="section-heading">Offers</h2>
        <div class="offers-grid" v-if="offers.length > 0">
          <div class="offer-card" v-for="offer in offers" :key="offer.id">
            <div class="offer-header">
              <div class="freelancer-info">
                <div class="offer-avatar-fallback"><i class="fas fa-user"></i></div>
                <span class="offer-name">Freelancer #{{ offer.user_id }}</span>
              </div>
              <span class="offer-price">${{ offer.budget }}</span>
            </div>
            <div class="offer-details">
              <span class="offer-project">{{ offer.jobTitle }}</span>
              <span class="offer-duration">{{ offer.time_to_finish }}</span>
            </div>
            <p class="offer-desc">{{ offer.description }}</p>
            <button class="btn-accept" @click="acceptOffer(offer)" :disabled="accepting">
              {{ accepting ? 'Accepting…' : 'Accept offer' }}
            </button>
          </div>
        </div>
        <p v-else class="text-center text-gray-500 py-4">No offers yet — they'll appear here when freelancers apply to your open jobs.</p>
      </div>
    </div>

    <!-- Robot Icon -->
    <div class="robot-wrapper" @click="toggleChatbot">
      <div class="robot-circle"><img src="/assets/Chat bot.png" alt="Robot" class="robot-img"></div>
    </div>

    <!-- Chatbot Modal -->
    <div v-if="showChatbot" class="chatbot-modal" @click.self="closeChatbot">
      <div class="chatbot-container">
        <div class="chatbot-header">
          <h3>SkillLink Chatbot</h3>
          <button class="close-chatbot" @click="closeChatbot">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="chatbot-body">
          <iframe 
            src="https://graduation-chatbot-project--toqamohsen592.replit.app" 
            frameborder="0"
            class="chatbot-iframe"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClientNavbar from '@/components/ClientNavbar.vue'
import { clientAPI } from '@/api'
import { useToast } from '@/composables/useToast'

export default {
  name: 'ClientHome',
  components: { ClientNavbar },
  setup() {
    return { toast: useToast() }
  },
  data() {
    return {
      showBackButton: false,
      showChatbot: false,
      showCreateForm: false,

      // API States
      loading: true,
      error: null,
      submitting: false,
      accepting: false,

      // Form Data — maps to the backend job schema:
      // { title, description, budget, speciality, needed_skills[] }
      projectForm: { title: '', budget: '', speciality: '', skills: '', description: '' },

      // Real data from the API
      clientProjects: [],
      offers: [],
      wallet: null,
      topUpAmount: ''
    }
  },

  async mounted() {
    if (document.referrer.includes('replit.app')) {
      this.showBackButton = true;
    }
    await this.loadDashboardData()
  },

  computed: {
    allProjects() { return this.clientProjects },
    totalProjects() { return this.clientProjects.length },
    activeProjectsCount() {
      return this.clientProjects.filter(p => p.status === 'open' || p.status === 'in_progress').length
    },
    finishedProjectsCount() {
      return this.clientProjects.filter(p => p.status === 'completed').length
    },
    walletBalance() { return Number(this.wallet?.balance ?? 0).toFixed(2) },
    walletHeld() { return Number(this.wallet?.held_balance ?? 0).toFixed(2) }
  },

  methods: {
    toggleChatbot() { this.showChatbot = !this.showChatbot; },
    closeChatbot() { this.showChatbot = false; },

    goBackToSkillLink() {
      const returnPage = localStorage.getItem('returnPage') || '/';
      window.location.href = returnPage;
    },

    // === Load everything: jobs, offers on open jobs, and the wallet ===
    async loadDashboardData() {
      this.loading = true
      this.error = null
      try {
        // Jobs
        const jobsRes = await clientAPI.getMyJobs()
        this.clientProjects = jobsRes.data?.data || []

        // Pending offers across the client's open jobs
        const offers = []
        for (const job of this.clientProjects) {
          if (job.status !== 'open') continue
          try {
            const offersRes = await clientAPI.getJobOffers(job.id)
            const jobOffers = offersRes.data?.data || []
            offers.push(...jobOffers
              .filter(o => o.status === 'pending')
              .map(o => ({ ...o, jobTitle: job.title })))
          } catch (e) { /* job may have no offers */ }
        }
        this.offers = offers

        // Wallet (best-effort)
        try {
          const walletRes = await clientAPI.getWallet()
          this.wallet = walletRes.data?.data || null
        } catch (e) { /* wallet optional */ }
      } catch (err) {
        this.error = err.response?.data?.message || 'Could not load your dashboard.'
        this.clientProjects = []
        this.offers = []
      } finally {
        this.loading = false
      }
    },

    async refreshData() {
      await this.loadDashboardData()
    },

    toggleCreateForm() { this.showCreateForm = !this.showCreateForm; },

    async publishProject() {
      if (!this.projectForm.title || !this.projectForm.budget || !this.projectForm.speciality) {
        this.toast.error('Please fill in title, budget and speciality.')
        return
      }

      this.submitting = true
      try {
        const needed_skills = this.projectForm.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)

        await clientAPI.createJob({
          title: this.projectForm.title,
          description: this.projectForm.description,
          budget: Number(this.projectForm.budget),
          speciality: this.projectForm.speciality.trim(),
          needed_skills
        })

        this.toast.success('Project published.')
        this.projectForm = { title: '', budget: '', speciality: '', skills: '', description: '' }
        this.showCreateForm = false
        await this.loadDashboardData()
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Could not publish the project.')
      } finally {
        this.submitting = false
      }
    },

    // === Accept an offer: holds the budget in escrow from the client's wallet ===
    async acceptOffer(offer) {
      this.accepting = true
      try {
        await clientAPI.acceptOffer(offer.id)
        this.toast.success('Offer accepted — funds are held in escrow and a chat room is open.')
        await this.loadDashboardData()
      } catch (err) {
        const msg = err.response?.data?.message || ''
        if (/insufficient/i.test(msg)) {
          this.toast.error('Not enough wallet balance — top up your wallet to accept this offer.')
        } else {
          this.toast.error(msg || 'Could not accept this offer.')
        }
      } finally {
        this.accepting = false
      }
    },

    // === Approve completed work: releases the held funds to the freelancer ===
    async approveCompletion(job) {
      try {
        await clientAPI.approveCompletion(job.id)
        this.toast.success('Completion approved — funds released to the freelancer.')
        await this.loadDashboardData()
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Could not approve completion.')
      }
    },

    // Whether the freelancer has submitted work that the client can approve.
    canApprove(job) {
      return job.status === 'in_progress' && job.user_submitted_completion_at && !job.client_approved_completion_at
    },

    // Top up the wallet via the (mock) payment gateway on the Payment screen.
    goTopUp() {
      this.$router.push({ path: '/payment', query: { topup: '1', price: this.topUpAmount || '', projectTitle: 'Wallet top-up' } })
    },

    statusLabel(status) {
      const labels = { open: 'Open', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled' }
      return labels[status] || status || 'Open'
    },

    formatDate(dateString) {
      if (!dateString) return 'Recently'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

.back-to-skilllink { position: fixed; top: 20px; left: 20px; z-index: 9999; }
.btn-back { background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 3px 3px 8px rgba(0,0,0,0.2); transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
.btn-back:hover { transform: translateY(-2px); box-shadow: 4px 4px 12px rgba(0,0,0,0.3); }

.client-dashboard { min-height: 100vh; background-color: #F5F5F5; padding-bottom: 50px; }
.dashboard-container { max-width: 1200px; margin: 0 auto; padding: 30px 20px; }
.section-heading { font-size: 28px; font-weight: 700; color: #000000; margin-bottom: 20px; }

/* Loading & Error Overlays (New - Minimal) */
.loading-overlay, .error-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2000; }
.error-overlay { color: #dc3545; }
.spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #0C9892; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.btn-retry { padding: 10px 25px; background: #0C9892; color: white; border: none; border-radius: 25px; cursor: pointer; margin-top: 15px; }

.stats-section { margin-bottom: 40px; }
.stats-grid { display: flex; gap: 25px; }
.stat-card { flex: 1; background-color: #FFFFFF; border-radius: 15px; padding: 25px 30px; box-shadow: 3px 3px 6px rgba(0,0,0,0.1); border: 1px solid #E0E0E0; display: flex; flex-direction: column; align-items: center; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 4px 4px 10px rgba(0,0,0,0.15); }
.stat-number { font-size: 42px; font-weight: 700; color: #000000; line-height: 1; margin-bottom: 8px; }
.stat-label { font-size: 16px; color: #666; font-weight: 500; }

/* Wallet */
.wallet-section { margin-bottom: 40px; }
.wallet-card { background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); border-radius: 18px; padding: 26px 30px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; box-shadow: 0 8px 22px rgba(12,152,146,0.25); color: #fff; }
.wallet-balances { display: flex; align-items: center; gap: 28px; }
.wallet-item { display: flex; flex-direction: column; gap: 4px; }
.wallet-label { font-size: 14px; opacity: 0.85; }
.wallet-value { font-size: 30px; font-weight: 700; line-height: 1; }
.wallet-value.held { opacity: 0.9; }
.wallet-divider { width: 1px; height: 44px; background: rgba(255,255,255,0.35); }
.wallet-topup { display: flex; gap: 10px; }
.wallet-input { width: 140px; padding: 12px 16px; border: none; border-radius: 25px; font-size: 16px; outline: none; }
.btn-topup { background: #fff; color: #0C9892; border: none; border-radius: 25px; padding: 12px 24px; font-weight: 700; cursor: pointer; transition: transform 0.15s; }
.btn-topup:hover:not(:disabled) { transform: translateY(-2px); }
.btn-topup:disabled { opacity: 0.6; cursor: not-allowed; }

.form-hint { font-size: 13px; color: #888; margin: -6px 0 18px; }

.create-project-section { margin-bottom: 40px; }
.btn-create-project { width: 100%; padding: 16px 30px; background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: #FFFFFF; border: none; border-radius: 30px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 3px 3px 8px rgba(12, 152, 146, 0.3); }
.btn-create-project:hover { background: linear-gradient(135deg, #0a827d 0%, #129e96 100%); transform: translateY(-2px); box-shadow: 5px 5px 12px rgba(12, 152, 146, 0.4); }
.create-form-container { margin-top: 30px; background-color: #FFFFFF; border-radius: 20px; padding: 35px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border: 2px solid #E0E0E0; animation: slideDown 0.3s ease-out; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #E0E0E0; }
.form-header h3 { font-size: 24px; font-weight: 700; color: #0C9892; margin: 0; }
.btn-close { background: none; border: none; font-size: 32px; color: #999; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s; }
.btn-close:hover { background-color: #F5F5F5; color: #E63946; }
.form-row { display: flex; gap: 20px; margin-bottom: 20px; }
.form-group { flex: 1; }
.form-group.full-width { margin-bottom: 25px; }
.form-input { width: 100%; padding: 14px 20px; border: 2px solid #CCCCCC; border-radius: 15px; font-size: 16px; outline: none; transition: all 0.3s; background-color: #FFFFFF; box-shadow: 2px 2px 6px rgba(0,0,0,0.08); font-family: 'Lato', sans-serif; }
.form-input:focus { border-color: #0C9892; box-shadow: 0 0 0 4px rgba(12, 152, 146, 0.15); }
.form-input::placeholder { color: #CCCCCC; }
.form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 15px center; background-size: 20px; padding-right: 45px; cursor: pointer; }
.form-textarea { resize: vertical; min-height: 120px; }
.btn-publish { width: 100%; padding: 16px 30px; background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: #FFFFFF; border: none; border-radius: 30px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 3px 3px 8px rgba(12, 152, 146, 0.3); }
.btn-publish:hover { background: linear-gradient(135deg, #0a827d 0%, #129e96 100%); transform: translateY(-2px); box-shadow: 5px 5px 12px rgba(12, 152, 146, 0.4); }
.btn-publish:disabled { background: #ccc; cursor: not-allowed; transform: none; }

.recent-projects-section { margin-bottom: 40px; }
.projects-table { background-color: #FFFFFF; border-radius: 20px; box-shadow: 3px 3px 6px rgba(0,0,0,0.1); border: 1px solid #E0E0E0; overflow: hidden; }
.table-header { display: flex; padding: 18px 30px; background-color: #F8F8F8; font-weight: 700; font-size: 16px; color: #333; border-bottom: 2px solid #E0E0E0; }
.table-body { max-height: 400px; overflow-y: auto; }
.table-row { display: flex; padding: 16px 30px; align-items: center; border-bottom: 1px solid #F0F0F0; transition: background-color 0.2s; }
.table-row:hover { background-color: #F8FFFF; }
.table-row:last-child { border-bottom: none; }
.col-title { flex: 2; font-size: 16px; color: #000; font-weight: 500; }
.col-state { flex: 1; font-size: 15px; font-weight: 600; }
.col-date { flex: 1; font-size: 15px; color: #666; }
.col-action { flex: 1; text-align: right; }
.state-open { color: #0C9892; }
.state-in_progress { color: #3B82F6; }
.state-completed { color: #22C55E; }
.state-cancelled { color: #999; }
.btn-approve { background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: #fff; border: none; border-radius: 20px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; transition: transform 0.15s; }
.btn-approve:hover { transform: translateY(-1px); }
.action-dash { color: #ccc; }
.table-footer { text-align: center; padding: 15px; border-top: 1px solid #E0E0E0; cursor: pointer; transition: background-color 0.2s; }
.table-footer:hover { background-color: #F8FFFF; }
.table-footer i { font-size: 20px; color: #0C9892; }

.offers-section { margin-bottom: 40px; }
.offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.offer-card { background-color: #FFFFFF; border-radius: 15px; padding: 20px; box-shadow: 3px 3px 6px rgba(0,0,0,0.1); border: 1px solid #E0E0E0; transition: transform 0.2s; }
.offer-avatar-fallback { width: 40px; height: 40px; border-radius: 50%; background: #E8F6F5; color: #0C9892; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.offer-desc { font-size: 14px; color: #555; line-height: 1.5; margin: 0 0 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.offer-card:hover { transform: translateY(-3px); box-shadow: 4px 4px 10px rgba(0,0,0,0.15); }
.offer-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #E0E0E0; }
.freelancer-info { display: flex; align-items: center; gap: 12px; cursor: pointer; flex: 1; }
.freelancer-info:hover .offer-name { color: #0C9892; text-decoration: underline; }
.offer-avatar { width: 40px; height: 40px; object-fit: cover; border: 2px solid #0C9892; }
.offer-name { font-size: 16px; font-weight: 700; color: #000; transition: all 0.2s; }
.offer-price { font-size: 18px; font-weight: 700; color: #0C9892; }
.offer-details { display: flex; justify-content: space-between; margin-bottom: 15px; }
.offer-project { font-size: 14px; color: #333; font-weight: 500; }
.offer-duration { font-size: 14px; color: #666; }
.btn-accept { width: 100%; padding: 12px 20px; background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: #FFFFFF; border: none; border-radius: 25px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 3px 3px 6px rgba(12, 152, 146, 0.3); }
.btn-accept:hover { background: linear-gradient(135deg, #0a827d 0%, #129e96 100%); transform: translateY(-2px); box-shadow: 4px 4px 10px rgba(12, 152, 146, 0.4); }
.btn-accept:disabled { background: #ccc; cursor: not-allowed; }

.carousel-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 45px; height: 45px; border-radius: 50%; background-color: #0C9892; border: none; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; box-shadow: 3px 3px 6px rgba(0,0,0,0.16); z-index: 10; }
.carousel-arrow:hover { background-color: #0a827d; transform: translateY(-50%) scale(1.1); box-shadow: 4px 4px 8px rgba(0,0,0,0.2); }
.carousel-arrow.left { left: 0; }
.carousel-arrow.right { right: 0; }

/* Robot & Chatbot (Unchanged) */
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

@media (max-width: 768px) { 
  .stats-grid { flex-direction: column; } 
  .form-row { flex-direction: column; gap: 15px; } 
  .offers-carousel { padding: 0 40px; } 
  .offer-card { min-width: calc(100% - 20px); } 
  .carousel-arrow { width: 35px; height: 35px; font-size: 14px; } 
  .robot-wrapper { display: none; } 
  .create-form-container { padding: 25px; } 
}
</style>