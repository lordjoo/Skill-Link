<template>
  <div class="profile-page">
    <Navbar />
    <div v-if="loading" class="profile-loading">Loading your profile…</div>

    <div v-else class="profile-container">
      <div class="profile-sidebar">
        <div class="sidebar-profile-pic"><img :src="avatar" alt="Profile" class="sidebar-profile-img"></div>
        <div class="sidebar-section">
          <h3 class="sidebar-title">Contact</h3>
          <div class="contact-item"><i class="fas fa-phone"></i><span>{{ phone }}</span></div>
          <div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>{{ location }}</span></div>
          <div class="contact-item"><i class="fas fa-envelope"></i><span>{{ email }}</span></div>
        </div>
        <div v-if="university || college" class="sidebar-section">
          <h3 class="sidebar-title">Education</h3>
          <div v-if="university" class="contact-item"><i class="fas fa-university"></i><span>{{ university }}</span></div>
          <div v-if="college" class="contact-item"><i class="fas fa-graduation-cap"></i><span>{{ college }}</span></div>
        </div>
      </div>
      <div class="profile-main">
        <!-- Prompt new users to finish setting up their profile -->
        <div v-if="!hasProfile" class="complete-banner">
          <span>Your profile is looking a little empty. Add your speciality and skills so clients can find you.</span>
          <button class="complete-btn" @click="$router.push('/settings')">Complete profile</button>
        </div>

        <div class="profile-header">
          <h1 class="profile-name">{{ fullName }}</h1>
          <p class="profile-title">{{ speciality || 'Freelancer' }}</p>
          <div class="social-icons" v-if="socials.length">
            <a v-for="s in socials" :key="s.icon" :href="s.url" target="_blank" rel="noopener" class="social-icon"><i :class="s.icon"></i></a>
          </div>
        </div>

        <div class="profile-section">
          <h2 class="section-title">About</h2>
          <p v-if="about" class="about-text">{{ about }}</p>
          <p v-else class="about-text muted">No bio yet.</p>
        </div>

        <div class="profile-section">
          <h2 class="section-title">Skills</h2>
          <div v-if="skills.length" class="skills-grid">
            <span v-for="skill in skills" :key="skill" class="skill-badge">{{ skill }}</span>
          </div>
          <p v-else class="about-text muted">No skills added yet.</p>
        </div>

        <div class="profile-section">
          <h2 class="section-title">Reviews</h2>
          <p class="about-text muted">No reviews yet — reviews appear after you complete jobs.</p>
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
        <div class="chatbot-header">
          <h3>SkillLink Chatbot</h3>
          <button class="close-chatbot" @click="closeChatbot"><i class="fas fa-times"></i></button>
        </div>
        <div class="chatbot-body">
          <iframe src="https://graduation-chatbot-project--toqamohsen592.replit.app" frameborder="0" class="chatbot-iframe"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { userAPI } from '@/api'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'Profile',
  components: { Navbar },
  setup() {
    return { auth: useAuth() }
  },
  data() {
    return {
      showChatbot: false,
      loading: true,
      profile: null
    }
  },
  computed: {
    user() { return this.auth.state.user || {} },
    hasProfile() { return Boolean(this.profile && (this.profile.speciality || (this.profile.skills && this.profile.skills.length))) },
    fullName() {
      const name = [this.user.first_name, this.user.last_name].filter(Boolean).join(' ')
      return name || this.user.username || 'Your profile'
    },
    avatar() { return this.profile?.profile_picture_url || '/assets/Headshot profile.jpg' },
    email() { return this.user.email || 'Not provided' },
    phone() {
      if (!this.user.phone_number) return 'Not provided'
      return `${this.user.country_code || ''} ${this.user.phone_number}`.trim()
    },
    location() { return this.profile?.address || 'Not set' },
    speciality() { return this.profile?.speciality || '' },
    about() { return this.profile?.brief || '' },
    skills() { return Array.isArray(this.profile?.skills) ? this.profile.skills : [] },
    university() { return this.profile?.university || '' },
    college() { return this.profile?.college || '' },
    socials() {
      const list = []
      if (this.profile?.linkedin_url) list.push({ icon: 'fab fa-linkedin-in', url: this.profile.linkedin_url })
      if (this.profile?.github_url) list.push({ icon: 'fab fa-github', url: this.profile.github_url })
      if (this.profile?.behance_url) list.push({ icon: 'fab fa-behance', url: this.profile.behance_url })
      return list
    }
  },
  async mounted() {
    try {
      const { data } = await userAPI.getMyProfile()
      this.profile = data?.data || null
    } catch (err) {
      this.profile = null
    } finally {
      this.loading = false
    }
  },
  methods: {
    toggleChatbot() { this.showChatbot = !this.showChatbot; },
    closeChatbot() { this.showChatbot = false; }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
.profile-page { min-height: 100vh; background-color: #F5F5F5; padding-bottom: 50px; }
.profile-loading { max-width: 1200px; margin: 60px auto; text-align: center; color: #666; font-size: 18px; }
.muted { color: #999; }
.complete-banner { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; background: #E8F6F5; border: 1px solid #B9E2DF; border-radius: 16px; padding: 16px 20px; margin-bottom: 30px; color: #0a6b66; font-size: 15px; }
.complete-btn { background: #0C9892; color: #fff; border: none; border-radius: 25px; padding: 10px 20px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
.complete-btn:hover { background: #0a827d; }
.profile-container { display: flex; max-width: 1200px; margin: 40px auto; background-color: #FFFFFF; border-radius: 0; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); border: 2px solid #0C9892; }
.profile-sidebar { width: 350px; background: linear-gradient(180deg, #0C9892 0%, #0A827D 100%); padding: 40px 30px; color: #FFFFFF; flex-shrink: 0; }
.sidebar-profile-pic { text-align: center; margin-bottom: 35px; }
.sidebar-profile-img { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; border: 5px solid rgba(255,255,255,0.3); }
.sidebar-section { margin-bottom: 35px; padding-bottom: 35px; border-bottom: 1px solid rgba(255,255,255,0.3); }
.sidebar-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #FFFFFF; }
.contact-item { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; font-size: 15px; }
.contact-item i { width: 20px; color: rgba(255,255,255,0.8); }
.profile-main { flex: 1; padding: 50px; background-color: #FFFFFF; }
.profile-header { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #E0E0E0; }
.profile-name { font-size: 42px; font-weight: 700; color: #000000; margin: 0 0 10px 0; }
.profile-title { font-size: 22px; color: #666; margin: 0 0 20px 0; }
.social-icons { display: flex; gap: 15px; }
.social-icon { width: 40px; height: 40px; background-color: #000000; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 18px; transition: all 0.3s; }
.social-icon:hover { background-color: #0C9892; transform: translateY(-3px); }
.profile-section { margin-bottom: 45px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.section-title { font-size: 32px; font-weight: 700; color: #000000; margin: 0; }
.show-more { color: #0C9892; font-size: 16px; font-weight: 600; text-decoration: none; }
.about-text { font-size: 17px; line-height: 1.8; color: #333; margin: 0; }
.skills-grid { display: flex; flex-wrap: wrap; gap: 12px; }
.skill-badge { background: linear-gradient(135deg, #E8F5F5 0%, #F0FAFA 100%); border: 2px solid #0C9892; border-radius: 25px; padding: 10px 18px; font-size: 15px; color: #0C9892; font-weight: 600; }
.reviews-summary { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.stars { color: #FFD700; font-size: 24px; }
.rating { font-size: 24px; font-weight: 700; color: #000000; }
.reviews-count { font-size: 16px; color: #666; }
.reviews-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
.review-item { background-color: #F8F8F8; padding: 20px; border-radius: 15px; font-size: 15px; color: #333; line-height: 1.6; border: 1px solid #E0E0E0; }
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
@media (max-width: 1024px) { .profile-container { flex-direction: column; } .profile-sidebar { width: 100%; } .profile-main { padding: 30px; } }
@media (max-width: 768px) { .profile-name { font-size: 32px; } .reviews-grid { grid-template-columns: 1fr; } .robot-wrapper { display: none; } }
</style>